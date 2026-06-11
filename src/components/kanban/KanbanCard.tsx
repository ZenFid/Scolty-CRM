import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AlertCircle, Clock } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { StatusPill, FormatPill } from '@/components/ui/Pill'
import { fmtBRL, daysUntil, isOverdue } from '@/lib/utils'
import type { Client, Video } from '@/types'

// ── Client card (Pipeline) ─────────────────────────────────────
interface ClientCardProps { client: Client; onClick?: () => void }

export function ClientKanbanCard({ client, onClick }: ClientCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: client.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="glass-sm rounded-xl p-3 cursor-pointer hover:border-cyan-brand/20 transition-all hover:bg-white/[0.03] group"
    >
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={client.name} color={client.tags?.[0] ? '#38bdf8' : '#9d8bff'} size={26} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-ink-primary truncate">{client.name}</p>
          {client.company && <p className="text-[10px] text-ink-muted truncate">{client.company}</p>}
        </div>
      </div>
      {client.niche && (
        <p className="text-[10px] text-ink-muted mb-2 truncate">{client.niche}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold text-cyan-brand">
          {client.value_monthly > 0 ? fmtBRL(client.value_monthly) + '/mês' : '—'}
        </span>
        <StatusPill status={client.status} />
      </div>
      {client.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {client.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-brand/10 text-cyan-brand border border-cyan-brand/15">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Video card (Produção) ──────────────────────────────────────
interface VideoCardProps { video: Video; onClick?: () => void }

export function VideoKanbanCard({ video, onClick }: VideoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: video.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const days   = daysUntil(video.deadline)
  const overdue = isOverdue(video.deadline)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="glass-sm rounded-xl p-3 cursor-pointer hover:border-cyan-brand/20 transition-all hover:bg-white/[0.03]"
    >
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <p className="text-xs font-semibold text-ink-primary line-clamp-2 flex-1">{video.title}</p>
        <FormatPill format={video.format} />
      </div>
      {video.client && (
        <p className="text-[10px] text-ink-muted mb-2 truncate">{video.client.name}</p>
      )}
      <div className="flex items-center justify-between">
        {video.editor ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={video.editor.name} color={video.editor.avatar_color} size={18} />
            <span className="text-[10px] text-ink-muted">{video.editor.name.split(' ')[0]}</span>
          </div>
        ) : <span className="text-[10px] text-ink-muted italic">Sem editor</span>}
        {video.deadline && (
          <div className={`flex items-center gap-1 ${overdue ? 'text-rose-400' : days !== null && days <= 1 ? 'text-amber-400' : 'text-ink-muted'}`}>
            {overdue ? <AlertCircle size={10} /> : <Clock size={10} />}
            <span className="text-[9px] font-mono">
              {overdue ? 'Atrasado' : days === 0 ? 'Hoje' : `${days}d`}
            </span>
          </div>
        )}
      </div>
      {(video.rework_count ?? 0) > 0 && (
        <div className="mt-2 text-[9px] text-amber-400 flex items-center gap-1">
          <span>⚠</span> {video.rework_count}x retrabalho
        </div>
      )}
    </div>
  )
}
