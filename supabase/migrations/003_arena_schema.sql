-- ================================================================
-- 003_arena_schema.sql — Scolty Arena: gamification layer
-- ================================================================

-- ── User profiles (role: owner | editor) ──────────────────────
create table if not exists user_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'editor' check (role in ('owner','editor')),
  created_at timestamptz default now()
);

alter table user_profiles enable row level security;
create policy "profiles_self" on user_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Helper functions for role-aware RLS
create or replace function get_my_editor_id()
returns uuid language sql security definer stable as $$
  select id from editors where user_id = auth.uid() limit 1;
$$;

create or replace function is_owner()
returns bool language sql security definer stable as $$
  select coalesce(
    (select role = 'owner' from user_profiles where id = auth.uid()),
    false
  );
$$;

-- ── Extend editors (gamification columns) ─────────────────────
alter table editors
  add column if not exists level          int  not null default 1,
  add column if not exists total_xp       int  not null default 0,
  add column if not exists current_streak int  not null default 0,
  add column if not exists best_streak    int  not null default 0,
  add column if not exists joined_at      date,
  add column if not exists status         text not null default 'ativo'
    check (status in ('ativo','inativo'));

-- ── Extend videos (XP tracking) ───────────────────────────────
alter table videos
  add column if not exists rework_count int  not null default 0,
  add column if not exists delivered_at timestamptz;

-- ── Ranks (progression tiers) ─────────────────────────────────
create table if not exists ranks (
  id     int  primary key generated always as identity,
  name   text not null,
  min_xp int  not null,
  color  text not null default '#38bdf8',
  icon   text not null default '⭐',
  perks  text[] not null default '{}'
);

-- ── XP rules (owner-configurable per workspace) ───────────────
create table if not exists xp_rules (
  id               int primary key generated always as identity,
  owner_id         uuid references auth.users(id) on delete cascade not null unique,
  on_time_xp       int          not null default 50,
  first_pass_xp    int          not null default 30,
  early_xp         int          not null default 20,
  late_penalty     int          not null default 25,
  rework_penalty   int          not null default 15,
  streak_mult_step numeric(4,2) not null default 1.10,
  streak_mult_cap  numeric(4,2) not null default 1.50,
  format_weights   jsonb        not null
    default '{"reel":1.0,"vsl":1.5,"ugc":1.0,"ad":1.2}',
  updated_at       timestamptz default now()
);

alter table xp_rules enable row level security;
create policy "xp_rules_owner" on xp_rules
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ── XP events (immutable audit log) ───────────────────────────
create table if not exists xp_events (
  id         uuid primary key default uuid_generate_v4(),
  editor_id  uuid references editors(id) on delete cascade not null,
  video_id   uuid references videos(id)  on delete set null,
  type       text not null, -- delivered_ontime|first_pass|early_delivery|late_penalty|rework_penalty|achievement|mission|manual
  xp_delta   int  not null,
  reason     text,
  created_at timestamptz not null default now()
);

create index on xp_events (editor_id, created_at desc);
create index on xp_events (video_id);

alter table xp_events enable row level security;
create policy "xp_events_view" on xp_events
  for select using (editor_id = get_my_editor_id() or is_owner());
-- Trigger-driven inserts use security definer functions — bypass RLS via set role
create policy "xp_events_insert" on xp_events
  for insert with check (true);

-- ── Achievements catalog ───────────────────────────────────────
create table if not exists achievements (
  id               uuid primary key default uuid_generate_v4(),
  code             text not null unique,
  name             text not null,
  description      text not null,
  icon             text not null default '🏅',
  rarity           text not null default 'comum'
    check (rarity in ('comum','raro','epico','lendario')),
  xp_bonus         int  not null default 0,
  condition_type   text not null, -- videos_delivered|streak_count|best_streak|first_pass_count|format_delivered|rank_reached|total_xp
  condition_value  int  not null default 1,
  condition_format text          -- null = any format
);

alter table achievements enable row level security;
create policy "achievements_read" on achievements
  for select using (auth.role() = 'authenticated');

