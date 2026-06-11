import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const SUPABASE_READY = Boolean(url && key && !url.includes('xxxx'))

export const supabase = SUPABASE_READY
  ? createClient(url!, key!)
  : createClient('https://placeholder.supabase.co', 'placeholder')
