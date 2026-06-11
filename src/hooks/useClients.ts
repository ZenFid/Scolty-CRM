import { useState, useEffect, useCallback } from 'react'
import { supabase, SUPABASE_READY } from '@/lib/supabase'
import { MOCK_CLIENTS } from '@/lib/mockData'
import type { Client, ClientStatus } from '@/types'

export function useClients() {
  const [clients, setClients]   = useState<Client[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!SUPABASE_READY) {
      setClients(MOCK_CLIENTS)
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setClients(data ?? [])
    } catch (e) {
      setError((e as Error).message)
      setClients(MOCK_CLIENTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    if (!SUPABASE_READY) return
    const ch = supabase
      .channel('clients-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [fetch])

  const addClient = useCallback(async (data: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!SUPABASE_READY) {
      const fake: Client = { ...data, id: crypto.randomUUID(), user_id: 'mock', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      setClients(p => [fake, ...p])
      return fake
    }
    const { data: row, error } = await supabase.from('clients').insert(data).select().single()
    if (error) throw error
    return row as Client
  }, [])

  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    if (!SUPABASE_READY) {
      setClients(p => p.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
      return
    }
    const { error } = await supabase.from('clients').update(updates).eq('id', id)
    if (error) throw error
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    if (!window.confirm('Excluir este cliente?')) return
    if (!SUPABASE_READY) {
      setClients(p => p.filter(c => c.id !== id))
      return
    }
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) throw error
  }, [])

  const moveClient = useCallback(async (id: string, status: ClientStatus) => {
    setClients(p => p.map(c => c.id === id ? { ...c, status } : c))
    if (!SUPABASE_READY) return
    await supabase.from('clients').update({ status }).eq('id', id)
  }, [])

  return { clients, loading, error, addClient, updateClient, deleteClient, moveClient, refetch: fetch }
}
