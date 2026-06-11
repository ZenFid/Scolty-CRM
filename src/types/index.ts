// ── Base CRM types ─────────────────────────────────────────────
export type ClientStatus = 'nao_chamado' | 'em_contato' | 'proposta' | 'fechado' | 'perdido'
export type VideoFormat  = 'reel' | 'vsl' | 'ugc' | 'ad'
export type VideoStage   = 'backlog' | 'editing' | 'review' | 'approved' | 'delivered'
export type ActivityType = 'note' | 'call' | 'email' | 'message' | 'meeting' | 'status_change'

export interface Client {
  id: string; user_id: string; name: string; company: string | null
  niche: string | null; status: ClientStatus; health_score: number
  value_monthly: number; videos_per_month: number; contact: string | null
  edit_style: string | null; tags: string[]; since: string | null
  briefing: string | null; created_at: string; updated_at: string
}

export interface Editor {
  id: string; name: string; initials: string; avatar_color: string
  user_id: string | null; created_at: string
  // Arena columns (added via migration 003)
  level?: number; total_xp?: number; current_streak?: number
  best_streak?: number; joined_at?: string | null; status?: 'ativo' | 'inativo'
}

export interface Video {
  id: string; client_id: string; title: string; format: VideoFormat
  stage: VideoStage; editor_id: string | null; deadline: string | null
  late: boolean; created_at: string
  rework_count?: number; delivered_at?: string | null
  client?: Pick<Client, 'id' | 'name' | 'company'>
  editor?: Pick<Editor, 'id' | 'name' | 'initials' | 'avatar_color'>
}

export interface Task {
  id: string; client_id: string; title: string; due_date: string | null
  done: boolean; created_at: string
  client?: Pick<Client, 'id' | 'name'>
}

export interface Activity {
  id: string; client_id: string; type: ActivityType
  description: string; created_at: string
  client?: Pick<Client, 'id' | 'name'>
}

// ── Arena types ────────────────────────────────────────────────
export type XpEventType    = 'delivered_ontime' | 'first_pass' | 'early_delivery' | 'late_penalty' | 'rework_penalty' | 'achievement' | 'mission' | 'manual'
export type AchievementRarity = 'comum' | 'raro' | 'epico' | 'lendario'
export type MissionScope   = 'daily' | 'weekly'
export type EarningStatus  = 'a_receber' | 'pago'
export type UserRole       = 'owner' | 'editor'

export interface UserProfile {
  id: string; role: UserRole; created_at: string
}

export interface Rank {
  id: number; name: string; min_xp: number; color: string; icon: string; perks: string[]
}

export interface XpRule {
  id: number; owner_id: string; on_time_xp: number; first_pass_xp: number
  early_xp: number; late_penalty: number; rework_penalty: number
  streak_mult_step: number; streak_mult_cap: number
  format_weights: Record<VideoFormat, number>; updated_at: string
}

export interface XpEvent {
  id: string; editor_id: string; video_id: string | null
  type: XpEventType; xp_delta: number; reason: string | null; created_at: string
}

export interface Achievement {
  id: string; code: string; name: string; description: string
  icon: string; rarity: AchievementRarity; xp_bonus: number
  condition_type: string; condition_value: number; condition_format: string | null
}

export interface EditorAchievement {
  editor_id: string; achievement_id: string; unlocked_at: string
  achievement?: Achievement
}

export interface Mission {
  id: string; scope: MissionScope; title: string; description: string | null
  target: number; metric: string; metric_format: string | null
  xp_reward: number; active: boolean
}

export interface MissionProgress {
  id: string; editor_id: string; mission_id: string
  progress: number; completed_at: string | null; period_start: string
  mission?: Mission
}

export interface EditorEarning {
  id: string; editor_id: string; video_id: string | null
  amount: number; status: EarningStatus; period: string
  paid_at: string | null; created_at: string
}

export interface EditorRadar {
  velocidade: number; qualidade: number; pontualidade: number
  volume: number; consistencia: number
}

// ── XP Toast notifications ─────────────────────────────────────
export type ToastKind = 'xp' | 'levelup' | 'achievement' | 'mission' | 'penalty'

export interface XpToast {
  id: string; kind: ToastKind; title: string
  subtitle?: string; xp?: number
}

// ── Config maps ────────────────────────────────────────────────
export const STATUS_CONFIG: Record<ClientStatus, { label: string; className: string; dot: string }> = {
  nao_chamado: { label: 'Não chamado', className: 'bg-slate-500/15 text-slate-400 border-slate-500/25',    dot: '#94a3b8' },
  em_contato:  { label: 'Em contato',  className: 'bg-blue-500/15  text-blue-400  border-blue-500/25',     dot: '#60a5fa' },
  proposta:    { label: 'Proposta',    className: 'bg-amber-500/15 text-amber-400 border-amber-500/25',    dot: '#fbbf24' },
  fechado:     { label: 'Fechado',     className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: '#3ddc97' },
  perdido:     { label: 'Perdido',     className: 'bg-rose-500/15  text-rose-400  border-rose-500/25',     dot: '#fb7185' },
}

export const FORMAT_CONFIG: Record<VideoFormat, { label: string; className: string }> = {
  reel: { label: 'Reel', className: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
  vsl:  { label: 'VSL',  className: 'bg-amber-500/15  text-amber-400  border-amber-500/25' },
  ugc:  { label: 'UGC',  className: 'bg-cyan-500/15   text-cyan-400   border-cyan-500/25' },
  ad:   { label: 'Ad',   className: 'bg-pink-500/15   text-pink-400   border-pink-500/25' },
}

export const STAGE_CONFIG: Record<VideoStage, { label: string; color: string }> = {
  backlog:   { label: 'Backlog',   color: '#62769b' },
  editing:   { label: 'Em edição', color: '#38bdf8' },
  review:    { label: 'Revisão',   color: '#fbbf24' },
  approved:  { label: 'Aprovado',  color: '#9d8bff' },
  delivered: { label: 'Entregue',  color: '#3ddc97' },
}

export const RARITY_CONFIG: Record<AchievementRarity, { label: string; color: string; glowClass: string }> = {
  comum:    { label: 'Comum',    color: '#9bafce', glowClass: 'glow-comum' },
  raro:     { label: 'Raro',     color: '#38bdf8', glowClass: 'glow-raro' },
  epico:    { label: 'Épico',    color: '#9d8bff', glowClass: 'glow-epico' },
  lendario: { label: 'Lendário', color: '#fbbf24', glowClass: 'glow-lendario' },
}

export const CLIENT_STAGES: VideoStage[] = ['backlog', 'editing', 'review', 'approved', 'delivered']
export const CLIENT_STATUSES: ClientStatus[] = ['nao_chamado', 'em_contato', 'proposta', 'fechado', 'perdido']
export const VIDEO_FORMATS: VideoFormat[] = ['reel', 'vsl', 'ugc', 'ad']
