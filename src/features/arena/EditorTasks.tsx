import { useState } from 'react'
import { motion } from 'framer-motion'
import { List, Columns, AlertCircle, Clock } from 'lucide-react'
import { useVideos } from '@/hooks/useVideos'
import { MOCK_EDITORS } from '@/lib/mockData'
import { STAGE_CONFIG, CLIENT_STAGES, FORMAT_CONFIG } from '@/types'
import { daysUntil, isOverdue, fmtDate } from '@/lib/utils'
import { FormatPill } from '@/components/ui/Pill'
import KanbanBoard, { type KanbanColumnDef } from '@/components/kanban/KanbanBoard'
import { VideoKanbanCard } from '@/components/kanban/KanbanCard'
import type { Video } from '@/types'

const DEMO_EDITOR = MOCK_EDITORS[0]

export default function EditorTasks() {
  const { videos, moveVideo } = useVideos()
  const [view, setView] = useState<'list' | 'kanban'>('list')

  const myVideos = videos.filter(v => v.editor_id === DEMO_EDITOR.id)
    .sort((a, b) => (a.deadline ?? '9999') < (b.deadline ?? '9999') ? -1 : 1)

  const columns: KanbanColumnDef<Video>[] = CLIENT_STAGES.filter(s => s !== 'backlog').map(stage => ({
    id: stage,
    label: STAGE_CONFIG[stage].label,
    color: STAGE_CONFIG[stage].color,
    items: myVideos.filter(v => v.stage === stage),
    renderCard: (v) => <VideoKanbanCard key={v.id} video={v} />,
  }))

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div>
          <p className="text-sm font-semibold text-ink-primary">{myVideos.length} vídeos atribuídos</p>
          <p className="text-[11px] text-ink-muted">{myVideos.filter(v => isOverdue(v.deadline)).length} com atraso</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg glass-sm">
          {([['list', <List size={13}/>],['kanban', <Columns size={13}/>]] as const).map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${view === v ? 'bg-cyan-brand/15 text-cyan-brand' : 'text-ink-muted hover:text-ink-primary'}`}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'kanban' ? (
          <div className="h-full pt-4">
            <KanbanBoard columns={columns} onMove={(id, stage) => moveVideo(id, stage as never)} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-5 space-y-2">
            {myVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-3xl mb-2">🎬</p>
                <p className="text-sm font-semibold text-ink-secondary">Sem vídeos atribuídos</p>
                <p className="text-xs text-ink-muted mt-1">Aguarde novos vídeos do seu gestor.</p>
              </div>
            ) : myVideos.map((v, i) => {
              const days = daysUntil(v.deadline)
              const overdue = isOverdue(v.deadline)
              const stage = STAGE_CONFIG[v.stage]
              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="glass-sm rounded-xl p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-primary truncate">{v.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {v.client && <span className="text-[11px] text-ink-muted">{v.client.name}</span>}
                      <FormatPill format={v.format} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${stage.color}15`, color: stage.color, border: `1px solid ${stage.color}25` }}>
                      {stage.label}
                    </span>
                    {v.deadline && (
                      <div className={`flex items-center gap-1 ${overdue ? 'text-rose-400' : days !== null && days <= 1 ? 'text-amber-400' : 'text-ink-muted'}`}>
                        {overdue ? <AlertCircle size={11}/> : <Clock size={11}/>}
                        <span className="text-[10px] font-mono">
                          {overdue ? 'Atrasado' : days === 0 ? 'Hoje' : days === 1 ? 'Amanhã' : fmtDate(v.deadline)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
