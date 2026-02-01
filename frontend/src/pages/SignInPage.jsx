import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { authService } from '../services/authService'
import { COLORS, FONT_FAMILY } from '../theme'

const INPUT_BASE =
  'w-full bg-transparent px-1 py-3 text-lg outline-none placeholder:text-black/40'

export default function SignInPage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError(null)

      const trimmedEmail = email.trim()
      if (!trimmedEmail) {
        setError('Please enter your email.')
        return
      }
      if (!password) {
        setError('Please enter your password.')
        return
      }

      setLoading(true)
      try {
        const result = await authService.signInWithPassword({
          email: trimmedEmail,
          password,
        })

        if (!result?.session) {
          setError('Signed in, but no session was returned.')
          return
        }

        setSession(result.session)
        navigate('/profile', { replace: true })
      } catch (err) {
        setError(err?.message ?? String(err))
      } finally {
        setLoading(false)
      }
    },
    [email, navigate, password, setSession]
  )

  return (
    <div
      className="flex min-h-screen flex-col bg-white"
      style={{ fontFamily: FONT_FAMILY }}
    >
      <header
        className="flex h-36 items-end px-6 pb-6"
        style={{ backgroundColor: COLORS.headerBg }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Welcome back
        </h1>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pb-16 pt-8">
        <div className="w-full max-w-sm">
          <p className="text-base text-black/70">Pick up where you left off.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="border-b border-black/20">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_BASE}
                placeholder="Email"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div className="border-b border-black/20">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_BASE}
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-red-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl px-8 py-5 text-2xl font-bold text-black shadow-sm ring-1 ring-black/10 disabled:opacity-60"
              style={{ backgroundColor: COLORS.signOutBg }}
            >
              {loading ? 'Working…' : 'Sign in'}
            </button>

            <p className="pt-2 text-center text-sm text-black/70">
              New here?{' '}
              <Link
                to="/signup"
                className="font-semibold underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
