import { useLocation } from 'react-router-dom'
import { Search, Plus, Command } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import Avatar from '@/components/ui/Avatar'

const TITLES: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/pipeline':     'Pipeline',
  '/clientes':     'Clientes',
  '/producao':     'Produção',
  '/financeiro':   'Financeiro',
  '/base-dados':   'Base de dados',
  '/configuracoes':'Configurações',
}

export default function Topbar() {
  const { openModal, openPalette } = useAppStore()
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Scolty CRM'

  return (
    <header className="h-[52px] flex items-center gap-3 px-5 border-b border-white/[0.06] flex-shrink-0"
      style={{ background: 'rgba(7,12,22,0.7)', backdropFilter: 'blur(12px)' }}
    >
      <h1 className="font-display text-base font-semibold text-ink-primary flex-1">{title}</h1>

      {/* Search trigger */}
      <button
        onClick={openPalette}
        className="flex items-center gap-2 px-3 h-8 rounded-lg text-[12px] text-ink-muted
          border border-white/[0.08] hover:border-cyan-brand/30 transition-colors duration-150
          hover:text-ink-secondary"
        style={{ background: 'rgba(255,255,255,0.04)', minWidth: 180 }}
      >
        <Search size={12} />
        <span className="flex-1 text-left">Buscar...</span>
        <span className="flex items-center gap-0.5 opacity-60">
          <Command size={10} /><span>K</span>
        </span>
      </button>

      <button
        onClick={() => openModal()}
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold
          text-navy-950 transition-all duration-150 hover:opacity-90 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
      >
        <Plus size={13} />
        Novo cliente
      </button>

      <Avatar name="Daniel Fidyk" color="#38bdf8" size={30} />
    </header>
  )
}
