import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { useApp } from './contexts/AppContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Exercises from './pages/Exercises'
import Quiz from './pages/Quiz'
import Exam from './pages/Exam'
import Profile from './pages/Profile'
import Group from './pages/Group'
import PhaseOverview from './pages/PhaseOverview'
import FastTrackHome from './pages/FastTrackHome'
import FastTrackDay from './pages/FastTrackDay'

// Guard: redirect to /login if not authenticated
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useApp()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Guard: redirect to / if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useApp()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Private */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/phase/:phaseId" element={<PrivateRoute><PhaseOverview /></PrivateRoute>} />
          <Route path="/lesson/:phaseId" element={<PrivateRoute><Lesson /></PrivateRoute>} />
          <Route path="/exercises/:phaseId" element={<PrivateRoute><Exercises /></PrivateRoute>} />
          <Route path="/quiz/:phaseId" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/exam/:phaseId" element={<PrivateRoute><Exam /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/group" element={<PrivateRoute><Group /></PrivateRoute>} />
          <Route path="/fasttrack" element={<PrivateRoute><FastTrackHome /></PrivateRoute>} />
          <Route path="/fasttrack/:day" element={<PrivateRoute><FastTrackDay /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
