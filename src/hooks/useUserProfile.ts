import { useState, useEffect, useCallback } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import type { UserRole } from '@/types'

export interface UserProfileData {
  id: string
  role: UserRole
  display_name: string | null
  workspace_name: string | null
  avatar_color: string
  onboarded: boolean
  created_at: string
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading]  = useState(true)

  useEffect(() => {
    if (!SUPABASE_READY) {
      setProfile({
        id: 'mock', role: 'owner',
        display_name: 'Daniel Fidyk',
        workspace_name: 'Scolty Agency',
        avatar_color: '#38bdf8',
        onboarded: true,
        created_at: new Date().toISOString(),
      })
      setLoading(false)
      return
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      supabase.from('user_profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setProfile(data as UserProfileData)
          } else {
            supabase.from('user_profiles')
              .insert({ id: user.id, role: 'owner', onboarded: false })
              .select().single()
              .then(({ data: p }) => setProfile(p as UserProfileData))
          }
        })
        .finally(() => setLoading(false))
    })
  }, [])

  const updateProfile = useCallback(async (fields: Partial<UserProfileData>) => {
    if (!SUPABASE_READY || !profile) return
    const { data } = await supabase
      .from('user_profiles')
      .update(fields)
      .eq('id', profile.id)
      .select().single()
    if (data) setProfile(data as UserProfileData)
  }, [profile])

  const role: UserRole = profile?.role ?? 'owner'

  return {
    profile,
    role,
    loading,
    isOwner: role === 'owner',
    isEditor: role === 'editor',
    onboarded: profile?.onboarded ?? false,
    updateProfile,
  }
}