-- ── Editor achievements (unlocks) ─────────────────────────────
create table if not exists editor_achievements (
  editor_id      uuid references editors(id)      on delete cascade not null,
  achievement_id uuid references achievements(id) on delete cascade not null,
  unlocked_at    timestamptz not null default now(),
  primary key (editor_id, achievement_id)
);

create index on editor_achievements (editor_id, unlocked_at desc);

alter table editor_achievements enable row level security;
create policy "editor_achievements_view" on editor_achievements
  for select using (editor_id = get_my_editor_id() or is_owner());
create policy "editor_achievements_insert" on editor_achievements
  for insert with check (true);

-- ── Missions ──────────────────────────────────────────────────
create table if not exists missions (
  id            uuid primary key default uuid_generate_v4(),
  scope         text not null check (scope in ('daily','weekly')),
  title         text not null,
  description   text,
  target        int  not null default 1,
  metric        text not null, -- videos_delivered|first_pass|reels_delivered|vsls_delivered|ugc_delivered|ads_delivered|any_delivered
  metric_format text,          -- null = any
  xp_reward     int  not null default 50,
  active        bool not null default true
);

alter table missions enable row level security;
create policy "missions_read" on missions
  for select using (auth.role() = 'authenticated');

-- ── Mission progress (per editor per period) ──────────────────
create table if not exists mission_progress (
  id           uuid primary key default uuid_generate_v4(),
  editor_id    uuid references editors(id) on delete cascade not null,
  mission_id   uuid references missions(id) on delete cascade not null,
  progress     int  not null default 0,
  completed_at timestamptz,
  period_start date not null,
  unique (editor_id, mission_id, period_start)
);

create index on mission_progress (editor_id, period_start desc);

alter table mission_progress enable row level security;
create policy "mission_progress_view" on mission_progress
  for select using (editor_id = get_my_editor_id() or is_owner());
create policy "mission_progress_write" on mission_progress
  for all with check (true);

-- ── Editor earnings ────────────────────────────────────────────
create table if not exists editor_earnings (
  id         uuid primary key default uuid_generate_v4(),
  editor_id  uuid references editors(id) on delete cascade not null,
  video_id   uuid references videos(id)  on delete set null,
  amount     numeric(10,2) not null default 0,
  status     text not null default 'a_receber'
    check (status in ('a_receber','pago')),
  period     text not null,  -- 'YYYY-MM'
  paid_at    timestamptz,
  created_at timestamptz not null default now()
);

create index on editor_earnings (editor_id, period desc);
create index on editor_earnings (editor_id, status);

alter table editor_earnings enable row level security;
create policy "earnings_view" on editor_earnings
  for select using (editor_id = get_my_editor_id() or is_owner());
create policy "earnings_owner_write" on editor_earnings
  for all using (is_owner()) with check (is_owner());

-- ================================================================
-- XP ENGINE FUNCTIONS
-- ================================================================

-- Recalculate editor level/rank from total_xp
create or replace function recalculate_editor_rank(p_editor_id uuid)
returns void language plpgsql security definer as $$
declare
  v_level int;
begin
  select r.id into v_level
  from ranks r
  join editors e on e.id = p_editor_id
  where r.min_xp <= e.total_xp
  order by r.min_xp desc
  limit 1;

  if found then
    update editors set level = v_level where id = p_editor_id;
  end if;
end;
$$;

-- Update mission progress after a relevant delivery event
create or replace function update_mission_progress(
  p_editor_id  uuid,
  p_video_id   uuid,
  p_format     text,
  p_first_pass bool,
  p_on_time    bool
) returns void language plpgsql security definer as $$
declare
  m        record;
  v_period date;
  v_incr   int;
  v_done   bool;
