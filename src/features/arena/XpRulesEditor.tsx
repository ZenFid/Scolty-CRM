import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'

interface Rule { key: string; label: string; description: string; value: number; min: number; max: number }

const DEFAULT_RULES: Rule[] = [
  { key: 'on_time_xp',     label: 'Entrega no prazo',       description: 'XP por vídeo entregue até o deadline', value: 50, min: 10, max: 200 },
  { key: 'first_pass_xp',  label: 'Aprovação 1ª revisão',   description: 'Bônus por aprovação sem retrabalho',    value: 30, min: 0,  max: 100 },
  { key: 'early_xp',       label: 'Entrega antecipada',      description: 'Bônus por entregar antes do prazo',     value: 20, min: 0,  max: 100 },
  { key: 'late_penalty',   label: 'Penalidade por atraso',   description: 'XP perdido por atraso (valor positivo)',value: 25, min: 0,  max: 100 },
  { key: 'rework_penalty', label: 'Penalidade por retrabalho','description': 'XP perdido ao voltar de revisão',    value: 15, min: 0,  max: 80  },
]

const FORMAT_WEIGHTS_DEFAULT = { reel: 1.0, vsl: 1.5, ugc: 1.0, ad: 1.2 }

export default function XpRulesEditor() {
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES)
  const [weights, setWeights] = useState(FORMAT_WEIGHTS_DEFAULT)
  const [saved, setSaved] = useState(false)

  function updateRule(key: string, value: number) {
    setRules(p => p.map(r => r.key === key ? { ...r, value } : r))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="glass-card p-5 space-y-4">
        <h2 className="font-display text-sm font-semibold text-ink-primary">Regras de XP</h2>
        <p className="text-xs text-ink-muted">Configure como o XP é ganho ou perdido na esteira de produção.</p>

        <div className="space-y-4">
          {rules.map(rule => (
            <div key={rule.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-xs font-semibold text-ink-secondary">{rule.label}</p>
                  <p className="text-[10px] text-ink-muted">{rule.description}</p>
                </div>
                <span className="font-mono text-sm font-bold text-cyan-brand w-10 text-right">{rule.value}</span>
              </div>
              <input
                type="range"
                min={rule.min}
                max={rule.max}
                value={rule.value}
                onChange={e => updateRule(rule.key, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h2 className="font-display text-sm font-semibold text-ink-primary">Pesos por formato</h2>
        <p className="text-xs text-ink-muted">Multiplicador do XP base por formato de vídeo.</p>

        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(weights) as [keyof typeof FORMAT_WEIGHTS_DEFAULT, number][]).map(([fmt, w]) => (
            <div key={fmt}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-ink-secondary uppercase">{fmt}</span>
                <span className="font-mono text-sm font-bold text-violet-brand">×{w.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={w}
                onChange={e => setWeights(p => ({ ...p, [fmt]: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setRules(DEFAULT_RULES); setWeights(FORMAT_WEIGHTS_DEFAULT) }}
          className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium text-ink-secondary border border-white/10 hover:border-white/20 transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <RotateCcw size={13} /> Resetar
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#38bdf8,#22d3ee)' }}
        >
          <Save size={13} /> {saved ? 'Salvo!' : 'Salvar regras'}
        </button>
      </div>
    </div>
  )
}
