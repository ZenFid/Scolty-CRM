import { motion } from 'framer-motion'
import { Flame, Zap, Target, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useArena } from '@/hooks/useArena'
import { useMissions } from '@/hooks/useMissions'
import { MOCK_EDITORS, MOCK_VIDEOS_RICH } from '@/lib/mockData'
import { fmtBRL, daysUntil, isOverdue } from '@/lib/utils'
import XpBar from '@/components/ui/XpBar'
import RankBadge from '@/components/ui/RankBadge'
import MissionCard from '@/components/ui/MissionCard'
import { FormatPill } from '@/components/ui/Pill'

const DEMO_EDITOR = MOCK_EDITORS[0]

const WEEKLY_XP = [
  { day: 'Seg', xp: 80 }, { day: 'Ter', xp: 110 }, { day: 'Qua', xp: 0 },
  { day: 'Qui', xp: 160 }, { day: 'Sex', xp: 90 }, { day: 'Sáb', xp: 0 }, { day: 'Dom', xp: 0 },
]

export default function EditorDashboard() {
  const { editor, currentRank, nextRank, xpProgress, xpToNext, loading } = useArena(DEMO_EDITOR.id)
  const { daily, weekly, completedToday } = useMissions(DEMO_EDITOR.id)

  const myVideos = MOCK_VIDEOS_RICH.filter(v => v.editor_id === DEMO_EDITOR.id && v.stage !== 'delivered')
    .sort((a, b) => (a.deadline ?? '9999') < (b.deadline ?? '9999') ? -1 : 1)

  const ed = editor ?? DEMO_EDITOR

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" /></div>

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
        style={{ border: `1px solid ${currentRank?.color ?? '#38bdf8'}30` }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">Olá, {ed.name.split(' ')[0]} 👋</p>
            <h1 className="font-display text-xl font-bold text-ink-primary">{ed.total_xp ?? 0} XP total</h1>
          </div>
          {currentRank && <RankBadge rank={currentRank} size="md" />}
        </div>

        {currentRank && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-ink-muted">{currentRank.name}</span>
              {nextRank && <span className="text-[10px] text-ink-muted">{nextRank.name} — faltam {xpToNext} XP</span>}
            </div>
            <XpBar progress={xpProgress} color={currentRank.color} height={8} />
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Streak', value: String(ed.current_streak ?? 0), icon: <Flame size={14} />, color: '#fb7185', sub: 'entregas seguidas' },
          { label: 'XP semanal', value: '440', icon: <Zap size={14} />, color: '#38bdf8', sub: 'esta semana' },
          { label: 'Missões hoje', value: `${completedToday}/${daily.length}`, icon: <Target size={14} />, color: '#3ddc97', sub: 'concluídas' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1" style={{ color: s.color }}>
              {s.icon}
            </div>
            <p className="font-mono text-xl font-bold text-ink-primary">{s.value}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-muted mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Weekly XP chart */}
        <div className="glass-card p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">XP da semana</p>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={WEEKLY_XP} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#62769b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'rgba(9,15,26,0.9)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [v, 'XP']}
              />
              <Bar dataKey="xp" fill="#38bdf8" radius={[4,4,0,0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming deadlines */}
        <div className="glass-card p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Próximas entregas</p>
          <div className="space-y-2">
            {myVideos.length === 0 ? (
              <p className="text-xs text-ink-muted italic">Sem vídeos pendentes 🎉</p>
            ) : myVideos.slice(0, 4).map(v => {
              const days = daysUntil(v.deadline)
              const overdue = isOverdue(v.deadline)
              return (
                <div key={v.id} className="flex items-center gap-2">
                  <FormatPill format={v.format} />
                  <p className="flex-1 text-xs text-ink-secondary truncate">{v.title}</p>
                  <div className={`flex items-center gap-1 ${overdue ? 'text-rose-400' : days !== null && days <= 2 ? 'text-amber-400' : 'text-ink-muted'}`}>
                    <Clock size={10} />
                    <span className="text-[10px] font-mono">
                      {overdue ? 'Atrasado' : days === 0 ? 'Hoje' : `${days}d`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Missions */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Missões de hoje</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {daily.map(({ mission, progress, completed }) => (
            <MissionCard key={mission.id} mission={mission} progress={progress} completed={completed} />
          ))}
        </div>
      </div>

      {weekly.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Missões semanais</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {weekly.map(({ mission, progress, completed }) => (
              <MissionCard key={mission.id} mission={mission} progress={progress} completed={completed} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
