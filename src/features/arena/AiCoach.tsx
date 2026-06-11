import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, Sparkles } from 'lucide-react'
import { MOCK_EDITORS } from '@/lib/mockData'

const DEMO_EDITOR = MOCK_EDITORS[0]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: Date
}

const MOCK_RESPONSES: Record<string, string> = {
  default: `Oi ${DEMO_EDITOR.name.split(' ')[0]}! 👋 Sou seu AI Coach. Posso te ajudar com análise de performance, dicas para melhorar seu XP, ou checar suas próximas entregas. Como posso te ajudar hoje?`,
  prazo: `Você tem 3 vídeos com entrega nos próximos 2 dias:\n\n• **Reel Junho #1** — entrega em 2 dias\n• **VSL Curso Trader Pro** — entrega em 9 dias\n\nVocê está dentro do prazo em todos! Continue assim. 🔥\n\nDica: Entregar o "Reel Junho #1" hoje te daria o bônus de entrega antecipada (+20 XP)!`,
  xp: `Sua performance esta semana foi ótima! 📈\n\n**Ganhos de XP:**\n• Entrega no prazo: +55 XP\n• Aprovação 1ª revisão: +30 XP\n• **Total: +85 XP**\n\nVocê está a **360 XP** do próximo rank (Editor Pleno 💫). Com o ritmo atual, você chega em ~4 entregas!`,
  missão: `Suas missões de hoje:\n\n✅ **Entrega do Dia** — Concluída!\n⏳ **Zero Retrabalho** — 0/1 (tente aprovar seu próximo vídeo na 1ª revisão)\n⏳ **Reel Veloz** — 0/1 (você tem um Reel em edição — priorize!)\n\nFoco na missão "Reel Veloz" — entregando o Reel hoje você garante +35 XP de bônus!`,
}

function getMockResponse(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('prazo') || lower.includes('entrega') || lower.includes('deadline')) return MOCK_RESPONSES.prazo
  if (lower.includes('xp') || lower.includes('progresso') || lower.includes('rank')) return MOCK_RESPONSES.xp
  if (lower.includes('missão') || lower.includes('missao') || lower.includes('tarefa')) return MOCK_RESPONSES.missão
  return `Entendido! Estou analisando seus dados de performance...\n\nVocê tem **${DEMO_EDITOR.current_streak} entregas consecutivas no prazo** — excelente streak! 🔥\n\nAlguma área específica que você quer trabalhar? Posso ajudar com:\n• Análise de prazos\n• Estratégia para ganhar mais XP\n• Revisão de missões\n• Dicas de qualidade`
}

function renderMarkdown(text: string): React.ReactNode {
  return text.split('\n').map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return <span key={i} dangerouslySetInnerHTML={{ __html: formatted + (i < text.split('\n').length - 1 ? '<br/>' : '') }} />
  })
}

const SUGGESTIONS = [
  'Quais são meus próximos prazos?',
  'Como estou no XP esta semana?',
  'Quais missões tenho hoje?',
]

export default function AiCoach() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: MOCK_RESPONSES.default, ts: new Date() },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, ts: new Date() }
    setMessages(p => [...p, userMsg])
    setInput('')
    setLoading(true)

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 900))
    const reply: Message = { id: crypto.randomUUID(), role: 'assistant', content: getMockResponse(text), ts: new Date() }
    setMessages(p => [...p, reply])
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] flex-shrink-0"
        style={{ background: 'rgba(7,12,22,0.7)', backdropFilter: 'blur(12px)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#38bdf8,#9d8bff)' }}>
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-primary">AI Coach</p>
          <p className="text-[10px] text-ink-muted">Seu assistente de performance pessoal</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #3ddc97' }} />
          <span className="text-[10px] text-emerald-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#38bdf8,#9d8bff)' }}>
                <Bot size={13} className="text-white" />
              </div>
            )}
            <div
              className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
              style={m.role === 'user'
                ? { background: 'linear-gradient(135deg,#38bdf8,#22d3ee)', color: '#070c16', borderRadius: '16px 4px 16px 16px' }
                : { background: 'rgba(10,17,32,0.6)', border: '1px solid rgba(125,211,252,0.1)', color: '#9bafce', borderRadius: '4px 16px 16px 16px' }
              }
            >
              {renderMarkdown(m.content)}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#38bdf8,#9d8bff)' }}>
              <Bot size={13} className="text-white" />
            </div>
            <div className="px-3.5 py-3 rounded-2xl glass-sm flex gap-1" style={{ borderRadius: '4px 16px 16px 16px' }}>
              {[0,1,2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-ink-muted"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-ink-muted hover:border-cyan-brand/30 hover:text-cyan-brand transition-all whitespace-nowrap flex-shrink-0">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-sm">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Pergunte ao seu coach..."
            className="flex-1 bg-transparent text-sm text-ink-primary outline-none placeholder:text-ink-muted/50"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-40"
            style={{ background: input.trim() ? 'linear-gradient(135deg,#38bdf8,#22d3ee)' : 'rgba(255,255,255,0.06)' }}
          >
            <Send size={13} className={input.trim() ? 'text-navy-950' : 'text-ink-muted'} />
          </button>
        </div>
      </div>
    </div>
  )
}
