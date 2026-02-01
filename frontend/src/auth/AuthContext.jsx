/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    authService
      .getSession()
      .then((s) => {
        if (!alive) return
        setSession(s)
      })
      .catch(() => {
        // If session lookup fails, keep user signed out.
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(() => {
    return { session, setSession, loading }
  }, [loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider />')
  return ctx
}
