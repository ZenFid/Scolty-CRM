import { useState, useEffect } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import { MOCK_EDITORS, MOCK_XP_EVENTS } from '@/lib/mockData'
import type { Editor } from '@/types'

export interface LeaderboardEntry {
  editor: Editor
  xp: number
  rank: number
  delta: number  // vs previous period
}

function weekStart(offsetWeeks = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + 1 - offsetWeeks * 7)
  return d.toISOString().split('T')[0]
}

function monthStart(offsetMonths = 0): string {
  const d = new Date()
  d.setMonth(d.getMonth() - offsetMonths, 1)
  return d.toISOString().split('T')[0]
}

export function useLeaderboard(period: 'weekly' | 'monthly') {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!SUPABASE_READY) {
      // Mock: compute from MOCK_XP_EVENTS
      const start = period === 'weekly' ? weekStart() : monthStart()
      const prevStart = period === 'weekly' ? weekStart(1) : monthStart(1)
      const prevEnd   = start

      const sumXp = (after: string, before?: string) =>
        MOCK_EDITORS.reduce((acc, e) => {
          const xp = MOCK_XP_EVENTS
            .filter(ev => ev.editor_id === e.id && ev.created_at >= after && (!before || ev.created_at < before))
            .reduce((s, ev) => s + ev.xp_delta, 0)
          acc[e.id] = xp
          return acc
        }, {} as Record<string, number>)

      const current = sumXp(start)
      const prev    = sumXp(prevStart, prevEnd)

      const list: LeaderboardEntry[] = MOCK_EDITORS
        .map((e, i) => ({
          editor: e,
          xp: current[e.id] ?? 0,
          rank: 0,
          delta: (current[e.id] ?? 0) - (prev[e.id] ?? 0),
        }))
        .sort((a, b) => b.xp - a.xp)
        .map((e, i) => ({ ...e, rank: i + 1 }))

      setEntries(list)
      setLoading(false)
      return
    }

    const start = period === 'weekly' ? weekStart() : monthStart()
    supabase.from('xp_events')
      .select('editor_id, xp_delta')
      .gte('created_at', start)
      .then(async ({ data: xpData }) => {
        const { data: editorsData } = await supabase.from('editors').select('*')
        const editors = (editorsData ?? []) as Editor[]
        const xpMap: Record<string, number> = {}
        for (const ev of (xpData ?? [])) {
          xpMap[ev.editor_id] = (xpMap[ev.editor_id] ?? 0) + ev.xp_delta
        }
        const list: LeaderboardEntry[] = editors
          .map(e => ({ editor: e, xp: xpMap[e.id] ?? 0, rank: 0, delta: 0 }))
          .sort((a, b) => b.xp - a.xp)
          .map((e, i) => ({ ...e, rank: i + 1 }))
        setEntries(list)
      })
      .finally(() => setLoading(false))
  }, [period])

  return { entries, loading }
}
