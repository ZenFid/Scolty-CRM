import { motion } from 'framer-motion'
import { healthColor } from '@/lib/utils'

interface Props {
  score: number
  showLabel?: boolean
  height?: number
  className?: string
}

export default function ScoreBar({ score, showLabel = false, height = 3, className = '' }: Props) {
  const color = healthColor(score)
  return (
    <div className={`w-full ${className}`}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: 'rgba(255,255,255,0.07)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}55` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-semibold" style={{ color }}>
            {score >= 80 ? 'Saudável' : score >= 50 ? 'Atenção' : score >= 25 ? 'Em risco' : 'Crítico'}
          </span>
          <span className="text-[10px] font-mono font-medium" style={{ color }}>{score}</span>
        </div>
      )}
    </div>
  )
}
