import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Kanban, Users, Clapperboard,
  BarChart3, Database, Settings, ChevronLeft, ChevronRight, Swords, LogOut,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { useUserProfile } from '@/hooks/useUserProfile'
import Avatar from '@/components/ui/Avatar'

const NAV = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pipeline',       icon: Kanban,           label: 'Pipeline' },
  { to: '/clientes',       icon: Users,            label: 'Clientes' },
  { to: '/producao',       icon: Clapperboard,     label: 'Produção' },
  { to: '/financeiro',     icon: BarChart3,        label: 'Financeiro' },
  { to: '/base-dados',     icon: Database,         label: 'Base de dados' },
  { to: '/arena/equipe',   icon: Swords,           label: 'Arena' },
  { to: '/configuracoes',  icon: Settings,         label: 'Configurações' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const { signOut } = useAuth()
  const { profile } = useUserProfile()
  const w = sidebarCollapsed ? 64 : 240

  const displayName   = profile?.display_name   ?? 'Usuário'
  const workspaceName = profile?.workspace_name ?? 'Minha Agência'
  const avatarColor   = profile?.avatar_color   ?? '#38bdf8'

  async function handleSignOut() {
    await signOut()
    window.location.href = '/'
  }

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="glass fixed top-0 left-0 bottom-0 z-50 flex flex-col overflow-hidden"
      style={{ borderRight: '1px solid rgba(125,211,252,0.09)' }}
    >
      {/* Logo */}
      <div className="h-[52px] flex items-center px-4 gap-3 border-b border-white/[0.06] flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-navy-950 font-mono font-bold text-xs flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
        >
          SC
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-display text-sm font-semibold text-ink-primary whitespace-nowrap"
            >
              Scolty <span className="text-cyan-brand">CRM</span>
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="ml-auto text-ink-muted hover:text-ink-primary transition-colors p-0.5 rounded"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? label : undefined}
              >
                <Icon size={16} className="flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06] flex items-center gap-2 flex-shrink-0">
        <Avatar name={displayName} color={avatarColor} size={30} />
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0 flex-1"
            >
              <p className="text-xs font-semibold text-ink-primary whitespace-nowrap truncate">{displayName}</p>
              <p className="text-[10px] text-ink-muted truncate">{workspaceName}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={handleSignOut}
          title="Sair da conta"
          className="text-ink-muted hover:text-red-400 transition-colors p-1 rounded flex-shrink-0"
        >
          <LogOut size={14} />
        </button>
      </div>
    </motion.aside>
  )
}
