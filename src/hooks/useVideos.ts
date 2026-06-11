import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import { MOCK_VIDEOS_RICH } from '@/lib/mockData'
import type { Video, VideoStage } from '@/types'

export function useVideos() {
  const [videos, setVideos]   = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const channelName = useRef(`videos-rt-${Math.random()}`).current

  const fetch = useCallback(async () => {
    if (!SUPABASE_READY) {
      setVideos(MOCK_VIDEOS_RICH)
      setLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('videos')
        .select('*, client:clients(id,name,company), editor:editors(id,name,initials,avatar_color)')
        .order('created_at', { ascending: false })
      setVideos((data ?? []) as Video[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    if (!SUPABASE_READY) return
    const ch = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [fetch])

  const addVideo = useCallback(async (data: Omit<Video, 'id' | 'created_at' | 'client' | 'editor'>) => {
    if (!SUPABASE_READY) {
      const fake: Video = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      setVideos(p => [fake, ...p])
      return
    }
    await supabase.from('videos').insert(data)
  }, [])

  const moveVideo = useCallback(async (id: string, stage: VideoStage) => {
    setVideos(p => p.map(v => v.id === id ? { ...v, stage } : v))
    if (!SUPABASE_READY) return
    await supabase.from('videos').update({ stage }).eq('id', id)
  }, [])

  const deleteVideo = useCallback(async (id: string) => {
    setVideos(p => p.filter(v => v.id !== id))
    if (!SUPABASE_READY) return
    await supabase.from('videos').delete().eq('id', id)
  }, [])

  return { videos, loading, addVideo, moveVideo, deleteVideo, refetch: fetch }
}
