import type {
  Client, Video, Editor, Task, Activity,
  Rank, Achievement, EditorAchievement, Mission, MissionProgress, EditorEarning, XpEvent,
} from '@/types'

// ── CRM mock data ──────────────────────────────────────────────
export const MOCK_EDITORS: Editor[] = [
  { id: 'e1', name: 'Ana Lima',   initials: 'AL', avatar_color: '#38bdf8', user_id: null, created_at: '2024-01-01T00:00:00Z', level: 3, total_xp: 1340, current_streak: 8,  best_streak: 12, joined_at: '2024-01-05', status: 'ativo' },
  { id: 'e2', name: 'Bruno Reis', initials: 'BR', avatar_color: '#9d8bff', user_id: null, created_at: '2024-01-01T00:00:00Z', level: 2, total_xp: 620,  current_streak: 3,  best_streak: 9,  joined_at: '2024-02-10', status: 'ativo' },
  { id: 'e3', name: 'Carla Neto', initials: 'CN', avatar_color: '#3ddc97', user_id: null, created_at: '2024-01-01T00:00:00Z', level: 4, total_xp: 2880, current_streak: 15, best_streak: 22, joined_at: '2024-01-01', status: 'ativo' },
]

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', user_id: 'mock', name: 'Lucas Mendes',  company: 'LM Fitness',  niche: 'fitness',          status: 'fechado',     health_score: 92, value_monthly: 3500, videos_per_month: 12, contact: '@lucasmendes',      edit_style: 'Dinâmico / rápido',   tags: ['reels','ugc'],     since: '2024-01-15', briefing: 'Cores vibrantes, cortes rápidos, músicas eletrônicas. Referências: Alex Hormozi, Jeff Nippard.', created_at: '2024-01-15T10:00:00Z', updated_at: '2024-06-01T10:00:00Z' },
  { id: 'c2', user_id: 'mock', name: 'Carla Souza',   company: 'CS Finanças', niche: 'finanças',         status: 'proposta',    health_score: 71, value_monthly: 5000, videos_per_month: 8,  contact: '+55 11 99123-4567', edit_style: 'Clean / minimalista', tags: ['vsl','long-form'], since: null,         briefing: 'Visual clean, paleta azul e branco, sem efeitos excessivos. Foco em educação financeira.',      created_at: '2024-05-20T14:30:00Z', updated_at: '2024-06-05T10:00:00Z' },
  { id: 'c3', user_id: 'mock', name: 'Rafael Costa',  company: null,          niche: 'marketing digital', status: 'em_contato',  health_score: 58, value_monthly: 2800, videos_per_month: 16, contact: '@rafaelcosta.mkt',  edit_style: 'Reels / UGC',         tags: ['reels'],           since: null,         briefing: null,                                                                                             created_at: '2024-06-01T09:00:00Z', updated_at: '2024-06-08T10:00:00Z' },
  { id: 'c4', user_id: 'mock', name: 'Juliana Melo',  company: 'JM Store',    niche: 'e-commerce',       status: 'nao_chamado', health_score: 30, value_monthly: 0,    videos_per_month: 0,  contact: '@julianamelo',      edit_style: null,                  tags: [],                  since: null,         briefing: null,                                                                                             created_at: '2024-03-10T11:00:00Z', updated_at: '2024-03-10T11:00:00Z' },
  { id: 'c5', user_id: 'mock', name: 'Bruno Trader',  company: 'BT Capital',  niche: 'finanças',         status: 'fechado',     health_score: 88, value_monthly: 4200, videos_per_month: 6,  contact: '@brunotrader',      edit_style: 'VSL / long-form',     tags: ['vsl'],             since: '2024-02-28', briefing: 'Sóbrio, gráficos animados, seriedade. Quer expandir para 10 vídeos em agosto.',                  created_at: '2024-02-28T16:00:00Z', updated_at: '2024-06-01T10:00:00Z' },
  { id: 'c6', user_id: 'mock', name: 'Aline Saúde',   company: null,          niche: 'saúde e bem-estar', status: 'perdido',     health_score: 15, value_monthly: 1800, videos_per_month: 8,  contact: '+55 21 98765-4321', edit_style: 'Clean / minimalista', tags: ['reels'],           since: null,         briefing: null,                                                                                             created_at: '2024-04-15T10:30:00Z', updated_at: '2024-05-01T10:00:00Z' },
]