begin
  for m in select * from missions where active = true loop
    v_period := case m.scope
      when 'daily'  then current_date
      when 'weekly' then date_trunc('week', current_date)::date
    end;

    -- Map metric to this event
    v_incr := 0;
    if    m.metric = 'videos_delivered'                              then v_incr := 1;
    elsif m.metric = 'first_pass'       and p_first_pass            then v_incr := 1;
    elsif m.metric = 'reels_delivered'  and p_format = 'reel'       then v_incr := 1;
    elsif m.metric = 'vsls_delivered'   and p_format = 'vsl'        then v_incr := 1;
    elsif m.metric = 'ugc_delivered'    and p_format = 'ugc'        then v_incr := 1;
    elsif m.metric = 'ads_delivered'    and p_format = 'ad'         then v_incr := 1;
    elsif m.metric = 'any_delivered'                                 then v_incr := 1;
    end if;
    continue when v_incr = 0;

    insert into mission_progress (editor_id, mission_id, progress, period_start)
    values (p_editor_id, m.id, v_incr, v_period)
    on conflict (editor_id, mission_id, period_start) do update
      set progress = least(mission_progress.progress + excluded.progress, m.target);

    -- Award XP once on first completion
    select (mp.progress >= m.target) into v_done
    from mission_progress mp
    where mp.editor_id = p_editor_id
      and mp.mission_id = m.id
      and mp.period_start = v_period;

    if v_done then
      update mission_progress
        set completed_at = coalesce(completed_at, now())
        where editor_id    = p_editor_id
          and mission_id   = m.id
          and period_start = v_period
          and completed_at is null;

      if found then
        insert into xp_events (editor_id, video_id, type, xp_delta, reason)
        values (p_editor_id, p_video_id, 'mission', m.xp_reward,
                'Missão concluída: ' || m.title);
        update editors
          set total_xp = greatest(0, total_xp + m.xp_reward)
          where id = p_editor_id;
      end if;
    end if;
  end loop;
end;
$$;

-- Check and unlock achievements for an editor
create or replace function check_achievements(p_editor_id uuid)
returns void language plpgsql security definer as $$
declare
  a       record;
  e       record;
  v_count int;
begin
  select * into e from editors where id = p_editor_id;

  for a in
    select ac.* from achievements ac
    where not exists (
      select 1 from editor_achievements ea
      where ea.editor_id = p_editor_id and ea.achievement_id = ac.id
    )
  loop
    v_count := 0;

    if    a.condition_type = 'videos_delivered' then
      select count(*) into v_count from videos
        where editor_id = p_editor_id and stage = 'delivered';

    elsif a.condition_type = 'streak_count'  then v_count := e.current_streak;
    elsif a.condition_type = 'best_streak'   then v_count := e.best_streak;
    elsif a.condition_type = 'rank_reached'  then v_count := e.level;
    elsif a.condition_type = 'total_xp'      then v_count := e.total_xp;

    elsif a.condition_type = 'first_pass_count' then
      select count(*) into v_count from videos
        where editor_id = p_editor_id and stage = 'delivered' and rework_count = 0;

    elsif a.condition_type = 'format_delivered' then
      select count(*) into v_count from videos
        where editor_id = p_editor_id
          and stage = 'delivered'
          and (a.condition_format is null or format::text = a.condition_format);
    end if;

    continue when v_count < a.condition_value;

    insert into editor_achievements (editor_id, achievement_id)
    values (p_editor_id, a.id)
    on conflict do nothing;

    if a.xp_bonus > 0 then
      insert into xp_events (editor_id, video_id, type, xp_delta, reason)
      values (p_editor_id, null, 'achievement', a.xp_bonus,
              'Conquista: ' || a.name);
      update editors
        set total_xp = total_xp + a.xp_bonus
        where id = p_editor_id;
    end if;
  end loop;
end;
$$;

-- ── Main XP trigger function ───────────────────────────────────
create or replace function process_video_xp()
returns trigger language plpgsql security definer as $$
declare
  v_rules      record;
  v_fmt_wt     numeric := 1.0;
  v_mult       numeric := 1.0;
  v_xp         int     := 0;
  v_on_time    bool    := false;
  v_first_pass bool    := false;
  v_streak     int;
