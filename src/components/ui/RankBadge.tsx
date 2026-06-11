import type { Rank } from '@/types'

interface Props {
  rank: Rank
  size?: 'sm' | 'md' | 'lg'
  showPerks?: boolean
}

export default function RankBadge({ rank, size = 'md', showPerks = false }: Props) {
  const sizes = {
    sm: { icon: 'text-sm',  text: 'text-[10px]', pad: 'px-2 py-0.5', gap: 'gap-1'   },
    md: { icon: 'text-base', text: 'text-xs',     pad: 'px-2.5 py-1', gap: 'gap-1.5' },
    lg: { icon: 'text-xl',  text: 'text-sm',     pad: 'px-3 py-1.5', gap: 'gap-2'   },
  }
  const s = sizes[size]

  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className={`inline-flex items-center ${s.gap} ${s.pad} rounded-full font-semibold border`}
        style={{
          color: rank.color,
          background: `${rank.color}18`,
          border: `1px solid ${rank.color}35`,
          boxShadow: `0 0 10px ${rank.color}20`,
        }}
      >
        <span className={s.icon}>{rank.icon}</span>
        <span className={s.text}>{rank.name}</span>
      </span>
      {showPerks && rank.perks.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {rank.perks.map(p => (
            <li key={p} className="text-[11px] text-ink-muted flex items-center gap-1.5">
              <span style={{ color: rank.color }}>•</span> {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
