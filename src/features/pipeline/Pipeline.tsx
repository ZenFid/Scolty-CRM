import { useClients } from '@/hooks/useClients'
import { useAppStore } from '@/store/useAppStore'
import { STATUS_CONFIG, CLIENT_STATUSES } from '@/types'
import { fmtBRL } from '@/lib/utils'
import KanbanBoard, { type KanbanColumnDef } from '@/components/kanban/KanbanBoard'
import { ClientKanbanCard } from '@/components/kanban/KanbanCard'
import type { Client } from '@/types'

export default function Pipeline() {
  const { clients, moveClient, loading } = useClients()
  const { openDrawer } = useAppStore()

  const columns: KanbanColumnDef<Client>[] = CLIENT_STATUSES.map(status => {
    const items = clients.filter(c => c.status === status)
    const totalMRR = items.reduce((s, c) => s + c.value_monthly, 0)
    const cfg = STATUS_CONFIG[status]
    return {
      id: status,
      label: cfg.label,
      color: cfg.dot,
      items,
      total: totalMRR > 0 ? fmtBRL(totalMRR) : undefined,
      renderCard: (c) => (
        <ClientKanbanCard key={c.id} client={c} onClick={() => openDrawer(c)} />
      ),
    }
  })

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 rounded-full border-2 border-cyan-brand/30 border-t-cyan-brand animate-spin" />
    </div>
  )

  return (
    <div className="h-full overflow-hidden pt-4">
      <KanbanBoard
        columns={columns}
        onMove={(id, status) => moveClient(id, status as never)}
      />
    </div>
  )
}
