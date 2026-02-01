import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { authService } from '../services/authService'
import { COLORS, FONT_FAMILY } from '../theme'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut()
      setSession(null)
      navigate('/signin', { replace: true })
      window.alert('Signed out.')
    } catch (err) {
      window.alert(`Sign out failed: ${err?.message ?? String(err)}`)
    }
  }, [navigate, setSession])

  const handleDeleteAccount = useCallback(async () => {
    const confirmed = window.confirm(
      'Delete your account? This cannot be undone.'
    )

    if (!confirmed) return

    try {
      const result = await authService.deleteAccount()

      if (result?.deletedAuthUser) {
        setSession(null)
        navigate('/signup', { replace: true })
        window.alert('Account deleted.')
        return
      }

      if (result?.usedFallback) {
        setSession(null)
        navigate('/signup', { replace: true })
        window.alert(
          'Supabase is not configured yet — cleared local session as a fallback.'
        )
        return
      }

      setSession(null)
      navigate('/signup', { replace: true })
      window.alert(
        'Signed out. To fully delete your Supabase Auth user, deploy a Supabase Edge Function named "delete-account".'
      )
    } catch (err) {
      window.alert(`Delete account failed: ${err?.message ?? String(err)}`)
    }
  }, [navigate, setSession])

  return (
    <div
      className="flex min-h-screen flex-col bg-white"
      style={{ fontFamily: FONT_FAMILY }}
    >
      <header
        className="flex h-36 items-end px-8 pb-8"
        style={{ backgroundColor: COLORS.headerBg }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="flex w-full max-w-sm flex-col items-center gap-10">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-2xl px-8 py-5 text-3xl font-bold text-black shadow-sm ring-1 ring-black/10"
            style={{ backgroundColor: COLORS.signOutBg }}
          >
            Sign out
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="w-full rounded-2xl px-8 py-5 text-3xl font-bold text-black shadow-sm ring-1 ring-black/10"
            style={{ backgroundColor: COLORS.deleteBg }}
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  )
}