export const MOCK_VIDEOS: Video[] = [
  { id: 'v1', client_id: 'c1', title: 'Reel Junho #1 — Treino Cardio',   format: 'reel', stage: 'editing',   editor_id: 'e1', deadline: '2026-06-16', late: false, created_at: '2026-06-01T00:00:00Z', rework_count: 0 },
  { id: 'v2', client_id: 'c1', title: 'UGC Suplemento — Depoimento',     format: 'ugc',  stage: 'review',    editor_id: 'e2', deadline: '2026-06-12', late: true,  created_at: '2026-06-02T00:00:00Z', rework_count: 1 },
  { id: 'v3', client_id: 'c5', title: 'VSL Curso Trader Pro',            format: 'vsl',  stage: 'backlog',   editor_id: 'e1', deadline: '2026-06-20', late: false, created_at: '2026-06-03T00:00:00Z', rework_count: 0 },
  { id: 'v4', client_id: 'c5', title: 'Ad Bitcoin — Direto ao ponto',   format: 'ad',   stage: 'approved',  editor_id: 'e3', deadline: '2026-06-14', late: false, created_at: '2026-06-04T00:00:00Z', rework_count: 0 },
  { id: 'v5', client_id: 'c2', title: 'VSL Renda Variável 2026',        format: 'vsl',  stage: 'backlog',   editor_id: null, deadline: '2026-06-25', late: false, created_at: '2026-06-05T00:00:00Z', rework_count: 0 },
  { id: 'v6', client_id: 'c1', title: 'Reel Dieta Proteica',             format: 'reel', stage: 'delivered', editor_id: 'e2', deadline: '2026-06-08', late: false, created_at: '2026-05-28T00:00:00Z', rework_count: 0, delivered_at: '2026-06-07T15:00:00Z' },
  { id: 'v7', client_id: 'c3', title: 'Reel Marketing Tático',           format: 'reel', stage: 'editing',   editor_id: 'e2', deadline: '2026-06-18', late: false, created_at: '2026-06-05T00:00:00Z', rework_count: 0 },
  { id: 'v8', client_id: 'c5', title: 'VSL Scalping Guide',              format: 'vsl',  stage: 'review',    editor_id: 'e3', deadline: '2026-06-13', late: false, created_at: '2026-06-04T00:00:00Z', rework_count: 0 },
]

export const MOCK_TASKS: Task[] = [
  { id: 't1', client_id: 'c2', title: 'Ligar para Carla — feedback proposta', due_date: new Date().toISOString().split('T')[0], done: false, created_at: '2026-06-09T00:00:00Z' },
  { id: 't2', client_id: 'c3', title: 'Enviar briefing para Rafael',          due_date: new Date().toISOString().split('T')[0], done: false, created_at: '2026-06-09T00:00:00Z' },
  { id: 't3', client_id: 'c5', title: 'Revisar VSL Bruno — 3ª versão',       due_date: new Date().toISOString().split('T')[0], done: true,  created_at: '2026-06-09T00:00:00Z' },
]

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', client_id: 'c1', type: 'status_change', description: 'Status alterado para Fechado',         created_at: '2026-06-08T14:00:00Z' },
  { id: 'a2', client_id: 'c2', type: 'call',          description: 'Ligação realizada — interesse alto',   created_at: '2026-06-07T11:00:00Z' },
  { id: 'a3', client_id: 'c5', type: 'note',          description: 'Revisão do VSL aprovada pelo cliente', created_at: '2026-06-06T16:30:00Z' },
  { id: 'a4', client_id: 'c3', type: 'message',       description: 'DM enviada no Instagram',              created_at: '2026-06-05T09:00:00Z' },
  { id: 'a5', client_id: 'c1', type: 'meeting',       description: 'Reunião mensal de alinhamento',        created_at: '2026-06-04T15:00:00Z' },
]

