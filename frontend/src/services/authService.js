import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const SESSION_STORAGE_KEY = 'eira.session'

function readLocalSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeLocalSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function clearLocalSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

export const authService = {
  async getSession() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    }

    return readLocalSession()
  },

  async signInWithPassword({ email, password }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { session: data.session, user: data.user, usedFallback: false }
    }

    // Local fallback (until Supabase is configured)
    const session = {
      user: { email },
      createdAt: new Date().toISOString(),
      usedFallback: true,
    }
    writeLocalSession(session)
    return { session, user: session.user, usedFallback: true }
  },

  async signUp({ email, password, fullName }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: fullName ? { data: { full_name: fullName } } : undefined,
      })
      if (error) throw error
      return { session: data.session, user: data.user, usedFallback: false }
    }

    // Local fallback (until Supabase is configured)
    const session = {
      user: { email, fullName: fullName ?? null },
      createdAt: new Date().toISOString(),
      usedFallback: true,
    }
    writeLocalSession(session)
    return { session, user: session.user, usedFallback: true }
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return
    }

    // Local fallback (until Supabase is configured)
    clearLocalSession()
  },

  /**
   * Attempts to delete the user's account.
   *
   * Important: deleting a Supabase Auth user requires admin privileges (service role),
   * which should NOT run in the client. This method:
   * - prefers calling a Supabase Edge Function named "delete-account" (recommended)
   * - otherwise does best-effort deletion of app data (e.g. profiles row) and signs out.
   */
  async deleteAccount() {
    // Local fallback (until Supabase is configured)
    if (!isSupabaseConfigured || !supabase) {
      clearLocalSession()
      localStorage.setItem('eira.accountDeletedAt', new Date().toISOString())
      return { deletedAuthUser: false, usedFallback: true }
    }

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser()

    if (getUserError) throw getUserError
    if (!user) return { deletedAuthUser: false, usedFallback: false }

    // 1) Try a Supabase Edge Function (recommended approach)
    // Expects a deployed function named "delete-account" that uses the SERVICE_ROLE key
    // to call supabase.auth.admin.deleteUser(user.id).
    const { error: fnError } = await supabase.functions.invoke('delete-account', {
      body: { userId: user.id },
    })

    if (!fnError) {
      await supabase.auth.signOut()
      return { deletedAuthUser: true, usedFallback: false }
    }

    // 2) Best-effort app-data cleanup (won't remove the Auth user)
    // This assumes your `profiles` table primary key is the auth user id.
    await supabase.from('profiles').delete().eq('id', user.id)

    await supabase.auth.signOut()

    return {
      deletedAuthUser: false,
      usedFallback: false,
      reason:
        'No delete-account edge function available; deleted profile row (if permitted) and signed out.',
    }
  },
}
