import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { RARITY_CONFIG } from '@/types'
import type { Achievement } from '@/types'

interface Props {
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: string
  compact?: boolean
}

export default function AchievementCard({ achievement, unlocked, unlockedAt, compact = false }: Props) {
  const cfg = RARITY_CONFIG[achievement.rarity]

  if (compact) {
    return (
      <motion.div
        title={`${achievement.name}: ${achievement.description}`}
        className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all
          ${unlocked ? cfg.glowClass : 'opacity-40 grayscale'}`}
        style={{
          background: unlocked ? `${cfg.color}15` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${unlocked ? cfg.color + '30' : 'rgba(255,255,255,0.08)'}`,
        }}
        whileHover={unlocked ? { scale: 1.1 } : undefined}
      >
        {unlocked ? achievement.icon : <Lock size={14} className="text-ink-muted" />}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`glass-card p-4 flex flex-col items-center text-center gap-2 transition-all
        ${unlocked ? cfg.glowClass : 'opacity-50'}`}
      whileHover={unlocked ? { scale: 1.02 } : undefined}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
        style={{
          background: unlocked ? `${cfg.color}15` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${unlocked ? cfg.color + '30' : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        {unlocked ? achievement.icon : <Lock size={18} className="text-ink-muted" />}
      </div>
      <div>
        <p className={`text-xs font-semibold ${unlocked ? 'text-ink-primary' : 'text-ink-muted'}`}>
          {achievement.name}
        </p>
        <p className="text-[10px] text-ink-muted mt-0.5 leading-relaxed">{achievement.description}</p>
      </div>
      <span
        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}25` }}
      >
        {cfg.label}
      </span>
      {unlocked && achievement.xp_bonus > 0 && (
        <span className="text-[10px] font-mono text-cyan-brand">+{achievement.xp_bonus} XP</span>
      )}
      {unlocked && unlockedAt && (
        <span className="text-[9px] text-ink-muted">
          {new Date(unlockedAt).toLocaleDateString('pt-BR')}
        </span>
      )}
    </motion.div>
  )
}
