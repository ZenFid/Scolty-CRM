import { useState } from 'react'
import { Search, MessageSquare } from 'lucide-react'
import { useClients } from '@/hooks/useClients'
import { useAppStore } from '@/store/useAppStore'
import Avatar from '@/components/ui/Avatar'
import { StatusPill, TagPill } from '@/components/ui/Pill'

export default function Database() {
  const { clients } = useClients()
  const { openDrawer } = useAppStore()
  const [q, setQ] = useState('')

  const filtered = q
    ? clients.filter(c =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.briefing?.toLowerCase().includes(q.toLowerCase()) ||
        c.edit_style?.toLowerCase().includes(q.toLowerCase()) ||
        c.tags.some(t => t.includes(q.toLowerCase()))
      )
    : clients.filter(c => c.briefing || c.edit_style || c.tags.length > 0)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="relative max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar briefings, estilos, tags..."
            className="w-full h-8 pl-8 pr-3 rounded-lg text-sm text-ink-primary outline-none border border-white/[0.08] focus:border-cyan-brand/40 bg-white/[0.04] placeholder:text-ink-muted/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => openDrawer(c)}
              className="glass-card p-4 text-left hover:border-cyan-brand/20 transition-all hover:bg-white/[0.02] flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={c.name} color={c.tags[0] ? '#38bdf8' : '#9d8bff'} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-primary truncate">{c.name}</p>
                  {c.niche && <p className="text-[11px] text-ink-muted capitalize">{c.niche}</p>}
                </div>
                <StatusPill status={c.status} />
              </div>

              {c.edit_style && (
                <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: 'rgba(157,139,255,0.12)', color: '#9d8bff', border: '1px solid rgba(157,139,255,0.2)' }}>
                  {c.edit_style}
                </span>
              )}

              {c.briefing && (
                <div className="flex gap-2">
                  <MessageSquare size={12} className="text-ink-muted flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-ink-secondary leading-relaxed line-clamp-3">{c.briefing}</p>
                </div>
              )}

              {c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {c.tags.map(t => <TagPill key={t} label={t} />)}
                </div>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-3xl mb-2">📂</p>
            <p className="text-sm font-semibold text-ink-secondary">Nenhum briefing encontrado</p>
            <p className="text-xs text-ink-muted mt-1">Adicione briefings e preferências de edição nos clientes.</p>
          </div>
        )}
      </div>
    </div>
  )
}
