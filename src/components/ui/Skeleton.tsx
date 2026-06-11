import { cn } from '@/lib/utils'

interface Props { className?: string }

export function Skeleton({ className }: Props) {
  return (
    <div className={cn(
      'animate-pulse rounded bg-white/5',
      className
    )} />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-2 w-full" />
    </div>
  )
}

export function RowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-3 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}
