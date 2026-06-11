import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useClients } from '@/hooks/useClients'
import { STATUS_CONFIG, CLIENT_STATUSES } from '@/types'
import type { Client, ClientStatus } from '@/types'

const ESTILO_OPTS = ['Dinâmico / rápido','Clean / minimalista','Cinematográfico','Reels / UGC','VSL / long-form','Motion graphics','Podcast / talking head']

const EMPTY: Omit<Client,'id'|'user_id'|'created_at'|'updated_at'> = {
  name: '', company: '', niche: '', status: 'nao_chamado',
  health_score: 50, value_monthly: 0, videos_per_month: 0,
  contact: '', edit_style: '', tags: [], since: null, briefing: '',
}

export default function ClientModal() {
  const { modalClient, closeModal } = useAppStore()
  const { addClient, updateClient } = useClients()
  const [form, setForm] = useState({ ...EMPTY })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = typeof modalClient === 'object' && modalClient !== null && 'id' in modalClient

  useEffect(() => {
    if (isEdit && modalClient) {
      const c = modalClient as Client
      setForm({ name: c.name, company: c.company ?? '', niche: c.niche ?? '', status: c.status, health_score: c.health_score, value_monthly: c.value_monthly, videos_per_month: c.videos_per_month, contact: c.contact ?? '', edit_style: c.edit_style ?? '', tags: c.tags ?? [], since: c.since, briefing: c.briefing ?? '' })
    } else {
      setForm({ ...EMPTY })
    }
  }, [modalClient])

  function set<K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (isEdit && modalClient) {
        await updateClient((modalClient as Client).id, { ...form, value_monthly: Number(form.value_monthly), videos_per_month: Number(form.videos_per_month) })
      } else {
        await addClient({ ...form, value_monthly: Number(form.value_monthly), videos_per_month: Number(form.videos_per_month) })
      }
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      />
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget) closeModal() }}
      >
        <motion.div
          className="w-full max-w-[520px] max-h-[85vh] flex flex-col rounded-xl shadow-2xl"
          style={{ background: 'rgba(9,15,26,0.95)', border: '1px solid rgba(125,211,252,0.12)', backdropFilter: 'blur(20px)' }}
          initial={{ scale: 0.96, y: 8 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={isEdit ? 'Editar cliente' : 'Novo cliente'}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0">
            <h2 className="font-display text-sm font-semibold text-ink-primary">{isEdit ? 'Editar cliente' : 'Novo cliente'}</h2>
            <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink-primary hover:bg-white/5 transition-colors"><X size={14} /></button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

            {/* Section: Identificação */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-ink-muted border-b border-white/[0.07] pb-2 mb-3">Identificação</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome *" className="col-span-2"><Input value={form.name} onChange={v => set('name', v)} placeholder="Nome do cliente" autoFocus /></Field>
                <Field label="Empresa"><Input value={form.company ?? ''} onChange={v => set('company', v)} placeholder="Empresa" /></Field>
                <Field label="Nicho"><Input value={form.niche ?? ''} onChange={v => set('niche', v)} placeholder="fitness, finanças..." /></Field>
                <Field label="Contato" className="col-span-2"><Input value={form.contact ?? ''} onChange={v => set('contact', v)} placeholder="@handle ou +55 11..." /></Field>
              </div>
            </section>

            {/* Section: Pipeline */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-ink-muted border-b border-white/[0.07] pb-2 mb-3">Pipeline</p>
              <div className="flex flex-wrap gap-2">
                {CLIENT_STATUSES.map(s => {
                  const cfg = STATUS_CONFIG[s]
                  const active = form.status === s
                  return (
                    <button key={s} onClick={() => set('status', s as ClientStatus)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-100 ${active ? cfg.className : 'border-white/[0.08] text-ink-muted hover:border-white/20'}`}>
                      {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />}
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Section: Financeiro */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-ink-muted border-b border-white/[0.07] pb-2 mb-3">Financeiro</p>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Valor/mês (R$)"><Input type="number" value={String(form.value_monthly)} onChange={v => set('value_monthly', Number(v))} placeholder="0" /></Field>
                <Field label="Vídeos/mês"><Input type="number" value={String(form.videos_per_month)} onChange={v => set('videos_per_month', Number(v))} placeholder="0" /></Field>
                <Field label="Health score"><Input type="number" value={String(form.health_score)} onChange={v => set('health_score', Math.min(100, Math.max(0, Number(v))))} placeholder="50" /></Field>
              </div>
            </section>

            {/* Section: Perfil criativo */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-ink-muted border-b border-white/[0.07] pb-2 mb-3">Perfil criativo</p>
              <div className="flex flex-col gap-3">
                <Field label="Estilo de edição">
                  <div className="flex flex-wrap gap-1.5">
                    {ESTILO_OPTS.map(opt => (
                      <button key={opt} onClick={() => set('edit_style', form.edit_style === opt ? '' : opt)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${form.edit_style === opt ? 'bg-violet-brand/15 text-violet-brand border-violet-brand/30' : 'border-white/[0.08] text-ink-muted hover:border-white/20'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Tags">
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-white/[0.08] min-h-[36px]"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}
                  >
                    {form.tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-brand/10 text-cyan-brand border border-cyan-brand/20">
                        {t}
                        <button onClick={() => set('tags', form.tags.filter(x => x !== t))} className="opacity-60 hover:opacity-100">×</button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                      placeholder={form.tags.length === 0 ? 'reels, ugc, vsl... (Enter)' : ''}
                      className="bg-transparent text-[12px] text-ink-primary outline-none min-w-[80px] flex-1"
                    />
                  </div>
                </Field>
                <Field label="Briefing / Preferências">
                  <textarea
                    value={form.briefing ?? ''}
                    onChange={e => set('briefing', e.target.value)}
                    placeholder="Estilo, referências, cores..."
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 text-sm text-ink-primary outline-none resize-none border border-white/[0.08] transition-colors focus:border-cyan-brand/40"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                </Field>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-5 py-4 border-t border-white/[0.07] flex-shrink-0">
            <button onClick={closeModal} className="flex-1 h-9 rounded-lg text-sm font-medium text-ink-secondary border border-white/[0.1] hover:border-white/20 transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving || !form.name.trim()}
              className="flex-1 h-9 rounded-lg text-sm font-semibold text-navy-950 transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #38bdf8, #22d3ee)' }}>
              {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Adicionar cliente'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-semibold uppercase tracking-[0.6px] text-ink-muted">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', autoFocus }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoFocus?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="h-9 rounded-lg px-3 text-sm text-ink-primary outline-none border border-white/[0.08] transition-colors focus:border-cyan-brand/40 placeholder:text-ink-muted/50"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    />
  )
}
