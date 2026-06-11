import { Users } from 'lucide-react'

interface Props {
  icon?: React.ReactNode
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export default function EmptyState({
  icon = <Users size={36} />,
  title = 'Nenhum item encontrado',
  subtitle = 'Comece adicionando o primeiro registro.',
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
      <div className="text-ink-muted/40">{icon}</div>
      <div>
        <p className="font-display text-base font-semibold text-ink-primary mb-1">{title}</p>
        <p className="text-sm text-ink-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
