import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { useAllEditors } from '@/hooks/useArena'
import { useVideos } from '@/hooks/useVideos'
import { MOCK_RANKS } from '@/lib/mockData'
import Avatar from '@/components/ui/Avatar'
import RankBadge from '@/components/ui/RankBadge'
import XpBar from '@/components/ui/XpBar'
import RadarChart, { computeRadar } from '@/components/ui/RadarChart'
import type { Editor } from '@/types'

function getRankForEditor(editor: Editor) {
  const xp = editor.total_xp ?? 0
  return [...MOCK_RANKS].sort((a, b) => b.min_xp - a.min_xp).find(r => r.min_xp <= xp) ?? MOCK_RANKS[0]
}

function getNextRank(editor: Editor) {
  const rank = getRankForEditor(editor)
  return MOCK_RANKS.find(r => r.id === rank.id + 1) ?? null
}

function getXpProgress(editor: Editor) {
  const current = getRankForEditor(editor)
  const next = getNextRank(editor)
  if (!next) return 100
  return ((editor.total_xp ?? 0) - current.min_xp) / (next.min_xp - current.min_xp) * 100
}

export default function OwnerTeam() {
  const { editors, loading } = useAllEditors()
  const { videos } = useVideos()
  const [expanded, setExpanded] = useState<string | null>(null)

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" /></div>

  return (
    <div className="h-full overflow-y-auto p-5 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{editors.length} editores ativos</p>
      </div>

      {editors.map((editor, i) => {
        const rank = getRankForEditor(editor)
        const next = getNextRank(editor)
        const progress = getXpProgress(editor)
        const editorVideos = videos.filter(v => v.editor_id === editor.id)
        const radar = computeRadar(editorVideos, editor.current_streak ?? 0)
        const isOpen = expanded === editor.id
        const deliveredCount = editorVideos.filter(v => v.stage === 'delivered').length
        const lateCount = editorVideos.filter(v => v.late).length
        const onTimePct = deliveredCount > 0 ? Math.round(((deliveredCount - lateCount) / deliveredCount) * 100) : 0

        return (
          <motion.div key={editor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden">
            {/* Summary row */}
            <button
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpanded(isOpen ? null : editor.id)}
            >
              <Avatar name={editor.name} color={editor.avatar_color} size={40} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-ink-primary">{editor.name}</p>
                  <RankBadge rank={rank} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <XpBar progress={progress} color={rank.color} height={4} animated={false} />
                  <span className="text-[10px] font-mono text-ink-muted whitespace-nowrap">
                    {editor.total_xp ?? 0} XP
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-bold text-ink-primary">{editor.current_streak ?? 0}</p>
                  <p className="text-[9px] text-ink-muted">streak</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-bold text-ink-primary">{onTimePct}%</p>
                  <p className="text-[9px] text-ink-muted">no prazo</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-bold text-ink-primary">{editorVideos.filter(v => ['editing','review'].includes(v.stage)).length}</p>
                  <p className="text-[9px] text-ink-muted">em prod.</p>
                </div>
                {isOpen ? <ChevronUp size={14} className="text-ink-muted" /> : <ChevronDown size={14} className="text-ink-muted" />}
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-white/[0.06] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Radar */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">Atributos</p>
                    <RadarChart data={radar} size={180} />
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">Performance</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Total de vídeos', value: String(deliveredCount) },
                          { label: 'Em produção',     value: String(editorVideos.filter(v => ['editing','review'].includes(v.stage)).length) },
                          { label: 'Streak atual',    value: `${editor.current_streak ?? 0} entregas` },
                          { label: 'Melhor streak',   value: `${editor.best_streak ?? 0} entregas` },
                          { label: 'Pontualidade',    value: `${onTimePct}%` },
                        ].map(s => (
                          <div key={s.label} className="flex justify-between text-xs">
                            <span className="text-ink-muted">{s.label}</span>
                            <span className="font-mono font-semibold text-ink-primary">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {next && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">Progressão</p>
                        <p className="text-xs text-ink-secondary">
                          Faltam <span className="font-semibold text-ink-primary">{(next.min_xp) - (editor.total_xp ?? 0)} XP</span> para {next.icon} {next.name}
                        </p>
                        <XpBar progress={progress} color={rank.color} height={6} animated={false} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
