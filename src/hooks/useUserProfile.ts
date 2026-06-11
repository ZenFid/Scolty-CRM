import { useState, useEffect } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import type { UserProfile, UserRole } from '@/types'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!SUPABASE_READY) {
      // Default to owner in mock mode
      setProfile({ id: 'mock', role: 'owner', created_at: new Date().toISOString() })
      setLoading(false)
      return
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase.from('user_profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) { setProfile(data as UserProfile) }
          else {
            // Auto-create owner profile for first user
            supabase.from('user_profiles').insert({ id: user.id, role: 'owner' })
              .select().single().then(({ data: p }) => setProfile(p as UserProfile))
          }
        })
        .finally(() => setLoading(false))
    })
  }, [])

  const role: UserRole = profile?.role ?? 'owner'

  return { profile, role, loading, isOwner: role === 'owner', isEditor: role === 'editor' }
}
