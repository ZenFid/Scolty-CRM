import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface Props {
  id: string
  label: string
  color: string
  count: number
  total?: string
  children: React.ReactNode
}

export default function KanbanColumn({ id, label, color, count, total, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col min-w-[240px] w-[240px] flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
          <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {total && <span className="text-[10px] font-mono text-ink-muted">{total}</span>}
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: `${color}15`, color }}
          >
            {count}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2 min-h-[120px] rounded-xl p-2 transition-colors duration-150 ${isOver ? 'drop-over' : ''}`}
        style={{ background: isOver ? undefined : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
      >
        <SortableContext items={[]} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </div>
  )
}
