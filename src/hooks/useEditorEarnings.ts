import { useState, useEffect, useCallback } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import { MOCK_EARNINGS } from '@/lib/mockData'
import type { EditorEarning } from '@/types'

export function useEditorEarnings(editorId?: string) {
  const [earnings, setEarnings] = useState<EditorEarning[]>([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    if (!editorId) { setLoading(false); return }

    if (!SUPABASE_READY) {
      setEarnings(MOCK_EARNINGS.filter(e => e.editor_id === editorId))
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('editor_earnings')
      .select('*')
      .eq('editor_id', editorId)
      .order('created_at', { ascending: false })
    if (data) setEarnings(data as EditorEarning[])
    setLoading(false)
  }, [editorId])

  useEffect(() => { fetch() }, [fetch])

  const pending = earnings.filter(e => e.status === 'a_receber').reduce((s, e) => s + e.amount, 0)
  const paid    = earnings.filter(e => e.status === 'pago').reduce((s, e) => s + e.amount, 0)
  const byPeriod = earnings.reduce((acc, e) => {
    acc[e.period] = (acc[e.period] ?? 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  return { earnings, pending, paid, byPeriod, loading, refetch: fetch }
}

// All earnings for owner view
export function useAllEarnings() {
  const [earnings, setEarnings] = useState<EditorEarning[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!SUPABASE_READY) {
      setEarnings(MOCK_EARNINGS)
      setLoading(false)
      return
    }
    supabase.from('editor_earnings').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setEarnings(data as EditorEarning[]) })
      .finally(() => setLoading(false))
  }, [])

  const markPaid = useCallback(async (id: string) => {
    if (!SUPABASE_READY) {
      setEarnings(p => p.map(e => e.id === id ? { ...e, status: 'pago', paid_at: new Date().toISOString() } : e))
      return
    }
    await supabase.from('editor_earnings').update({ status: 'pago', paid_at: new Date().toISOString() }).eq('id', id)
  }, [])

  return { earnings, loading, markPaid }
}