// Enrich with joins
const clientMap = Object.fromEntries(MOCK_CLIENTS.map(c => [c.id, c]))
const editorMap = Object.fromEntries(MOCK_EDITORS.map(e => [e.id, e]))

export const MOCK_VIDEOS_RICH: Video[] = MOCK_VIDEOS.map(v => ({
  ...v,
  client: clientMap[v.client_id] ? { id: v.client_id, name: clientMap[v.client_id].name, company: clientMap[v.client_id].company } : undefined,
  editor: v.editor_id && editorMap[v.editor_id] ? editorMap[v.editor_id] : undefined,
}))

export const MOCK_TASKS_RICH: Task[] = MOCK_TASKS.map(t => ({
  ...t,
  client: clientMap[t.client_id] ? { id: t.client_id, name: clientMap[t.client_id].name } : undefined,
}))

export const MOCK_ACTIVITIES_RICH: Activity[] = MOCK_ACTIVITIES.map(a => ({
  ...a,
  client: clientMap[a.client_id] ? { id: a.client_id, name: clientMap[a.client_id].name } : undefined,
}))

// ── Arena mock data ────────────────────────────────────────────
export const MOCK_RANKS: Rank[] = [
  { id: 1, name: 'Recruta',       min_xp: 0,    color: '#62769b', icon: '🔰', perks: ['Acesso ao portal', 'Missões diárias'] },
  { id: 2, name: 'Editor Jr',     min_xp: 300,  color: '#38bdf8', icon: '⭐', perks: ['Badge exclusivo', 'Missões semanais'] },
  { id: 3, name: 'Editor Pleno',  min_xp: 1000, color: '#9d8bff', icon: '💫', perks: ['Prioridade em clientes intermediários'] },
  { id: 4, name: 'Editor Sênior', min_xp: 2500, color: '#fbbf24', icon: '🔥', perks: ['Clientes premium', 'Multiplicador XP +5%'] },
  { id: 5, name: 'Mestre',        min_xp: 5000, color: '#3ddc97', icon: '👑', perks: ['Status lendário', 'Multiplicador XP +10%'] },
]

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1',  code: 'first_delivery',   name: 'Primeira Entrega',    description: 'Entregue seu primeiro vídeo.',            icon: '📦', rarity: 'comum',   xp_bonus: 10,  condition_type: 'videos_delivered', condition_value: 1,   condition_format: null   },
  { id: 'ach2',  code: 'zero_rework',      name: 'Zero Defeitos',       description: 'Passe na 1ª revisão pela primeira vez.',  icon: '✅', rarity: 'comum',   xp_bonus: 20,  condition_type: 'first_pass_count', condition_value: 1,   condition_format: null   },
  { id: 'ach3',  code: 'ten_deliveries',   name: 'Dez Entregas',        description: 'Entregue 10 vídeos no total.',            icon: '🎯', rarity: 'comum',   xp_bonus: 30,  condition_type: 'videos_delivered', condition_value: 10,  condition_format: null   },
  { id: 'ach4',  code: 'first_reel',       name: 'Reel Master',         description: 'Entregue seu primeiro Reel.',             icon: '📱', rarity: 'comum',   xp_bonus: 15,  condition_type: 'format_delivered', condition_value: 1,   condition_format: 'reel' },
  { id: 'ach5',  code: 'first_vsl',        name: 'Narrador VSL',        description: 'Entregue sua primeira VSL.',              icon: '🎬', rarity: 'comum',   xp_bonus: 20,  condition_type: 'format_delivered', condition_value: 1,   condition_format: 'vsl'  },
  { id: 'ach6',  code: 'streak_7',         name: 'Semana Perfeita',     description: '7 entregas no prazo consecutivas.',       icon: '🔥', rarity: 'raro',    xp_bonus: 50,  condition_type: 'streak_count',     condition_value: 7,   condition_format: null   },
  { id: 'ach7',  code: 'five_first_pass',  name: 'Qualidade Total',     description: '5 vídeos aprovados na 1ª revisão.',      icon: '🏆', rarity: 'raro',    xp_bonus: 60,  condition_type: 'first_pass_count', condition_value: 5,   condition_format: null   },
  { id: 'ach8',  code: 'lightning',        name: 'Entrega Relâmpago',   description: '10 entregas no prazo consecutivas.',      icon: '⚡', rarity: 'raro',    xp_bonus: 60,  condition_type: 'streak_count',     condition_value: 10,  condition_format: null   },
  { id: 'ach9',  code: 'streak_30',        name: 'Mês de Fogo',         description: '30 entregas consecutivas no prazo.',     icon: '🌟', rarity: 'epico',   xp_bonus: 150, condition_type: 'streak_count',     condition_value: 30,  condition_format: null   },
  { id: 'ach10', code: 'senior_rank',      name: 'Sênior Oficial',      description: 'Alcance o rank de Editor Sênior.',       icon: '🔥', rarity: 'epico',   xp_bonus: 100, condition_type: 'rank_reached',     condition_value: 4,   condition_format: null   },
  { id: 'ach11', code: 'grandmaster',      name: 'Grão-Mestre',         description: 'Alcance o rank de Mestre.',              icon: '👑', rarity: 'lendario', xp_bonus: 500, condition_type: 'rank_reached',    condition_value: 5,   condition_format: null   },
  { id: 'ach12', code: 'streak_100',       name: 'Pontualidade Lendária',description: '100 entregas consecutivas no prazo.',   icon: '🌈', rarity: 'lendario', xp_bonus: 500, condition_type: 'streak_count',    condition_value: 100, condition_format: null   },
]

