import { useState, useEffect } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import { MOCK_EDITORS, MOCK_RANKS, MOCK_XP_EVENTS, MOCK_EDITOR_ACHIEVEMENTS, MOCK_ACHIEVEMENTS } from '@/lib/mockData'
import type { Editor, Rank, XpEvent, Achievement, EditorAchievement } from '@/types'

export function useArena(editorId?: string) {
  const [editor, setEditor]           = useState<Editor | null>(null)
  const [ranks, setRanks]             = useState<Rank[]>([])
  const [xpEvents, setXpEvents]       = useState<XpEvent[]>([])
  const [achievements, setAchievements]     = useState<Achievement[]>([])
  const [unlocked, setUnlocked]       = useState<EditorAchievement[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (!editorId) { setLoading(false); return }

    if (!SUPABASE_READY) {
      setEditor(MOCK_EDITORS.find(e => e.id === editorId) ?? null)
      setRanks(MOCK_RANKS)
      setXpEvents(MOCK_XP_EVENTS.filter(x => x.editor_id === editorId))
      setAchievements(MOCK_ACHIEVEMENTS)
      setUnlocked(MOCK_EDITOR_ACHIEVEMENTS.filter(ea => ea.editor_id === editorId).map(ea => ({
        ...ea,
        achievement: MOCK_ACHIEVEMENTS.find(a => a.id === ea.achievement_id),
      })))
      setLoading(false)
      return
    }

    Promise.all([
      supabase.from('editors').select('*').eq('id', editorId).single(),
      supabase.from('ranks').select('*').order('min_xp'),
      supabase.from('xp_events').select('*').eq('editor_id', editorId).order('created_at', { ascending: false }).limit(50),
      supabase.from('achievements').select('*').order('rarity'),
      supabase.from('editor_achievements').select('*, achievement:achievements(*)').eq('editor_id', editorId),
    ]).then(([e, r, xp, ach, ua]) => {
      if (e.data)   setEditor(e.data as Editor)
      if (r.data)   setRanks(r.data as Rank[])
      if (xp.data)  setXpEvents(xp.data as XpEvent[])
      if (ach.data) setAchievements(ach.data as Achievement[])
      if (ua.data)  setUnlocked(ua.data as EditorAchievement[])
    }).finally(() => setLoading(false))
  }, [editorId])

  // Derived: current rank and next rank
  const currentRank = editor ? [...ranks].sort((a, b) => b.min_xp - a.min_xp).find(r => r.min_xp <= (editor.total_xp ?? 0)) ?? ranks[0] : null
  const nextRank    = currentRank ? ranks.find(r => r.id === currentRank.id + 1) ?? null : null
  const xpToNext    = nextRank && editor ? nextRank.min_xp - (editor.total_xp ?? 0) : null
  const xpProgress  = currentRank && nextRank && editor
    ? ((editor.total_xp ?? 0) - currentRank.min_xp) / (nextRank.min_xp - currentRank.min_xp) * 100
    : 100

  const unlockedIds = new Set(unlocked.map(ea => ea.achievement_id))

  return {
    editor, ranks, xpEvents, achievements, unlocked,
    currentRank, nextRank, xpToNext, xpProgress, unlockedIds, loading,
  }
}

// All editors for leaderboard / owner view
export function useAllEditors() {
  const [editors, setEditors] = useState<Editor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!SUPABASE_READY) {
      setEditors(MOCK_EDITORS)
      setLoading(false)
      return
    }
    supabase.from('editors').select('*').order('total_xp', { ascending: false })
      .then(({ data }) => { if (data) setEditors(data as Editor[]) })
      .finally(() => setLoading(false))
  }, [])

  return { editors, loading }
}
