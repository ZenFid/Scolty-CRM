import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { MOCK_EDITORS, MOCK_RANKS } from '@/lib/mockData'
import Avatar from '@/components/ui/Avatar'
import RankBadge from '@/components/ui/RankBadge'

const DEMO_EDITOR = MOCK_EDITORS[0]

export default function Leaderboard() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')
  const { entries, loading } = useLeaderboard(period)

  const myEntry = entries.find(e => e.editor.id === DEMO_EDITOR.id)
  const top3    = entries.slice(0, 3)
  const rest    = entries.slice(3)

  function getRank(editor: typeof MOCK_EDITORS[0]) {
    const xp = editor.total_xp ?? 0
    return [...MOCK_RANKS].sort((a, b) => b.min_xp - a.min_xp).find(r => r.min_xp <= xp) ?? MOCK_RANKS[0]
  }

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" /></div>

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      {/* Period toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl glass-sm w-fit">
        {(['weekly','monthly'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 h-8 rounded-lg text-xs font-semibold transition-all ${period === p ? 'bg-cyan-brand/15 text-cyan-brand' : 'text-ink-muted hover:text-ink-primary'}`}>
            {p === 'weekly' ? 'Esta semana' : 'Este mês'}
          </button>
        ))}
      </div>

      {/* Podium top 3 */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-3">
          {[top3[1], top3[0], top3[2]].map((entry, i) => {
            const heights = ['h-24', 'h-32', 'h-20']
            const medals  = ['🥈', '🥇', '🥉']
            const order   = [2, 1, 3]
            return (
              <motion.div key={entry.editor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2">
                <Avatar name={entry.editor.name} color={entry.editor.avatar_color} size={40} />
                <p className="text-xs font-semibold text-ink-primary">{entry.editor.name.split(' ')[0]}</p>
                <p className="text-[10px] font-mono text-cyan-brand">{entry.xp} XP</p>
                <div className={`${heights[i]} w-16 rounded-t-xl flex items-end justify-center pb-2 text-xl`}
                  style={{ background: `linear-gradient(to top, rgba(56,189,248,0.2), rgba(56,189,248,0.05))`, border: '1px solid rgba(56,189,248,0.15)' }}>
                  {medals[i]}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <div className="glass-card overflow-hidden">
        {entries.map((entry, i) => {
          const isMe = entry.editor.id === DEMO_EDITOR.id
          const rank = getRank(entry.editor)
          return (
            <motion.div key={entry.editor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] last:border-0 transition-colors
                ${isMe ? 'bg-cyan-brand/5' : 'hover:bg-white/[0.02]'}`}>
              <span className={`w-6 text-center font-mono text-xs font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-ink-muted'}`}>
                {i + 1}
              </span>
              <Avatar name={entry.editor.name} color={entry.editor.avatar_color} size={32} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${isMe ? 'text-cyan-brand' : 'text-ink-primary'}`}>
                    {entry.editor.name}{isMe ? ' (você)' : ''}
                  </p>
                  <RankBadge rank={rank} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-ink-primary">{entry.xp} XP</p>
                {entry.delta !== 0 && (
                  <div className={`flex items-center gap-0.5 justify-end text-[10px] font-mono ${entry.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {entry.delta > 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                    {Math.abs(entry.delta)}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
        {entries.length === 0 && (
          <div className="py-12 text-center text-xs text-ink-muted">Sem dados para este período.</div>
        )}
      </div>
    </div>
  )
}