export const MOCK_EDITOR_ACHIEVEMENTS: EditorAchievement[] = [
  { editor_id: 'e1', achievement_id: 'ach1', unlocked_at: '2024-01-20T10:00:00Z' },
  { editor_id: 'e1', achievement_id: 'ach2', unlocked_at: '2024-01-25T10:00:00Z' },
  { editor_id: 'e1', achievement_id: 'ach4', unlocked_at: '2024-02-01T10:00:00Z' },
  { editor_id: 'e1', achievement_id: 'ach6', unlocked_at: '2024-03-10T10:00:00Z' },
  { editor_id: 'e2', achievement_id: 'ach1', unlocked_at: '2024-02-15T10:00:00Z' },
  { editor_id: 'e2', achievement_id: 'ach4', unlocked_at: '2024-03-01T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach1', unlocked_at: '2024-01-10T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach2', unlocked_at: '2024-01-15T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach3', unlocked_at: '2024-02-05T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach4', unlocked_at: '2024-02-08T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach5', unlocked_at: '2024-02-20T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach6', unlocked_at: '2024-03-01T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach7', unlocked_at: '2024-04-01T10:00:00Z' },
  { editor_id: 'e3', achievement_id: 'ach8', unlocked_at: '2024-05-15T10:00:00Z' },
]