begin
  -- Skip when no editor assigned or stage unchanged
  if new.editor_id is null then return new; end if;
  if old.stage = new.stage  then return new; end if;

  -- Load XP rules (fall back to defaults when not configured)
  select r.* into v_rules
  from xp_rules r
  join clients c on c.user_id = r.owner_id
  where c.id = new.client_id
  limit 1;

  if not found then
    v_rules.on_time_xp       := 50;
    v_rules.first_pass_xp    := 30;
    v_rules.early_xp         := 20;
    v_rules.late_penalty     := 25;
    v_rules.rework_penalty   := 15;
    v_rules.streak_mult_step := 1.10;
    v_rules.streak_mult_cap  := 1.50;
    v_rules.format_weights   := '{"reel":1.0,"vsl":1.5,"ugc":1.0,"ad":1.2}'::jsonb;
  end if;

  -- Format weight multiplier
  v_fmt_wt := coalesce(
    (v_rules.format_weights ->> new.format::text)::numeric, 1.0);

  -- Streak multiplier (floor(streak/7) tiers, capped)
  select least(
    1.0 + (floor(current_streak / 7.0) * (v_rules.streak_mult_step - 1.0)),
    v_rules.streak_mult_cap
  ), current_streak
  into v_mult, v_streak
  from editors where id = new.editor_id;

  -- ── CASE 1: Rework (review → editing) ──────────────────────
  if old.stage = 'review' and new.stage = 'editing' then
    new.rework_count := new.rework_count + 1;

    insert into xp_events (editor_id, video_id, type, xp_delta, reason)
    values (new.editor_id, new.id, 'rework_penalty',
            -v_rules.rework_penalty,
            'Vídeo retornou para edição após revisão');

    update editors
      set total_xp = greatest(0, total_xp - v_rules.rework_penalty)
      where id = new.editor_id;

    perform recalculate_editor_rank(new.editor_id);
    return new;
  end if;

  -- ── CASE 2: Delivered ───────────────────────────────────────
  if old.stage != 'delivered' and new.stage = 'delivered' then
    new.delivered_at := now();
    v_on_time    := (new.deadline is null or current_date <= new.deadline);
    v_first_pass := (new.rework_count = 0);

    if v_on_time then
      -- On-time XP (with format + streak multipliers)
      v_xp := round(v_rules.on_time_xp * v_fmt_wt * v_mult)::int;
      insert into xp_events (editor_id, video_id, type, xp_delta, reason)
      values (new.editor_id, new.id, 'delivered_ontime', v_xp,
              format('Entrega no prazo — %s (×%.2f streak)', new.format, v_mult));

      -- Early bonus
      if new.deadline is not null and current_date < new.deadline then
        insert into xp_events (editor_id, video_id, type, xp_delta, reason)
        values (new.editor_id, new.id, 'early_delivery', v_rules.early_xp,
                'Entrega antecipada');
        v_xp := v_xp + v_rules.early_xp;
      end if;

      -- Update streak
      update editors
        set current_streak = current_streak + 1,
            best_streak    = greatest(best_streak, current_streak + 1)
        where id = new.editor_id;

    else
      -- Late penalty
      insert into xp_events (editor_id, video_id, type, xp_delta, reason)
      values (new.editor_id, new.id, 'late_penalty', -v_rules.late_penalty,
              'Entrega fora do prazo');
      v_xp := -v_rules.late_penalty;

      -- Reset streak
      update editors set current_streak = 0 where id = new.editor_id;
    end if;

    -- First-pass bonus (no rework)
    if v_first_pass then
      declare v_fp_xp int := round(v_rules.first_pass_xp * v_fmt_wt)::int;
      begin
        insert into xp_events (editor_id, video_id, type, xp_delta, reason)
        values (new.editor_id, new.id, 'first_pass', v_fp_xp,
                'Aprovado na 1ª revisão');
        v_xp := v_xp + v_fp_xp;
      end;
    end if;

    -- Apply total XP delta
    update editors
      set total_xp = greatest(0, total_xp + v_xp)
      where id = new.editor_id;

    -- Cascade: rank → missions → achievements
    perform recalculate_editor_rank(new.editor_id);
    perform update_mission_progress(
      new.editor_id, new.id, new.format::text, v_first_pass, v_on_time);
    perform check_achievements(new.editor_id);

    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists videos_xp_engine on videos;
create trigger videos_xp_engine
  before update of stage on videos
  for each row execute function process_video_xp();

-- Indexes for performance
create index if not exists idx_editors_total_xp on editors (total_xp desc);
create index if not exists idx_editors_current_streak on editors (current_streak desc);
