import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import { MOCK_MISSIONS, MOCK_MISSION_PROGRESS } from '@/lib/mockData'
import type { Mission, MissionProgress } from '@/types'

function getPeriodStart(scope: 'daily' | 'weekly'): string {
  if (scope === 'daily') return new Date().toISOString().split('T')[0]
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(new Date().setDate(diff)).toISOString().split('T')[0]
}

export function useMissions(editorId?: string) {
  const channelName = useRef(`mission-progress-rt-${Math.random()}`).current
  const [missions, setMissions]   = useState<Mission[]>([])
  const [progress, setProgress]   = useState<MissionProgress[]>([])
  const [loading, setLoading]     = useState(true)

  const fetch = useCallback(async () => {
    if (!editorId) { setLoading(false); return }

    if (!SUPABASE_READY) {
      setMissions(MOCK_MISSIONS)
      setProgress(MOCK_MISSION_PROGRESS.filter(p => p.editor_id === editorId))
      setLoading(false)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const weekStart = getPeriodStart('weekly')

    const [m, p] = await Promise.all([
      supabase.from('missions').select('*').eq('active', true),
      supabase.from('mission_progress')
        .select('*, mission:missions(*)')
        .eq('editor_id', editorId)
        .in('period_start', [today, weekStart]),
    ])
    if (m.data) setMissions(m.data as Mission[])
    if (p.data) setProgress(p.data as MissionProgress[])
    setLoading(false)
  }, [editorId])

  useEffect(() => {
    fetch()
    if (!SUPABASE_READY || !editorId) return
    const ch = supabase.channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mission_progress',
        filter: `editor_id=eq.${editorId}` }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [fetch, editorId])

  // Merge missions with their progress for current period
  const withProgress = missions.map(m => {
    const period = getPeriodStart(m.scope)
    const prog = progress.find(p => p.mission_id === m.id && p.period_start === period)
    return { mission: m, progress: prog?.progress ?? 0, completed: !!prog?.completed_at }
  })

  const daily  = withProgress.filter(x => x.mission.scope === 'daily')
  const weekly = withProgress.filter(x => x.mission.scope === 'weekly')
  const completedToday = daily.filter(x => x.completed).length

  return { daily, weekly, completedToday, loading, refetch: fetch }
}