export const MOCK_MISSIONS: Mission[] = [
  { id: 'm1', scope: 'daily',  title: 'Entrega do Dia',     description: 'Entregue pelo menos 1 vídeo hoje.',      target: 1, metric: 'videos_delivered', metric_format: null,  xp_reward: 30,  active: true },
  { id: 'm2', scope: 'daily',  title: 'Zero Retrabalho',    description: 'Aprove 1 vídeo na 1ª revisão hoje.',     target: 1, metric: 'first_pass',       metric_format: null,  xp_reward: 40,  active: true },
  { id: 'm3', scope: 'daily',  title: 'Reel Veloz',         description: 'Entregue 1 Reel hoje.',                  target: 1, metric: 'reels_delivered',  metric_format: 'reel', xp_reward: 35, active: true },
  { id: 'm4', scope: 'weekly', title: 'Volume Semanal',     description: 'Entregue 5 vídeos esta semana.',         target: 5, metric: 'videos_delivered', metric_format: null,  xp_reward: 100, active: true },
  { id: 'm5', scope: 'weekly', title: 'Semana Impecável',   description: '3 aprovações na 1ª revisão esta semana.',target: 3, metric: 'first_pass',       metric_format: null,  xp_reward: 120, active: true },
  { id: 'm6', scope: 'weekly', title: 'Mestre VSL',         description: 'Entregue 2 VSLs esta semana.',           target: 2, metric: 'vsls_delivered',   metric_format: 'vsl', xp_reward: 150, active: true },
]

export const MOCK_MISSION_PROGRESS: MissionProgress[] = [
  { id: 'mp1', editor_id: 'e1', mission_id: 'm1', progress: 1, completed_at: new Date().toISOString(), period_start: new Date().toISOString().split('T')[0], mission: MOCK_MISSIONS[0] },
  { id: 'mp2', editor_id: 'e1', mission_id: 'm2', progress: 0, completed_at: null, period_start: new Date().toISOString().split('T')[0], mission: MOCK_MISSIONS[1] },
  { id: 'mp3', editor_id: 'e1', mission_id: 'm4', progress: 3, completed_at: null, period_start: getWeekStart(), mission: MOCK_MISSIONS[3] },
  { id: 'mp4', editor_id: 'e1', mission_id: 'm5', progress: 2, completed_at: null, period_start: getWeekStart(), mission: MOCK_MISSIONS[4] },
]

export const MOCK_XP_EVENTS: XpEvent[] = [
  { id: 'xe1', editor_id: 'e1', video_id: 'v6', type: 'delivered_ontime', xp_delta: 50,  reason: 'Entrega no prazo — reel (×1.1 streak)', created_at: '2026-06-07T15:00:00Z' },
  { id: 'xe2', editor_id: 'e1', video_id: 'v6', type: 'first_pass',       xp_delta: 30,  reason: 'Aprovado na 1ª revisão',                created_at: '2026-06-07T15:01:00Z' },
  { id: 'xe3', editor_id: 'e2', video_id: 'v2', type: 'rework_penalty',   xp_delta: -15, reason: 'Vídeo retornou para edição após revisão', created_at: '2026-06-10T09:00:00Z' },
  { id: 'xe4', editor_id: 'e3', video_id: 'v4', type: 'early_delivery',   xp_delta: 20,  reason: 'Entrega antecipada',                     created_at: '2026-06-09T11:00:00Z' },
]

export const MOCK_EARNINGS: EditorEarning[] = [
  { id: 'ee1', editor_id: 'e1', video_id: 'v6', amount: 180, status: 'pago',       period: '2026-06', paid_at: '2026-06-08T10:00:00Z', created_at: '2026-06-07T15:00:00Z' },
  { id: 'ee2', editor_id: 'e1', video_id: 'v1', amount: 120, status: 'a_receber',  period: '2026-06', paid_at: null,                   created_at: '2026-06-01T00:00:00Z' },
  { id: 'ee3', editor_id: 'e2', video_id: 'v6', amount: 150, status: 'pago',       period: '2026-05', paid_at: '2026-05-31T10:00:00Z', created_at: '2026-05-28T00:00:00Z' },
  { id: 'ee4', editor_id: 'e3', video_id: 'v4', amount: 200, status: 'a_receber',  period: '2026-06', paid_at: null,                   created_at: '2026-06-04T00:00:00Z' },
  { id: 'ee5', editor_id: 'e3', video_id: 'v8', amount: 350, status: 'a_receber',  period: '2026-06', paid_at: null,                   created_at: '2026-06-04T00:00:00Z' },
]

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const mon = new Date(d.setDate(diff))
  return mon.toISOString().split('T')[0]
}
