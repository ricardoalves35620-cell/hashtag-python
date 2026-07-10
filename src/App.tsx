import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Family from './pages/Family'
import Profile from './pages/Profile'
import PhaseOverview from './pages/PhaseOverview'
import Lesson from './pages/Lesson'
import Exercises from './pages/Exercises'
import Quiz from './pages/Quiz'
import Exam from './pages/Exam'
import ResetPassword from './pages/ResetPassword'
import FastTrackHome from './pages/FastTrackHome'
import FastTrackDay from './pages/FastTrackDay'

function Loader() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100dvh', background: 'var(--c-bg)' }}>
      <div className="font-mono text-2xl animate-pulse" style={{ color: 'var(--c-purple-l)' }}>#Python</div>
    </div>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useApp()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

function SmartHome() {
  const { user, loading } = useApp()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/" replace />
  // Show onboarding if first time
  const onboardingDone = user.user_metadata?.onboarding_done
  if (!onboardingDone) return <Onboarding />
  return <Home />
}

function AppRoutes() {
  const { user, loading } = useApp()
  if (loading) return <Loader />
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/home" element={<SmartHome />} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/family" element={<RequireAuth><Family /></RequireAuth>} />
      <Route path="/fasttrack" element={<RequireAuth><FastTrackHome /></RequireAuth>} />
      <Route path="/fasttrack/:id" element={<RequireAuth><FastTrackDay /></RequireAuth>} />
      <Route path="/phase/:id" element={<RequireAuth><PhaseOverview /></RequireAuth>} />
      <Route path="/phase/:id/lesson" element={<RequireAuth><Lesson /></RequireAuth>} />
      <Route path="/phase/:id/exercises" element={<RequireAuth><Exercises /></RequireAuth>} />
      <Route path="/phase/:id/quiz" element={<RequireAuth><Quiz /></RequireAuth>} />
      <Route path="/phase/:id/exam" element={<RequireAuth><Exam /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
