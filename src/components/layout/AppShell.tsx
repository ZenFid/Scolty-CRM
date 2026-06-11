import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ClientDrawer from '@/components/shared/ClientDrawer'
import ClientModal from '@/components/shared/ClientModal'
import CommandPalette from '@/components/shared/CommandPalette'

export default function AppShell() {
  const { sidebarCollapsed, isDrawerOpen, modalClient, isPaletteOpen } = useAppStore()
  const sideW = sidebarCollapsed ? 64 : 240

  return (
    <div className="atmospheric min-h-screen flex">
      {/* Grid overlay */}
      <div className="bg-grid fixed inset-0 pointer-events-none z-0" />

      <Sidebar />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-200 relative z-10"
        style={{ marginLeft: sideW }}
      >
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <AnimatePresence>{isDrawerOpen && <ClientDrawer />}</AnimatePresence>
      <AnimatePresence>{modalClient !== null && <ClientModal />}</AnimatePresence>
      <AnimatePresence>{isPaletteOpen && <CommandPalette />}</AnimatePresence>
    </div>
  )
}
