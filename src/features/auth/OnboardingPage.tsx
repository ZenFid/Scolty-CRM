import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { User, Building2, Loader2, Sparkles } from 'lucide-react'

interface Props {
  onComplete: (displayName: string, workspaceName: string) => Promise<void>
  userEmail?: string
}

const AVATAR_COLORS = [
  '#38bdf8', '#9d8bff', '#3ddc97', '#fbbf24', '#fb7185',
  '#f97316', '#a3e635', '#22d3ee', '#e879f9', '#60a5fa',
]

export default function OnboardingPage({ onComplete, userEmail }: Props) {
  const [name, setName]           = useState('')
  const [workspace, setWorkspace] = useState('')
  const [color, setColor]         = useState('#38bdf8')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onComplete(name.trim(), workspace.trim())
    setLoading(false)
  }

  const initials = name.trim()
    ? name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="atmospheric min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #9d8bff, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass-card w-full max-w-md p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-navy-950 font-mono font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
          >
            SC
          </div>
          <div>
            <p className="font-display text-base font-semibold text-ink-primary leading-none">
              Scolty <span className="text-cyan-brand">CRM</span>
            </p>
          </div>
        </div>

        <div className="mb-7 mt-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={15} className="text-cyan-brand" />
            <h1 className="text-lg font-bold text-ink-primary">Boas-vindas!</h1>
          </div>
          <p className="text-xs text-ink-muted">
            Configure seu perfil para começar. Leva menos de 1 minuto.
            {userEmail && <span className="text-ink-secondary ml-1">({userEmail})</span>}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Avatar preview */}
          <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 transition-all"
              style={{ background: color }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-ink-muted mb-2 uppercase tracking-wider">Cor do avatar</p>
              <div className="flex gap-1.5 flex-wrap">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c} type="button"
                    onClick={() => setColor(c)}
                    className="w-5 h-5 rounded-full transition-all flex-shrink-0"
                    style={{
                      background: c,
                      outline: color === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                      opacity: color === c ? 1 : 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold mb-1.5 block">
              Seu nome
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text" placeholder="Ex: Daniel Fidyk" value={name}
                onChange={e => setName(e.target.value)} required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5
                  text-sm text-ink-primary placeholder-ink-muted
                  focus:outline-none focus:border-cyan-brand/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </div>

          {/* Workspace */}
          <div>
            <label className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold mb-1.5 block">
              Nome da sua agência / workspace
            </label>
            <div className="relative">
              <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text" placeholder="Ex: ZenFid Studio" value={workspace}
                onChange={e => setWorkspace(e.target.value)} required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5
                  text-sm text-ink-primary placeholder-ink-muted
                  focus:outline-none focus:border-cyan-brand/50 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading || !name.trim() || !workspace.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-navy-950 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Entrar no CRM
          </button>
        </form>
      </motion.div>
    </div>
  )
}
