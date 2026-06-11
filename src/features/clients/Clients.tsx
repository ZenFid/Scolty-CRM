import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronUp, ChevronDown, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { useClients } from '@/hooks/useClients'
import { useAppStore } from '@/store/useAppStore'
import { fmtBRL, fmtDate, healthColor } from '@/lib/utils'
import { StatusPill, TagPill } from '@/components/ui/Pill'
import Avatar from '@/components/ui/Avatar'
import ScoreBar from '@/components/ui/ScoreBar'
import type { Client, ClientStatus } from '@/types'
import { STATUS_CONFIG, CLIENT_STATUSES } from '@/types'

type SortKey = 'name' | 'value_monthly' | 'health_score' | 'status' | 'created_at'

export default function Clients() {
  const { clients, loading, deleteClient } = useClients()
  const { openDrawer, openModal } = useAppStore()
  const [q, setQ]               = useState('')
  const [filterStatus, setFilterStatus] = useState<ClientStatus | null>(null)
  const [sortKey, setSortKey]   = useState<SortKey>('created_at')
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('desc')
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const PER = 10

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    let list = clients
    if (filterStatus) list = list.filter(c => c.status === filterStatus)
    if (q) {
      const lq = q.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(lq) ||
        c.company?.toLowerCase().includes(lq) ||
        c.niche?.toLowerCase().includes(lq) ||
        c.tags.some(t => t.includes(lq))
      )
    }
    return [...list].sort((a, b) => {
      let va = a[sortKey] ?? '', vb = b[sortKey] ?? ''
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }, [clients, q, filterStatus, sortKey, sortDir])

  const pages  = Math.ceil(sorted.length / PER)
  const slice  = sorted.slice((page - 1) * PER, page * PER)

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronUp size={10} className="opacity-30" />
    return sortDir === 'asc' ? <ChevronUp size={10} className="text-cyan-brand" /> : <ChevronDown size={10} className="text-cyan-brand" />
  }

  function toggleSelect(id: string) {
    setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" />
    </div>
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            placeholder="Buscar clientes..."
            className="w-full h-8 pl-8 pr-3 rounded-lg text-sm text-ink-primary outline-none border border-white/[0.08] focus:border-cyan-brand/40 bg-white/[0.04] placeholder:text-ink-muted/50"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {CLIENT_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setFilterStatus(p => p === s ? null : s); setPage(1) }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all ${filterStatus === s ? STATUS_CONFIG[s].className : 'border-white/[0.08] text-ink-muted hover:border-white/20'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_CONFIG[s].dot }} />
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <button
            onClick={async () => { for (const id of selected) await deleteClient(id); setSelected(new Set()) }}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-[12px] font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={12} /> Excluir ({selected.size})
          </button>
        )}
        <span className="ml-auto text-[11px] text-ink-muted">{sorted.length} clientes</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10" style={{ background: 'rgba(7,12,22,0.9)', backdropFilter: 'blur(8px)' }}>
            <tr className="text-left border-b border-white/[0.06]">
              <th className="w-8 px-5 py-2.5">
                <input type="checkbox"
                  checked={selected.size === slice.length && slice.length > 0}
                  onChange={e => setSelected(e.target.checked ? new Set(slice.map(c => c.id)) : new Set())}
                  className="accent-cyan-brand"
                />
              </th>
              {[
                { k: 'name' as SortKey, label: 'Nome' },
                { k: 'status' as SortKey, label: 'Status' },
                { k: 'value_monthly' as SortKey, label: 'Valor/mês' },
                { k: 'health_score' as SortKey, label: 'Health' },
              ].map(col => (
                <th key={col.k} className="px-3 py-2.5 cursor-pointer select-none" onClick={() => toggleSort(col.k)}>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    {col.label}<SortIcon k={col.k} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">Tags</th>
              <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">Cliente desde</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {slice.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                onClick={() => openDrawer(c)}
              >
                <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} className="accent-cyan-brand" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} color={c.tags[0] ? '#38bdf8' : '#9d8bff'} size={30} />
                    <div>
                      <p className="text-sm font-semibold text-ink-primary">{c.name}</p>
                      {c.company && <p className="text-[11px] text-ink-muted">{c.company}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3"><StatusPill status={c.status} /></td>
                <td className="px-3 py-3">
                  <span className="text-sm font-mono font-semibold text-ink-primary">
                    {c.value_monthly > 0 ? fmtBRL(c.value_monthly) : '—'}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <ScoreBar score={c.health_score} />
                    <span className="text-xs font-mono" style={{ color: healthColor(c.health_score) }}>{c.health_score}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 2).map(t => <TagPill key={t} label={t} />)}
                  </div>
                </td>
                <td className="px-3 py-3 text-[11px] text-ink-muted">{fmtDate(c.since)}</td>
                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(c)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink-primary hover:bg-white/5 transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => deleteClient(c.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-2xl mb-2">👤</p>
            <p className="text-sm font-semibold text-ink-secondary">Nenhum cliente encontrado</p>
            <p className="text-xs text-ink-muted mt-1">Ajuste os filtros ou adicione um novo cliente.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-white/[0.06] flex-shrink-0">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${page === p ? 'bg-cyan-brand/15 text-cyan-brand border border-cyan-brand/25' : 'text-ink-muted hover:text-ink-primary'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
