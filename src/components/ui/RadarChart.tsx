import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import type { EditorRadar } from '@/types'

interface Props {
  data: EditorRadar
  size?: number
}

const LABELS: Record<keyof EditorRadar, string> = {
  velocidade:   'Velocidade',
  qualidade:    'Qualidade',
  pontualidade: 'Pontualidade',
  volume:       'Volume',
  consistencia: 'Consistência',
}

export default function RadarChart({ data, size = 220 }: Props) {
  const chartData = (Object.keys(LABELS) as (keyof EditorRadar)[]).map(k => ({
    attribute: LABELS[k],
    value: data[k],
  }))

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RechartsRadar cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="rgba(125,211,252,0.1)" />
        <PolarAngleAxis
          dataKey="attribute"
          tick={{ fill: '#62769b', fontSize: 10, fontFamily: 'Hanken Grotesk' }}
        />
        <Radar
          data={chartData}
          dataKey="value"
          name="Editor"
          stroke="#38bdf8"
          fill="#38bdf8"
          fillOpacity={0.18}
          strokeWidth={1.5}
          dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}

// Compute radar data from video history
export function computeRadar(
  videos: Array<{ stage: string; rework_count?: number; deadline?: string | null; delivered_at?: string | null; created_at: string }>,
  currentStreak: number,
): EditorRadar {
  const delivered = videos.filter(v => v.stage === 'delivered')
  if (delivered.length === 0) return { velocidade: 0, qualidade: 0, pontualidade: 0, volume: 0, consistencia: 0 }

  // Qualidade: % without rework
  const qualidade = Math.round((delivered.filter(v => (v.rework_count ?? 0) === 0).length / delivered.length) * 100)

  // Pontualidade: % delivered on time
  const pontualidade = Math.round(
    (delivered.filter(v => !v.deadline || (v.delivered_at && v.delivered_at.slice(0, 10) <= v.deadline)).length / delivered.length) * 100
  )

  // Velocidade: avg days before deadline (0-100 scale, 0 days = 50, 3+ days early = 100, 3+ days late = 0)
  const velScores = delivered
    .filter(v => v.deadline && v.delivered_at)
    .map(v => {
      const delta = (new Date(v.deadline!).getTime() - new Date(v.delivered_at!).getTime()) / 86400000
      return Math.max(0, Math.min(100, 50 + delta * 16.7))
    })
  const velocidade = velScores.length > 0 ? Math.round(velScores.reduce((a, b) => a + b, 0) / velScores.length) : 50

  // Volume: videos in last 30 days (normalized to 100 at 15+ videos)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const recent = delivered.filter(v => v.created_at >= thirtyDaysAgo).length
  const volume = Math.min(100, Math.round((recent / 15) * 100))

  // Consistência: streak-based (30+ streak = 100)
  const consistencia = Math.min(100, Math.round((currentStreak / 30) * 100))

  return { velocidade, qualidade, pontualidade, volume, consistencia }
}
