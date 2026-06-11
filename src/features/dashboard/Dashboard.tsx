import { motion } from 'framer-motion'
import { Users, TrendingUp, Video, DollarSign, CheckSquare, ArrowRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useClients } from '@/hooks/useClients'
import { useVideos } from '@/hooks/useVideos'
import { MOCK_TASKS_RICH } from '@/lib/mockData'
import { fmtBRL } from '@/lib/utils'
import { STAGE_CONFIG } from '@/types'
import KpiCard from '@/components/ui/KpiCard'
import Avatar from '@/components/ui/Avatar'

const MRR_DATA = [
  { m: 'Jan', v: 8200 }, { m: 'Fev', v: 9100 }, { m: 'Mar', v: 11400 },
  { m: 'Abr', v: 10800 }, { m: 'Mai', v: 13200 }, { m: 'Jun', v: 14500 },
]

const NICHE_COLORS = ['#38bdf8','#9d8bff','#3ddc97','#fbbf24','#fb7185']

export default function Dashboard() {
  const { clients } = useClients()
  const { videos }  = useVideos()

  const activeClients = clients.filter(c => c.status === 'fechado')
  const mrr           = activeClients.reduce((s, c) => s + c.value_monthly, 0)
  const inPipeline    = clients.filter(c => c.status === 'proposta').reduce((s, c) => s + c.value_monthly, 0)
  const inProduction  = videos.filter(v => ['editing','review'].includes(v.stage)).length

  const niches = clients
    .filter(c => c.niche)
    .reduce((acc, c) => { acc[c.niche!] = (acc[c.niche!] ?? 0) + 1; return acc }, {} as Record<string, number>)
  const nicheData = Object.entries(niches).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, v]) => ({ name: n, value: v }))

  const tasks = MOCK_TASKS_RICH.filter(t => !t.done)
  const recentVideos = videos.slice(0, 5)

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'MRR', value: fmtBRL(mrr), icon: <DollarSign size={14}/>, trend: 9.8, sparkline: MRR_DATA.map(d => d.v) },
          { label: 'Clientes ativos', value: String(activeClients.length), icon: <Users size={14}/>, trend: 5, sparkline: [3,4,4,5,5,activeClients.length] },
          { label: 'Em produção', value: String(inProduction), icon: <Video size={14}/>, trend: -2, sparkline: [8,10,7,9,11,inProduction] },
          { label: 'Pipeline', value: fmtBRL(inPipeline), icon: <TrendingUp size={14}/>, trend: 14, sparkline: [5000,6000,5500,7000,8000,inPipeline] },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <KpiCard label={k.label} value={k.value} trend={k.trend} sparkline={k.sparkline} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* MRR Chart */}
        <div className="glass-card p-4 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Evolução MRR</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={MRR_DATA}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fill: '#62769b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'rgba(9,15,26,0.9)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [fmtBRL(v), 'MRR']}
              />
              <Area type="monotone" dataKey="v" stroke="#38bdf8" strokeWidth={2} fill="url(#mrrGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Niche donut */}
        <div className="glass-card p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Nichos</p>
          {nicheData.length > 0 ? (
            <>
              <PieChart width={120} height={120} className="mx-auto">
                <Pie data={nicheData} cx={55} cy={55} innerRadius={32} outerRadius={52} dataKey="value" paddingAngle={3}>
                  {nicheData.map((_, i) => <Cell key={i} fill={NICHE_COLORS[i % NICHE_COLORS.length]} />)}
                </Pie>
              </PieChart>
              <div className="mt-3 space-y-1.5">
                {nicheData.map((n, i) => (
                  <div key={n.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: NICHE_COLORS[i] }} />
                    <span className="text-[11px] text-ink-secondary flex-1 truncate capitalize">{n.name}</span>
                    <span className="text-[11px] font-mono text-ink-muted">{n.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-xs text-ink-muted italic">Sem dados</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Follow-ups */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Follow-ups hoje</p>
            <CheckSquare size={13} className="text-ink-muted" />
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-xs text-ink-muted italic">Tudo em dia ✓</p>
            ) : tasks.map(t => (
              <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-secondary truncate">{t.title}</p>
                  {t.client && <p className="text-[10px] text-ink-muted">{t.client.name}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent videos */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Vídeos recentes</p>
            <ArrowRight size={13} className="text-ink-muted" />
          </div>
          <div className="space-y-2">
            {recentVideos.map(v => (
              <div key={v.id} className="flex items-center gap-2">
                {v.editor && <Avatar name={v.editor.name} color={v.editor.avatar_color} size={22} />}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-ink-secondary truncate">{v.title}</p>
                  <p className="text-[10px] text-ink-muted">{v.client?.name}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${STAGE_CONFIG[v.stage].color}22`, color: STAGE_CONFIG[v.stage].color }}
                >
                  {STAGE_CONFIG[v.stage].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
