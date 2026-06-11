-- ================================================================
-- 004_arena_seed.sql — Ranks, Achievements, Missions
-- ================================================================

-- ── Ranks (5 tiers) ───────────────────────────────────────────
insert into ranks (name, min_xp, color, icon, perks) values
  ('Recruta',       0,    '#62769b', '🔰',
   ARRAY['Acesso ao portal do editor', 'Missões diárias']),
  ('Editor Jr',     300,  '#38bdf8', '⭐',
   ARRAY['Badge exclusivo', 'Missões semanais', 'Histórico de XP']),
  ('Editor Pleno',  1000, '#9d8bff', '💫',
   ARRAY['Prioridade em clientes intermediários', 'Relatório mensal pessoal']),
  ('Editor Sênior', 2500, '#fbbf24', '🔥',
   ARRAY['Clientes premium', 'Vídeos de maior valor', 'Multiplicador XP +5%']),
  ('Mestre',        5000, '#3ddc97', '👑',
   ARRAY['Status lendário', 'Bônus financeiro especial', 'Multiplicador XP +10%', 'Primeiro acesso a novos clientes']);

-- ── Achievements catalog ───────────────────────────────────────
insert into achievements
  (code, name, description, icon, rarity, xp_bonus, condition_type, condition_value, condition_format)
values
  -- ── Comuns ──
  ('first_delivery',   'Primeira Entrega',   'Entregue seu primeiro vídeo.',               '📦', 'comum',   10, 'videos_delivered', 1,   null),
  ('zero_rework',      'Zero Defeitos',       'Passe na 1ª revisão pela primeira vez.',     '✅', 'comum',   20, 'first_pass_count', 1,   null),
  ('ten_deliveries',   'Dez Entregas',        'Entregue 10 vídeos no total.',               '🎯', 'comum',   30, 'videos_delivered', 10,  null),
  ('first_reel',       'Reel Master',         'Entregue seu primeiro Reel.',                '📱', 'comum',   15, 'format_delivered', 1,   'reel'),
  ('first_vsl',        'Narrador VSL',        'Entregue sua primeira VSL.',                 '🎬', 'comum',   20, 'format_delivered', 1,   'vsl'),
  ('first_ugc',        'UGC Creator',         'Entregue seu primeiro UGC.',                 '🎤', 'comum',   15, 'format_delivered', 1,   'ugc'),
  -- ── Raros ──
  ('streak_7',         'Semana Perfeita',     '7 entregas no prazo consecutivas.',          '🔥', 'raro',    50, 'streak_count',     7,   null),
  ('five_first_pass',  'Qualidade Total',     '5 vídeos aprovados na 1ª revisão.',          '🏆', 'raro',    60, 'first_pass_count', 5,   null),
  ('fifty_deliveries', 'Meio Século',         '50 vídeos entregues.',                       '🎪', 'raro',   100, 'videos_delivered', 50,  null),
  ('vsl_perfect',      'VSL Impecável',       'VSL aprovada na 1ª revisão.',                '🎥', 'raro',    40, 'first_pass_count', 1,   'vsl'),
  ('lightning',        'Entrega Relâmpago',   '10 entregas no prazo consecutivas.',         '⚡', 'raro',    60, 'streak_count',     10,  null),
  -- ── Épicos ──
  ('streak_30',        'Mês de Fogo',         '30 entregas consecutivas no prazo.',         '🌟', 'epico',  150, 'streak_count',     30,  null),
  ('twenty_fp',        'Perfeccionista',      '20 vídeos sem retrabalho.',                  '💎', 'epico',  200, 'first_pass_count', 20,  null),
  ('centurion',        'Centurião',           '100 vídeos entregues.',                      '🏛️','epico',  200, 'videos_delivered', 100, null),
  ('senior_rank',      'Sênior Oficial',      'Alcance o rank de Editor Sênior.',           '🔥', 'epico',  100, 'rank_reached',     4,   null),
  -- ── Lendários ──
  ('grandmaster',      'Grão-Mestre',         'Alcance o rank de Mestre.',                  '👑', 'lendario',500,'rank_reached',     5,   null),
  ('streak_100',       'Pontualidade Lendária','100 entregas consecutivas no prazo.',        '🌈', 'lendario',500,'streak_count',     100, null),
  ('five_hundred',     'Meio Milhar',         '500 vídeos entregues.',                      '💫', 'lendario',1000,'videos_delivered',500, null);

-- ── Missions ──────────────────────────────────────────────────
insert into missions (scope, title, description, target, metric, metric_format, xp_reward) values
  -- Daily
  ('daily', 'Entrega do Dia',    'Entregue pelo menos 1 vídeo hoje.',      1, 'videos_delivered', null,  30),
  ('daily', 'Zero Retrabalho',   'Aprove 1 vídeo na 1ª revisão hoje.',     1, 'first_pass',       null,  40),
  ('daily', 'Reel Veloz',        'Entregue 1 Reel hoje.',                  1, 'reels_delivered',  'reel', 35),
  ('daily', 'Produção VSL',      'Entregue 1 VSL hoje.',                   1, 'vsls_delivered',   'vsl',  50),
  -- Weekly
  ('weekly','Volume Semanal',    'Entregue 5 vídeos esta semana.',         5, 'videos_delivered', null, 100),
  ('weekly','Semana Impecável',  '3 aprovações na 1ª revisão esta semana.',3, 'first_pass',       null, 120),
  ('weekly','Sprint de Reels',   'Entregue 3 Reels esta semana.',          3, 'reels_delivered',  'reel', 90),
  ('weekly','Mestre VSL',        'Entregue 2 VSLs esta semana.',           2, 'vsls_delivered',   'vsl', 150);
