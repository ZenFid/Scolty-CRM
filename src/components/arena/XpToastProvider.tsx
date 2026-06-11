import { AnimatePresence, motion } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Star, Trophy, Target } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { ToastKind } from '@/types'

const KIND_CONFIG: Record<ToastKind, { icon: React.ReactNode; color: string; bg: string }> = {
  xp:          { icon: <TrendingUp size={14} />,  color: '#38bdf8', bg: 'rgba(56,189,248,0.12)'  },
  levelup:     { icon: <Star size={14} />,         color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  achievement: { icon: <Trophy size={14} />,       color: '#9d8bff', bg: 'rgba(157,139,255,0.12)' },
  mission:     { icon: <Target size={14} />,       color: '#3ddc97', bg: 'rgba(61,220,151,0.12)'  },
  penalty:     { icon: <TrendingDown size={14} />, color: '#fb7185', bg: 'rgba(251,113,133,0.12)' },
}

export default function XpToastProvider() {
  const { toasts, dismissToast } = useAppStore()

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => {
          const cfg = KIND_CONFIG[t.kind]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0,  scale: 1   }}
              exit={{    opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl min-w-[220px] max-w-[300px]"
              style={{
                background: 'rgba(9,15,26,0.95)',
                border: `1px solid ${cfg.color}30`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink-primary truncate">{t.title}</p>
                {t.subtitle && <p className="text-[10px] text-ink-muted truncate">{t.subtitle}</p>}
                {t.xp !== undefined && (
                  <p className="text-[11px] font-mono font-bold mt-0.5" style={{ color: cfg.color }}>
                    {t.xp > 0 ? `+${t.xp}` : t.xp} XP
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="flex-shrink-0 text-ink-muted hover:text-ink-primary transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
