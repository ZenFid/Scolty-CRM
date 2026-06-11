import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CheckSquare, Trophy, BarChart2,
  DollarSign, MessageCircle, ChevronLeft, Menu
} from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { MOCK_EDITORS } from '@/lib/mockData'
import XpToastProvider from '@/components/arena/XpToastProvider'
import { useAppStore } from '@/store/useAppStore'

const NAV = [
  { to: '/arena',           label: 'Meu Dashboard',  icon: <LayoutDashboard size={16} />, exact: true },
  { to: '/arena/tarefas',   label: 'Minhas Tarefas',  icon: <CheckSquare size={16} /> },
  { to: '/arena/conquistas',label: 'Conquistas',       icon: <Trophy size={16} /> },
  { to: '/arena/ranking',   label: 'Ranking',          icon: <BarChart2 size={16} /> },
  { to: '/arena/ganhos',    label: 'Meus Ganhos',      icon: <DollarSign size={16} /> },
  { to: '/arena/coach',     label: 'AI Coach',         icon: <MessageCircle size={16} /> },
]

// For demo, use first editor
const DEMO_EDITOR = MOCK_EDITORS[0]

export default function EditorPortal() {
  const [collapsed, setCollapsed] = useState(false)
  const { togglePreviewAsEditor } = useAppStore()
  const navigate = useNavigate()

  return (
    <div className="atmospheric min-h-screen flex">
      <div className="bg-grid fixed inset-0 pointer-events-none z-0" />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 bottom-0 z-20 flex flex-col overflow-hidden glass border-r border-white/[0.06]"
      >
        {/* Logo */}
        <div className="h-[52px] flex items-center px-4 border-b border-white/[0.06] flex-shrink-0">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-navy-950"
                  style={{ background: 'linear-gradient(135deg,#38bdf8,#9d8bff)' }}>SA</span>
                <span className="font-display text-sm font-semibold text-ink-primary truncate">Scolty Arena</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setCollapsed(p => !p)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink-primary hover:bg-white/5 transition-colors flex-shrink-0">
            {collapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? n.label : undefined}
            >
              <span className="flex-shrink-0">{n.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate text-sm"
                  >
                    {n.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User + back to owner */}
        <div className="p-3 border-t border-white/[0.06] space-y-2 flex-shrink-0">
          <button
            onClick={() => { togglePreviewAsEditor(); navigate('/dashboard') }}
            className={`nav-item w-full text-left text-[11px] ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Voltar ao CRM' : undefined}
          >
            <ChevronLeft size={14} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">Voltar ao CRM</span>}
          </button>
          <div className={`flex items-center gap-2 px-2 py-1 ${collapsed ? 'justify-center' : ''}`}>
            <Avatar name={DEMO_EDITOR.name} color={DEMO_EDITOR.avatar_color} size={28} />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink-primary truncate">{DEMO_EDITOR.name}</p>
                <p className="text-[10px] text-ink-muted">{DEMO_EDITOR.total_xp} XP</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <main
        className="flex-1 flex flex-col min-h-screen relative z-10 transition-all duration-200"
        style={{ marginLeft: collapsed ? 64 : 220 }}
      >
        <Outlet />
      </main>

      <XpToastProvider />
    </div>
  )
}
