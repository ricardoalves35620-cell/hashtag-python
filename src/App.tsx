import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Family from './pages/Family'
import PhaseOverview from './pages/PhaseOverview'
import Lesson from './pages/Lesson'
import Exercises from './pages/Exercises'
import Quiz from './pages/Quiz'
import Exam from './pages/Exam'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useApp()
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="font-mono text-purple-light text-2xl animate-pulse">#Python</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { user, loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="font-mono text-purple-light text-2xl animate-pulse">#Python</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/family" element={<RequireAuth><Family /></RequireAuth>} />
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
