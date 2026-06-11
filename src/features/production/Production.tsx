import { useState } from 'react'
import { useVideos } from '@/hooks/useVideos'
import { useEditors } from '@/hooks/useEditors'
import { useAppStore } from '@/store/useAppStore'
import { STAGE_CONFIG, CLIENT_STAGES } from '@/types'
import { fmtBRL } from '@/lib/utils'
import KanbanBoard, { type KanbanColumnDef } from '@/components/kanban/KanbanBoard'
import { VideoKanbanCard } from '@/components/kanban/KanbanCard'
import Avatar from '@/components/ui/Avatar'
import type { Video } from '@/types'

export default function Production() {
  const { videos, moveVideo, loading } = useVideos()
  const { editors } = useEditors()
  const [filterEditor, setFilterEditor] = useState<string | null>(null)

  const filtered = filterEditor ? videos.filter(v => v.editor_id === filterEditor) : videos

  const columns: KanbanColumnDef<Video>[] = CLIENT_STAGES.map(stage => {
    const items = filtered.filter(v => v.stage === stage)
    const cfg = STAGE_CONFIG[stage]
    return {
      id: stage,
      label: cfg.label,
      color: cfg.color,
      items,
      renderCard: (v) => <VideoKanbanCard key={v.id} video={v} />,
    }
  })

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" />
    </div>
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Editor filter */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mr-1">Filtrar editor:</span>
        <button
          onClick={() => setFilterEditor(null)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${!filterEditor ? 'border-cyan-brand/30 text-cyan-brand bg-cyan-brand/10' : 'border-white/10 text-ink-muted hover:border-white/20'}`}
        >
          Todos
        </button>
        {editors.map(e => (
          <button
            key={e.id}
            onClick={() => setFilterEditor(e.id === filterEditor ? null : e.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${filterEditor === e.id ? 'border-cyan-brand/30 text-cyan-brand bg-cyan-brand/10' : 'border-white/10 text-ink-muted hover:border-white/20'}`}
          >
            <Avatar name={e.name} color={e.avatar_color} size={14} />
            {e.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden pt-4">
        <KanbanBoard
          columns={columns}
          onMove={(id, stage) => moveVideo(id, stage as never)}
        />
      </div>
    </div>
  )
}
