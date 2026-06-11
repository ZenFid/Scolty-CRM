import { initials } from '@/lib/utils'

interface Props {
  name: string
  color?: string
  size?: number
  className?: string
}

export default function Avatar({ name, color = '#38bdf8', size = 32, className = '' }: Props) {
  const bg = color + '22'
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, color, fontSize: Math.round(size * 0.36) }}
    >
      {initials(name)}
    </div>
  )
}
