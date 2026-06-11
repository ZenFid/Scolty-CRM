import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { Users, Zap, Eye } from 'lucide-react'

const TABS = [
  { id: 'geral',  label: 'Geral',        icon: <Zap size={14} /> },
  { id: 'equipe', label: 'Equipe & Arena', icon: <Users size={14} /> },
]

export default function Settings() {
  const [tab, setTab] = useState('geral')
  const { previewAsEditor, togglePreviewAsEditor } = useAppStore()
  const navigate = useNavigate()

  return (
    <div className="h-full overflow-y-auto p-5 max-w-2xl mx-auto space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl glass-sm w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-cyan-brand/15 text-cyan-brand' : 'text-ink-muted hover:text-ink-primary'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'geral' && (
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-display text-sm font-semibold text-ink-primary">Configurações gerais</h2>
          <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
            <div>
              <p className="text-sm text-ink-secondary">Modo de visualização</p>
              <p className="text-[11px] text-ink-muted mt-0.5">Alternar entre visão do dono e do editor</p>
            </div>
            <button
              onClick={togglePreviewAsEditor}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-all ${previewAsEditor ? 'border-violet-brand/30 text-violet-brand bg-violet-brand/10' : 'border-white/10 text-ink-muted hover:border-white/20'}`}
            >
              <Eye size={12} />
              {previewAsEditor ? 'Voltando para Owner' : 'Ver como Editor'}
            </button>
          </div>
          <p className="text-xs text-ink-muted italic">Mais configurações em breve.</p>
        </div>
      )}

      {tab === 'equipe' && (
        <div className="space-y-3">
          <div className="glass-card p-5">
            <h2 className="font-display text-sm font-semibold text-ink-primary mb-1">Equipe & Arena</h2>
            <p className="text-xs text-ink-muted mb-4">Gerencie a equipe de editores, configurações de XP e conquistas.</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/arena/equipe')}
                className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90 w-fit"
                style={{ background: 'linear-gradient(135deg,#38bdf8,#22d3ee)' }}
              >
                <Users size={14} /> Abrir painel da equipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
