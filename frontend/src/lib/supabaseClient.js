import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidHttpUrl(value) {
  if (!value || typeof value !== 'string') return false
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const isSupabaseConfigured = Boolean(
  isValidHttpUrl(supabaseUrl) && supabaseAnonKey,
)

export const supabase = (() => {
  if (!isSupabaseConfigured) return null
  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (e) {
    // Don't crash the whole app if env vars are misconfigured.
    console.warn('Supabase is misconfigured; running without persistence.', e)
    return null
  }
})()
