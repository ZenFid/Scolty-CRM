import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type Tab = 'magic' | 'password'

export default function AuthPage() {
  const { signIn, signUp, signInWithMagicLink } = useAuth()

  const [tab, setTab]           = useState<Tab>('magic')
  const [mode, setMode]         = useState<'login' | 'signup'>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [sent, setSent]         = useState(false)

  function reset() {
    setError(null)
    setSent(false)
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault()
    reset()
    setLoading(true)
    const err = await signInWithMagicLink(email)
    setLoading(false)
    if (err) {
      setError('Não foi possível enviar o link. Verifique o e-mail e tente novamente.')
    } else {
      setSent(true)
    }
  }

  async function handlePassword(e: FormEvent) {
    e.preventDefault()
    reset()
    setLoading(true)
    const err = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)
    setLoading(false)
    if (err) {
      setError(
        err.message.includes('Invalid login') ? 'E-mail ou senha incorretos.' :
        err.message.includes('already registered') ? 'Este e-mail já está cadastrado. Faça login.' :
        err.message
      )
    } else if (mode === 'signup') {
      setSent(true)
    }
  }

  return (
    <div className="atmospheric min-h-screen flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #9d8bff, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="glass-card w-full max-w-sm p-8 relative"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-navy-950 font-mono font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
          >
            SC
          </div>
          <div>
            <p className="font-display text-base font-semibold text-ink-primary leading-none">
              Scolty <span className="text-cyan-brand">CRM</span>
            </p>
            <p className="text-[10px] text-ink-muted mt-0.5">Plataforma para editores</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-6">
          {(['magic', 'password'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); reset() }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t
                  ? 'bg-cyan-brand/20 text-cyan-brand border border-cyan-brand/30'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              {t === 'magic' ? 'Link mágico' : 'Senha'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── MAGIC LINK ── */}
          {tab === 'magic' && (
            <motion.div key="magic"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
            >
              {sent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={22} className="text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-ink-primary">Link enviado!</p>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Verifique sua caixa de entrada em <span className="text-ink-secondary">{email}</span> e clique no link para entrar.
                  </p>
                  <button
                    onClick={() => { setSent(false); setEmail('') }}
                    className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink-secondary mx-auto transition-colors mt-2"
                  >
                    <ArrowLeft size={12} /> Usar outro e-mail
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-ink-primary mb-0.5">Entrar sem senha</p>
                    <p className="text-xs text-ink-muted mb-4">Enviaremos um link para o seu e-mail.</p>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="email" placeholder="seu@email.com" value={email}
                        onChange={e => setEmail(e.target.value)} required
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5
                          text-sm text-ink-primary placeholder-ink-muted
                          focus:outline-none focus:border-cyan-brand/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      <AlertCircle size={13} className="flex-shrink-0" /> {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-navy-950 transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Enviar link de acesso
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {/* ── EMAIL + SENHA ── */}
          {tab === 'password' && (
            <motion.div key="password"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              {sent ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 size={22} className="text-emerald-400 mx-auto" />
                  <p className="text-xs text-ink-muted">
                    Conta criada! Verifique seu e-mail para confirmar o cadastro.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePassword} className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-ink-primary mb-4">
                      {mode === 'login' ? 'Entrar com senha' : 'Criar conta'}
                    </p>
                    <div className="space-y-3">
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                          type="email" placeholder="E-mail" value={email}
                          onChange={e => setEmail(e.target.value)} required
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5
                            text-sm text-ink-primary placeholder-ink-muted
                            focus:outline-none focus:border-cyan-brand/50 focus:bg-white/[0.06] transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                          type={showPw ? 'text' : 'password'} placeholder="Senha" value={password}
                          onChange={e => setPassword(e.target.value)} required minLength={6}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-10 py-2.5
                            text-sm text-ink-primary placeholder-ink-muted
                            focus:outline-none focus:border-cyan-brand/50 focus:bg-white/[0.06] transition-all"
                        />
                        <button type="button" onClick={() => setShowPw(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary transition-colors">
                          {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      <AlertCircle size={13} className="flex-shrink-0" /> {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-navy-950 transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {mode === 'login' ? 'Entrar' : 'Criar conta'}
                  </button>

                  <p className="text-center text-xs text-ink-muted">
                    {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
                    <button type="button"
                      onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); reset() }}
                      className="text-cyan-brand hover:text-cyan-400 font-medium transition-colors"
                    >
                      {mode === 'login' ? 'Criar conta' : 'Fazer login'}
                    </button>
                  </p>
                </form>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  )
}
