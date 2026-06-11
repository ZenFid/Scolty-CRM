import { create } from 'zustand'
import type { Client, XpToast, ToastKind } from '@/types'

interface AppStore {
  // Sidebar
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void

  // Client drawer
  drawerClient: Client | null
  isDrawerOpen: boolean
  openDrawer: (client: Client) => void
  closeDrawer: () => void

  // Add/edit modal
  modalClient: Client | null | 'new'
  openModal: (client?: Client | { presetStatus?: string }) => void
  closeModal: () => void

  // Command palette
  isPaletteOpen: boolean
  openPalette: () => void
  closePalette: () => void
  togglePalette: () => void

  // Arena: preview as editor (demo / preview mode)
  previewAsEditor: boolean
  togglePreviewAsEditor: () => void

  // XP Toasts
  toasts: XpToast[]
  pushToast: (kind: ToastKind, title: string, opts?: { subtitle?: string; xp?: number }) => void
  dismissToast: (id: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  drawerClient: null,
  isDrawerOpen: false,
  openDrawer: (client) => set({ drawerClient: client, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  modalClient: null,
  openModal: (client) => set({ modalClient: client === undefined ? 'new' : (client as Client | 'new') }),
  closeModal: () => set({ modalClient: null }),

  isPaletteOpen: false,
  openPalette: () => set({ isPaletteOpen: true }),
  closePalette: () => set({ isPaletteOpen: false }),
  togglePalette: () => set((s) => ({ isPaletteOpen: !s.isPaletteOpen })),

  previewAsEditor: false,
  togglePreviewAsEditor: () => set((s) => ({ previewAsEditor: !s.previewAsEditor })),

  toasts: [],
  pushToast: (kind, title, opts = {}) => {
    const toast: XpToast = { id: crypto.randomUUID(), kind, title, ...opts }
    set((s) => ({ toasts: [...s.toasts, toast] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter(t => t.id !== toast.id) }))
    }, 4000)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
