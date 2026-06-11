import { CheckCircle2 } from 'lucide-react'
import XpBar from './XpBar'
import type { Mission } from '@/types'

interface Props {
  mission: Mission
  progress: number
  completed: boolean
}

export default function MissionCard({ mission, progress, completed }: Props) {
  const pct = Math.min(100, (progress / mission.target) * 100)

  return (
    <div
      className={`glass-sm rounded-xl p-3 flex flex-col gap-2 transition-all ${completed ? 'opacity-70' : ''}`}
      style={completed ? { border: '1px solid rgba(61,220,151,0.2)' } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${completed ? 'text-emerald-400 line-through' : 'text-ink-primary'}`}>
            {mission.title}
          </p>
          {mission.description && (
            <p className="text-[10px] text-ink-muted mt-0.5 truncate">{mission.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {completed && <CheckCircle2 size={14} className="text-emerald-400" />}
          <span className="text-[11px] font-mono font-semibold text-cyan-brand">
            +{mission.xp_reward} XP
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <XpBar
          progress={pct}
          color={completed ? '#3ddc97' : undefined}
          height={4}
          animated={false}
        />
        <span className="text-[10px] font-mono text-ink-muted flex-shrink-0 w-10 text-right">
          {progress}/{mission.target}
        </span>
      </div>
    </div>
  )
}
