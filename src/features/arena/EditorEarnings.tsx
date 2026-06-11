import { motion } from 'framer-motion'
import { DollarSign, CheckCircle2, Clock } from 'lucide-react'
import { useEditorEarnings } from '@/hooks/useEditorEarnings'
import { MOCK_EDITORS } from '@/lib/mockData'
import { fmtBRL, fmtDate } from '@/lib/utils'
import KpiCard from '@/components/ui/KpiCard'

const DEMO_EDITOR = MOCK_EDITORS[0]

export default function EditorEarnings() {
  const { earnings, pending, paid, byPeriod, loading } = useEditorEarnings(DEMO_EDITOR.id)

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" /></div>

  const periods = Object.entries(byPeriod).sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <KpiCard label="A receber" value={fmtBRL(pending)} trend={0} sparkline={[100,150,200,180,pending]} />
        <KpiCard label="Já recebido" value={fmtBRL(paid)} trend={0} sparkline={[200,350,300,400,paid]} />
      </div>

      {/* Por período */}
      <div className="glass-card p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Por mês</p>
        <div className="space-y-2">
          {periods.map(([period, total]) => (
            <div key={period} className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0">
              <span className="text-sm text-ink-secondary font-medium">{period}</span>
              <span className="font-mono text-sm font-semibold text-ink-primary">{fmtBRL(total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Histórico de pagamentos</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {earnings.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-4 py-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${e.status === 'pago' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                {e.status === 'pago' ? <CheckCircle2 size={13}/> : <Clock size={13}/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ink-secondary truncate">
                  {e.status === 'pago' ? `Pago em ${fmtDate(e.paid_at)}` : 'A receber'}
                </p>
                <p className="text-[10px] text-ink-muted">{e.period}</p>
              </div>
              <span className={`font-mono text-sm font-bold ${e.status === 'pago' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {fmtBRL(e.amount)}
              </span>
            </motion.div>
          ))}
          {earnings.length === 0 && (
            <div className="py-10 text-center text-xs text-ink-muted">Nenhum registro financeiro.</div>
          )}
        </div>
      </div>
    </div>
  )
}
