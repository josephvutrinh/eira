import './App.css'

import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { AuthProvider, useAuth } from './auth/AuthContext'
import ProfilePage from './pages/ProfilePage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'

function LoadingScreen() {
  return <div className="min-h-screen bg-white" />
}

function HomeRedirect() {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return <Navigate to={session ? '/profile' : '/signup'} replace />
}

function RequireAuth({ children }) {
  const location = useLocation()
  const { session, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!session) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}

function RequireNoAuth({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (session) return <Navigate to="/profile" replace />

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route
        path="/signup"
        element={
          <RequireNoAuth>
            <SignUpPage />
          </RequireNoAuth>
        }
      />
      <Route
        path="/signin"
        element={
          <RequireNoAuth>
            <SignInPage />
          </RequireNoAuth>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
