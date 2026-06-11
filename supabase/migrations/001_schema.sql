-- Enable extensions
create extension if not exists "uuid-ossp";

-- Enum types
create type client_status as enum ('nao_chamado','em_contato','proposta','fechado','perdido');
create type video_format  as enum ('reel','vsl','ugc','ad');
create type video_stage   as enum ('backlog','editing','review','approved','delivered');
create type activity_type as enum ('note','call','email','message','meeting','status_change');

-- Editors (team members)
create table editors (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  initials     text not null,
  avatar_color text not null default '#38bdf8',
  user_id      uuid references auth.users(id),
  created_at   timestamptz default now()
);

-- Clients
create table clients (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) not null,
  name             text not null,
  company          text,
  niche            text,
  status           client_status not null default 'nao_chamado',
  health_score     int not null default 50 check (health_score between 0 and 100),
  value_monthly    decimal(10,2) default 0,
  videos_per_month int default 0,
  contact          text,
  edit_style       text,
  tags             text[] default '{}',
  since            date,
  briefing         text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Videos
create table videos (
  id         uuid primary key default uuid_generate_v4(),
  client_id  uuid references clients(id) on delete cascade not null,
  title      text not null,
  format     video_format not null default 'reel',
  stage      video_stage  not null default 'backlog',
  editor_id  uuid references editors(id),
  deadline   date,
  late       bool default false,
  created_at timestamptz default now()
);

-- Tasks
create table tasks (
  id         uuid primary key default uuid_generate_v4(),
  client_id  uuid references clients(id) on delete cascade not null,
  title      text not null,
  due_date   date,
  done       bool default false,
  created_at timestamptz default now()
);

-- Activities
create table activities (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid references clients(id) on delete cascade not null,
  type        activity_type not null default 'note',
  description text not null,
  created_at  timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger clients_updated_at before update on clients
  for each row execute function update_updated_at();

-- Auto-flag late videos
create or replace function flag_late_videos()
returns void language plpgsql as $$
begin
  update videos set late = true
  where stage not in ('approved','delivered')
    and deadline < current_date
    and not late;
end;
$$;

-- RLS
alter table clients    enable row level security;
alter table videos     enable row level security;
alter table tasks      enable row level security;
alter table activities enable row level security;
alter table editors    enable row level security;

-- Clients: owner-scoped
create policy "clients_owner" on clients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Videos: through client ownership
create policy "videos_owner" on videos for all using (
  exists (select 1 from clients where clients.id = videos.client_id and clients.user_id = auth.uid())
);

-- Tasks: through client ownership
create policy "tasks_owner" on tasks for all using (
  exists (select 1 from clients where clients.id = tasks.client_id and clients.user_id = auth.uid())
);

-- Activities: through client ownership
create policy "activities_owner" on activities for all using (
  exists (select 1 from clients where clients.id = activities.client_id and clients.user_id = auth.uid())
);

-- Editors: all authenticated users can read; owner manages
create policy "editors_read"   on editors for select using (auth.role() = 'authenticated');
create policy "editors_manage" on editors for all    using (auth.uid() = user_id);

-- Indexes
create index on clients (user_id, status);
create index on clients (user_id, created_at desc);
create index on videos  (client_id, stage);
create index on videos  (editor_id);
create index on tasks   (client_id, done, due_date);
create index on activities (client_id, created_at desc);
