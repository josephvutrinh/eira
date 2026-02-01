import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { authService } from '../services/authService'
import { COLORS, FONT_FAMILY } from '../theme'

const INPUT_BASE =
  'w-full bg-transparent px-1 py-3 text-lg outline-none placeholder:text-black/40'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError(null)
      setNotice(null)

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
        const result = await authService.signUp({
          email: trimmedEmail,
          password,
          fullName: fullName.trim() || null,
        })

        if (!result?.session) {
          setNotice(
            'Account created. If email confirmation is enabled, check your inbox to finish signing in.'
          )
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
    [email, fullName, navigate, password, setSession]
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
          Create your space
        </h1>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pb-16 pt-8">
        <div className="w-full max-w-sm">
          <p className="text-base text-black/70">
            A calmer way to track how you feel — one day at a time.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="border-b border-black/20">
              <label className="sr-only" htmlFor="fullName">
                Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={INPUT_BASE}
                placeholder="Your name (optional)"
                autoComplete="name"
              />
            </div>

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
                autoComplete="new-password"
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-red-700">{error}</p>
            ) : null}
            {notice ? (
              <p className="text-sm font-medium text-black/70">{notice}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl px-8 py-5 text-2xl font-bold text-black shadow-sm ring-1 ring-black/10 disabled:opacity-60"
              style={{ backgroundColor: COLORS.signOutBg }}
            >
              {loading ? 'Working…' : 'Continue'}
            </button>

            <p className="pt-2 text-center text-sm text-black/70">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-semibold underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
