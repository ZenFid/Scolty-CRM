import { useState, useEffect } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import { MOCK_EDITORS } from '@/lib/mockData'
import type { Editor } from '@/types'

export function useEditors() {
  const [editors, setEditors] = useState<Editor[]>([])

  useEffect(() => {
    if (!SUPABASE_READY) { setEditors(MOCK_EDITORS); return }
    supabase.from('editors').select('*').then(({ data }) => setEditors(data ?? []))
  }, [])

  return { editors }
}
