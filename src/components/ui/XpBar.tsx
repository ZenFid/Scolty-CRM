import { motion } from 'framer-motion'

interface Props {
  progress: number  // 0-100
  color?: string
  height?: number
  showPercent?: boolean
  animated?: boolean
}

export default function XpBar({ progress, color, height = 6, showPercent = false, animated = true }: Props) {
  const clamp = Math.min(100, Math.max(0, progress))

  return (
    <div className="relative w-full" style={{ height }}>
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        {animated ? (
          <motion.div
            className="h-full rounded-full"
            style={color
              ? { background: color, boxShadow: `0 0 8px ${color}60` }
              : { background: 'linear-gradient(90deg,#38bdf8,#9d8bff)', boxShadow: '0 0 8px rgba(56,189,248,0.4)' }
            }
            initial={{ width: 0 }}
            animate={{ width: `${clamp}%` }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          />
        ) : (
          <div
            className="h-full rounded-full xp-bar-fill"
            style={{ width: `${clamp}%`, ...(color ? { background: color } : {}) }}
          />
        )}
      </div>
      {showPercent && (
        <span className="absolute right-0 -top-4 text-[10px] font-mono text-ink-muted">
          {Math.round(clamp)}%
        </span>
      )}
    </div>
  )
}
