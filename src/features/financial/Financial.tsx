import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useClients } from '@/hooks/useClients'
import { fmtBRL } from '@/lib/utils'
import KpiCard from '@/components/ui/KpiCard'
import { StatusPill } from '@/components/ui/Pill'

const MRR_DATA = [
  { m: 'Jan', v: 8200 }, { m: 'Fev', v: 9100 }, { m: 'Mar', v: 11400 },
  { m: 'Abr', v: 10800 }, { m: 'Mai', v: 13200 }, { m: 'Jun', v: 14500 },
]

export default function Financial() {
  const { clients } = useClients()
  const active  = clients.filter(c => c.status === 'fechado')
  const mrr     = active.reduce((s, c) => s + c.value_monthly, 0)
  const avgTicket = active.length ? Math.round(mrr / active.length) : 0
  const totalVideos = active.reduce((s, c) => s + c.videos_per_month, 0)

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="MRR" value={fmtBRL(mrr)} trend={9.8} sparkline={MRR_DATA.map(d => d.v)} />
        <KpiCard label="Ticket médio" value={fmtBRL(avgTicket)} trend={2.1} sparkline={[800,950,900,1000,1100,avgTicket]} />
        <KpiCard label="Clientes ativos" value={String(active.length)} trend={0} sparkline={[3,4,5,5,5,active.length]} />
        <KpiCard label="Vídeos/mês" value={String(totalVideos)} trend={5} sparkline={[30,35,40,42,48,totalVideos]} />
      </div>

      <div className="glass-card p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Evolução MRR — últimos 6 meses</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={MRR_DATA}>
            <defs>
              <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="m" tick={{ fill: '#62769b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => fmtBRL(v)} tick={{ fill: '#62769b', fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
            <Tooltip
              contentStyle={{ background: 'rgba(9,15,26,0.9)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [fmtBRL(v), 'MRR']}
            />
            <Area type="monotone" dataKey="v" stroke="#38bdf8" strokeWidth={2} fill="url(#finGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Receita por cliente</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/[0.06]">
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">Cliente</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">Valor/mês</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">Vídeos/mês</th>
            </tr>
          </thead>
          <tbody>
            {clients.filter(c => c.value_monthly > 0).sort((a, b) => b.value_monthly - a.value_monthly).map(c => (
              <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-ink-primary">{c.name}</p>
                  {c.company && <p className="text-[11px] text-ink-muted">{c.company}</p>}
                </td>
                <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                <td className="px-4 py-3 font-mono text-sm font-semibold text-ink-primary">{fmtBRL(c.value_monthly)}</td>
                <td className="px-4 py-3 font-mono text-sm text-ink-secondary">{c.videos_per_month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
