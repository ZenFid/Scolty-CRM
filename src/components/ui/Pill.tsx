import { cn } from '@/lib/utils'
import { STATUS_CONFIG, FORMAT_CONFIG } from '@/types'
import type { ClientStatus, VideoFormat } from '@/types'

interface StatusPillProps { status: ClientStatus; className?: string }
interface FormatPillProps { format: VideoFormat; className?: string }
interface GenericPillProps { label: string; className?: string }

export function StatusPill({ status, className }: StatusPillProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
      cfg.className, className
    )}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

export function FormatPill({ format, className }: FormatPillProps) {
  const cfg = FORMAT_CONFIG[format]
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider',
      cfg.className, className
    )}>
      {cfg.label}
    </span>
  )
}

export function TagPill({ label, className }: GenericPillProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
      'bg-white/5 text-ink-secondary border-white/10', className
    )}>
      {label}
    </span>
  )
}
