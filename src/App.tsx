import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/hooks/useAuth'
import { SUPABASE_READY } from '@/lib/supabase'

// Layout
import AppShell from '@/components/layout/AppShell'
import XpToastProvider from '@/components/arena/XpToastProvider'
import AuthPage from '@/features/auth/AuthPage'
import OnboardingPage from '@/features/auth/OnboardingPage'

// Base CRM pages
import Dashboard   from '@/features/dashboard/Dashboard'
import Pipeline    from '@/features/pipeline/Pipeline'
import Clients     from '@/features/clients/Clients'
import Production  from '@/features/production/Production'
import Financial   from '@/features/financial/Financial'
import Database    from '@/features/database/Database'
import Settings    from '@/features/settings/Settings'

// Arena owner pages
import OwnerTeam     from '@/features/arena/OwnerTeam'
import XpRulesEditor from '@/features/arena/XpRulesEditor'

// Editor portal + pages
import EditorPortal      from '@/features/arena/EditorPortal'
import EditorDashboard   from '@/features/arena/EditorDashboard'
import EditorTasks       from '@/features/arena/EditorTasks'
import EditorAchievements from '@/features/arena/EditorAchievements'
import Leaderboard       from '@/features/arena/Leaderboard'
import EditorEarnings    from '@/features/arena/EditorEarnings'
import AiCoach           from '@/features/arena/AiCoach'

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function AppRoutes() {
  const { togglePalette, previewAsEditor } = useAppStore()
  const { role, loading }                  = useUserProfile()
  const isEditor = previewAsEditor || role === 'editor'

  // Global ⌘K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        togglePalette()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePalette])

  if (loading) return (
    <div className="atmospheric min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" />
    </div>
  )

  // Editor portal routes
  if (isEditor) {
    return (
      <Routes>
        <Route path="/arena" element={<EditorPortal />}>
          <Route index element={<PageTransition><EditorDashboard /></PageTransition>} />
          <Route path="tarefas"   element={<PageTransition><EditorTasks /></PageTransition>} />
          <Route path="conquistas" element={<PageTransition><EditorAchievements /></PageTransition>} />
          <Route path="ranking"   element={<PageTransition><Leaderboard /></PageTransition>} />
          <Route path="ganhos"    element={<PageTransition><EditorEarnings /></PageTransition>} />
          <Route path="coach"     element={<PageTransition><AiCoach /></PageTransition>} />
        </Route>
        <Route path="*" element={<Navigate to="/arena" replace />} />
      </Routes>
    )
  }

  // Owner CRM routes
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="pipeline"     element={<PageTransition><Pipeline /></PageTransition>} />
        <Route path="clientes"     element={<PageTransition><Clients /></PageTransition>} />
        <Route path="producao"     element={<PageTransition><Production /></PageTransition>} />
        <Route path="financeiro"   element={<PageTransition><Financial /></PageTransition>} />
        <Route path="base-dados"   element={<PageTransition><Database /></PageTransition>} />
        <Route path="configuracoes" element={<PageTransition><Settings /></PageTransition>} />

        {/* Arena — owner management */}
        <Route path="arena/equipe"  element={<PageTransition><OwnerTeam /></PageTransition>} />
        <Route path="arena/regras"  element={<PageTransition><XpRulesEditor /></PageTransition>} />

        {/* Leaderboard accessible to owner */}
        <Route path="arena/ranking" element={<PageTransition><Leaderboard /></PageTransition>} />
      </Route>

      {/* Redirect editor-portal paths to owner view */}
      <Route path="/arena" element={<Navigate to="/arena/equipe" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading, user } = useAuth()
  const { onboarded, loading: profileLoading, updateProfile } = useUserProfile()

  if (!SUPABASE_READY) return <>{children}</>

  if (authLoading || profileLoading) return (
    <div className="atmospheric min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" />
    </div>
  )

  if (!session) return <AuthPage />

  if (!onboarded) return (
    <OnboardingPage
      userEmail={user?.email}
      onComplete={async (displayName, workspaceName) => {
        await updateProfile({ display_name: displayName, workspace_name: workspaceName, onboarded: true })
      }}
    />
  )

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <AppRoutes />
        <XpToastProvider />
      </AuthGate>
    </BrowserRouter>
  )
}
