import { useState } from 'react'
import { motion } from 'framer-motion'
import { useArena } from '@/hooks/useArena'
import { MOCK_EDITORS } from '@/lib/mockData'
import AchievementCard from '@/components/ui/AchievementCard'
import type { AchievementRarity } from '@/types'

const DEMO_EDITOR = MOCK_EDITORS[0]
const RARITIES: { v: AchievementRarity | 'all'; label: string }[] = [
  { v: 'all',     label: 'Todos' },
  { v: 'comum',   label: 'Comum' },
  { v: 'raro',    label: 'Raro' },
  { v: 'epico',   label: 'Épico' },
  { v: 'lendario',label: 'Lendário' },
]

export default function EditorAchievements() {
  const { achievements, unlocked, unlockedIds, loading } = useArena(DEMO_EDITOR.id)
  const [filter, setFilter] = useState<AchievementRarity | 'all'>('all')
  const [showLocked, setShowLocked] = useState(true)

  const filtered = achievements.filter(a => {
    if (filter !== 'all' && a.rarity !== filter) return false
    if (!showLocked && !unlockedIds.has(a.id)) return false
    return true
  })

  const unlockedCount = unlockedIds.size

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" /></div>

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-ink-primary">{unlockedCount} / {achievements.length} conquistas</p>
            <p className="text-[11px] text-ink-muted">Continue entregando para desbloquear mais!</p>
          </div>
          <button
            onClick={() => setShowLocked(p => !p)}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${showLocked ? 'border-white/15 text-ink-muted' : 'border-cyan-brand/25 text-cyan-brand bg-cyan-brand/10'}`}
          >
            {showLocked ? 'Mostrar só desbloqueadas' : 'Mostrar todas'}
          </button>
        </div>
        <div className="flex gap-1.5">
          {RARITIES.map(r => (
            <button key={r.v} onClick={() => setFilter(r.v)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${filter === r.v ? 'border-cyan-brand/30 text-cyan-brand bg-cyan-brand/10' : 'border-white/[0.08] text-ink-muted hover:border-white/20'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((a, i) => {
            const ea = unlocked.find(u => u.achievement_id === a.id)
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <AchievementCard achievement={a} unlocked={unlockedIds.has(a.id)} unlockedAt={ea?.unlocked_at} />
              </motion.div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-3xl mb-2">🏅</p>
            <p className="text-sm font-semibold text-ink-secondary">Nenhuma conquista aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
