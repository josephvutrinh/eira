import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const SESSION_KEY = 'eira_session_id'

export function getOrCreateSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing) return existing

    const created =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(16).slice(2)}`

    localStorage.setItem(SESSION_KEY, created)
    return created
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`
  }
}

export async function fetchChatMessages({ sessionId, limit = 50 }) {
  if (!isSupabaseConfigured) return { data: null, error: null }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(limit)

  return { data, error }
}

export async function insertChatMessage({ sessionId, role, text, createdAt }) {
  if (!isSupabaseConfigured) return { data: null, error: null }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      text,
      created_at: createdAt,
    })
    .select('*')
    .single()

  return { data, error }
}

export async function clearChatMessages({ sessionId }) {
  if (!isSupabaseConfigured) return { error: null }

  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('session_id', sessionId)

  return { error }
}
