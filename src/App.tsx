import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import Login from './pages/Login'
import Home from './pages/Home'
import PhaseOverview from './pages/PhaseOverview'
import Lesson from './pages/Lesson'
import Exercises from './pages/Exercises'
import Quiz from './pages/Quiz'
import Exam from './pages/Exam'
import Profile from './pages/Profile'
import Group from './pages/Group'
import FastTrackHome from './pages/FastTrackHome'
import FastTrackDay from './pages/FastTrackDay'
import Roadmap from './pages/Roadmap'
import Onboarding from './pages/Onboarding'
import ResetPassword from './pages/ResetPassword'
import ConfigurationScreen from './components/ConfigurationScreen'
import AppLoadingScreen from './components/AppLoadingScreen'
import { ToastProvider } from './components/ui'
import LearningProgress from './pages/LearningProgress'
import Review from './pages/Review'
import Diagnostic from './pages/Diagnostic'
import BaseZero from './pages/BaseZero'
import Visualizer from './pages/Visualizer'
import ProjectLab from './pages/ProjectLab'
import EngineeringLab from './pages/EngineeringLab'
import AILab from './pages/AILab'
import CareerReadiness from './pages/CareerReadiness'
import MiniProject from './pages/MiniProject'
import { appConfiguration } from './lib/config'

// Redirect to /login if not authenticated
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading } = useApp()
  if (loading) return <AppLoadingScreen label="Loading your learning space..." />
  if (!user && !isGuest) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Redirect to / if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading } = useApp()
  if (loading) return <AppLoadingScreen label="Preparing your account..." />
  if (user || isGuest) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Home */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      {/* Legacy /home redirect */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* Phase flow — ALL use /phase/:id as base */}
      <Route path="/phase/:id" element={<PrivateRoute><PhaseOverview /></PrivateRoute>} />
      <Route path="/phase/:id/lesson" element={<PrivateRoute><Lesson /></PrivateRoute>} />
      <Route path="/phase/:id/exercises" element={<PrivateRoute><Exercises /></PrivateRoute>} />
      <Route path="/phase/:id/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
      <Route path="/phase/:id/exam" element={<PrivateRoute><Exam /></PrivateRoute>} />
      <Route path="/mini-project/:projectId" element={<PrivateRoute><MiniProject /></PrivateRoute>} />

      {/* Other pages */}
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/progress" element={<PrivateRoute><LearningProgress /></PrivateRoute>} />
      <Route path="/review" element={<PrivateRoute><Review /></PrivateRoute>} />
      <Route path="/diagnostic" element={<PrivateRoute><Diagnostic /></PrivateRoute>} />
      <Route path="/base-zero" element={<PrivateRoute><BaseZero /></PrivateRoute>} />
      <Route path="/visualizer" element={<PrivateRoute><Visualizer /></PrivateRoute>} />
      <Route path="/project-lab" element={<PrivateRoute><ProjectLab /></PrivateRoute>} />
      <Route path="/engineering-lab" element={<PrivateRoute><EngineeringLab /></PrivateRoute>} />
      <Route path="/ai-lab" element={<PrivateRoute><AILab /></PrivateRoute>} />
      <Route path="/career" element={<PrivateRoute><CareerReadiness /></PrivateRoute>} />
      <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
      <Route path="/group" element={<PrivateRoute><Group /></PrivateRoute>} />
      <Route path="/fasttrack" element={<PrivateRoute><FastTrackHome /></PrivateRoute>} />
      <Route path="/fasttrack/:id" element={<PrivateRoute><FastTrackDay /></PrivateRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  if (!appConfiguration.isConfigured) {
    return <ConfigurationScreen missing={appConfiguration.missing} />
  }

  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
