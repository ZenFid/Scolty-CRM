import { motion } from 'framer-motion'
import Sparkline from './Sparkline'

interface Props {
  label: string
  value: string | number
  trend?: number        // % change, positive = up
  sparkline?: number[]
  color?: string
  icon?: React.ReactNode
  delay?: number
}

export default function KpiCard({ label, value, trend, sparkline, color = '#38bdf8', icon, delay = 0 }: Props) {
  const trendPositive = trend !== undefined && trend >= 0
  return (
    <motion.div
      className="glass-card p-5 flex flex-col gap-3 group hover:border-[rgba(125,211,252,0.18)] transition-colors duration-200"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.7px] text-ink-muted mb-1">{label}</p>
          <p className="font-display text-2xl font-semibold text-ink-primary" style={{ letterSpacing: '-0.02em' }}>{value}</p>
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: color + '20', color }}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        {trend !== undefined && (
          <span
            className="text-[11px] font-medium flex items-center gap-0.5"
            style={{ color: trendPositive ? '#3ddc97' : '#fb7185' }}
          >
            {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            <span className="text-ink-muted font-normal ml-1">vs último mês</span>
          </span>
        )}
        {sparkline && <Sparkline data={sparkline} color={color} />}
      </div>
    </motion.div>
  )
}
