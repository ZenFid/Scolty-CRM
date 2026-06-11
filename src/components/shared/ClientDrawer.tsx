import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Edit2, Phone, Tag, Calendar, MessageCircle, Clock } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useClients } from '@/hooks/useClients'
import { MOCK_ACTIVITIES_RICH } from '@/lib/mockData'
import { fmtBRL, fmtDate, fmtRelative, healthColor, healthLabel } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import { StatusPill, TagPill } from '@/components/ui/Pill'
import ScoreBar from '@/components/ui/ScoreBar'
import type { Activity } from '@/types'

const ACTIVITY_ICON: Record<string, React.ReactNode> = {
  note:          <Clock size={12} />,
  call:          <Phone size={12} />,
  email:         <Tag size={12} />,
  message:       <MessageCircle size={12} />,
  meeting:       <Calendar size={12} />,
  status_change: <Tag size={12} />,
}

export default function ClientDrawer() {
  const { drawerClient, closeDrawer, openModal } = useAppStore()
  const { clients } = useClients()
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES_RICH)

  const client = drawerClient
    ? (clients.find(c => c.id === drawerClient.id) ?? drawerClient)
    : null

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeDrawer])

  if (!client) return null

  const clientActivities = activities.filter(a => a.client_id === client.id)

  return (
    <>
      {/* Scrim */}
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${client.name}`}
        className="fixed top-0 right-0 bottom-0 z-[70] flex flex-col overflow-hidden"
        style={{ width: 400, background: 'rgba(9,15,26,0.92)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(125,211,252,0.1)' }}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.07] flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar name={client.name} color={client.tags?.[0] ? '#38bdf8' : '#9d8bff'} size={44} />
              <div>
                <h2 className="font-display text-base font-semibold text-ink-primary">{client.name}</h2>
                {client.company && <p className="text-xs text-ink-muted">{client.company}</p>}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-primary hover:bg-white/5 transition-colors"
                onClick={() => openModal(client)}
                aria-label="Editar cliente"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-primary hover:bg-white/5 transition-colors"
                onClick={closeDrawer}
                aria-label="Fechar"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <StatusPill status={client.status} />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Valor/mês', value: fmtBRL(client.value_monthly) },
              { label: 'Vídeos/mês', value: client.videos_per_month || '—' },
              { label: 'Health', value: `${client.health_score}` },
            ].map(s => (
              <div key={s.label} className="glass-sm rounded-lg p-3 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-muted mb-1">{s.label}</p>
                <p className="font-mono text-sm font-semibold text-ink-primary">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Health score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Health Score</p>
              <span className="text-xs font-semibold" style={{ color: healthColor(client.health_score) }}>
                {healthLabel(client.health_score)}
              </span>
            </div>
            <ScoreBar score={client.health_score} />
          </div>

          {/* Contact */}
          {client.contact && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-2">Contato</p>
              <div className="flex items-center gap-2 text-sm text-ink-secondary">
                <Phone size={13} className="text-ink-muted flex-shrink-0" />
                {client.contact}
              </div>
            </div>
          )}

          {/* Tags */}
          {client.tags?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {client.tags.map(t => <TagPill key={t} label={t} />)}
              </div>
            </div>
          )}

          {/* Briefing */}
          {client.briefing && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-2">Briefing</p>
              <p className="text-sm text-ink-secondary leading-relaxed">{client.briefing}</p>
            </div>
          )}

          {/* Edit style */}
          {client.edit_style && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-2">Estilo de edição</p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{ background: 'rgba(157,139,255,0.15)', color: '#9d8bff', border: '1px solid rgba(157,139,255,0.25)' }}>
                {client.edit_style}
              </span>
            </div>
          )}

          {/* Since */}
          {client.since && (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Calendar size={12} />
              Cliente desde {fmtDate(client.since)}
            </div>
          )}

          {/* Activity timeline */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-3">Atividade recente</p>
            {clientActivities.length === 0 ? (
              <p className="text-xs text-ink-muted italic">Nenhuma atividade registrada.</p>
            ) : (
              <div className="relative pl-4">
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/[0.07]" />
                {clientActivities.map(a => (
                  <div key={a.id} className="relative mb-4 last:mb-0">
                    <div className="absolute -left-[11px] top-1 w-4 h-4 rounded-full flex items-center justify-center text-cyan-brand"
                      style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}>
                      {ACTIVITY_ICON[a.type]}
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed">{a.description}</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">{fmtRelative(a.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.07] flex gap-2 flex-shrink-0">
          <button
            onClick={() => openModal(client)}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold
              border border-white/[0.1] text-ink-secondary hover:border-cyan-brand/40 hover:text-ink-primary transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Edit2 size={13} /> Editar completo
          </button>
          {client.contact && (
            <a
              href={`https://wa.me/${client.contact.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 flex items-center gap-1.5 rounded-lg text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
            >
              <MessageCircle size={13} /> Mensagem
            </a>
          )}
        </div>
      </motion.aside>
    </>
  )
}
