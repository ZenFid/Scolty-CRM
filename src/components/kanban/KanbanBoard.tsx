import {
  DndContext, PointerSensor, useSensor, useSensors,
  DragOverlay, closestCenter, type DragEndEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import KanbanColumn from './KanbanColumn'

export interface KanbanColumnDef<T> {
  id: string
  label: string
  color: string
  items: T[]
  total?: string
  renderCard: (item: T) => React.ReactNode
  renderOverlay?: (item: T) => React.ReactNode
}

interface Props<T extends { id: string }> {
  columns: KanbanColumnDef<T>[]
  onMove: (itemId: string, toColumnId: string) => void
}

export default function KanbanBoard<T extends { id: string }>({ columns, onMove }: Props<T>) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [activeId, setActiveId] = useState<string | null>(null)

  const allItems = columns.flatMap(c => c.items)
  const activeItem = activeId ? allItems.find(i => i.id === activeId) : null
  const activeColumn = activeId ? columns.find(c => c.items.some(i => i.id === activeId)) : null

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    setActiveId(null)
    if (!over) return
    const toColumnId = columns.find(c => c.id === over.id || c.items.some(i => i.id === over.id))?.id
    if (toColumnId && toColumnId !== columns.find(c => c.items.some(i => i.id === active.id))?.id) {
      onMove(String(active.id), toColumnId)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={e => setActiveId(String(e.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4 px-5">
        {columns.map(col => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            count={col.items.length}
            total={col.total}
          >
            {col.items.map(item => col.renderCard(item))}
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeItem && activeColumn?.renderOverlay
          ? activeColumn.renderOverlay(activeItem)
          : activeItem && activeColumn?.renderCard(activeItem)}
      </DragOverlay>
    </DndContext>
  )
}
