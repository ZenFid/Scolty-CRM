import { useEffect } from 'react'
import { Command } from 'cmdk'
import { motion } from 'framer-motion'
import { Search, Users, Clapperboard, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useClients } from '@/hooks/useClients'
import { useVideos } from '@/hooks/useVideos'
import Avatar from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/Pill'

export default function CommandPalette() {
  const { closePalette, openDrawer } = useAppStore()
  const { clients } = useClients()
  const { videos } = useVideos()
  const navigate = useNavigate()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closePalette()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closePalette])

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePalette}
      />

      <motion.div
        className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[90] w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18 }}
        onClick={e => e.stopPropagation()}
      >
        <Command
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(9,15,26,0.95)', border: '1px solid rgba(125,211,252,0.12)', backdropFilter: 'blur(20px)' }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.07]">
            <Search size={15} className="text-ink-muted flex-shrink-0" />
            <Command.Input placeholder="Buscar clientes, vídeos, tags..." className="flex-1" />
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-ink-muted">
              Nenhum resultado encontrado.
            </Command.Empty>

            {/* Clients group */}
            <Command.Group heading="Clientes">
              {clients.map(c => (
                <Command.Item
                  key={c.id}
                  value={`${c.name} ${c.company ?? ''} ${c.niche ?? ''} ${c.tags.join(' ')}`}
                  onSelect={() => { openDrawer(c); closePalette() }}
                >
                  <Avatar name={c.name} color="#38bdf8" size={22} />
                  <span className="flex-1 text-ink-primary">{c.name}</span>
                  {c.company && <span className="text-ink-muted text-[11px]">{c.company}</span>}
                  <StatusPill status={c.status} />
                  <ArrowRight size={12} className="text-ink-muted ml-1" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Videos group */}
            <Command.Group heading="Vídeos">
              {videos.slice(0, 6).map(v => (
                <Command.Item
                  key={v.id}
                  value={`${v.title} ${v.format} ${v.client?.name ?? ''}`}
                  onSelect={() => { navigate('/producao'); closePalette() }}
                >
                  <Clapperboard size={14} className="text-ink-muted flex-shrink-0" />
                  <span className="flex-1 text-ink-primary text-[13px]">{v.title}</span>
                  {v.client && <span className="text-ink-muted text-[11px]">{v.client.name}</span>}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Navigation shortcuts */}
            <Command.Group heading="Ir para">
              {[
                { label: 'Dashboard',     to: '/dashboard' },
                { label: 'Pipeline',      to: '/pipeline' },
                { label: 'Clientes',      to: '/clientes' },
                { label: 'Produção',      to: '/producao' },
                { label: 'Financeiro',    to: '/financeiro' },
              ].map(nav => (
                <Command.Item
                  key={nav.to}
                  value={`ir para ${nav.label}`}
                  onSelect={() => { navigate(nav.to); closePalette() }}
                >
                  <ArrowRight size={13} className="text-cyan-brand" />
                  <span className="text-ink-secondary">{nav.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </motion.div>
    </>
  )
}
