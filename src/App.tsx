import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import ConfigurationScreen from './components/ConfigurationScreen'
import AppLoadingScreen from './components/AppLoadingScreen'
import { ToastProvider } from './components/ui'
import { appConfiguration } from './lib/config'

/**
 * Routes load on demand.
 *
 * These were static imports, which put all 25 screens into one entry chunk — and
 * because Lesson/Exercises/Quiz/Exam pull in ALL_PHASES, it dragged the 900 KB
 * curriculum in with them. A learner opening the login screen was downloading the
 * entire 69-phase curriculum, every lab, and the CodeMirror editor before they
 * could type an email address. On the 3G connection this app is meant to support,
 * that is the difference between a usable app and a blank screen.
 *
 * AppLoadingScreen is deliberately NOT lazy: it is the Suspense fallback.
 */
const Login = lazy(() => import('./pages/Login'))
const Home = lazy(() => import('./pages/Home'))
const PhaseOverview = lazy(() => import('./pages/PhaseOverview'))
const Lesson = lazy(() => import('./pages/Lesson'))
const Exercises = lazy(() => import('./pages/Exercises'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Exam = lazy(() => import('./pages/Exam'))
const Profile = lazy(() => import('./pages/Profile'))
const Group = lazy(() => import('./pages/Group'))
const FastTrackHome = lazy(() => import('./pages/FastTrackHome'))
const FastTrackDay = lazy(() => import('./pages/FastTrackDay'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const LearningProgress = lazy(() => import('./pages/LearningProgress'))
const Review = lazy(() => import('./pages/Review'))
const Diagnostic = lazy(() => import('./pages/Diagnostic'))
const BaseZero = lazy(() => import('./pages/BaseZero'))
const Visualizer = lazy(() => import('./pages/Visualizer'))
const ProjectLab = lazy(() => import('./pages/ProjectLab'))
const EngineeringLab = lazy(() => import('./pages/EngineeringLab'))
const AILab = lazy(() => import('./pages/AILab'))
const CareerReadiness = lazy(() => import('./pages/CareerReadiness'))
const MiniProject = lazy(() => import('./pages/MiniProject'))
const Portfolio = lazy(() => import('./pages/Portfolio'))

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
      <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
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
          {/* One boundary around the router: every route chunk resolves through it,
              and the fallback matches the loading screen the auth guards already use,
              so a cold route feels identical to a session still resolving. */}
          <Suspense fallback={<AppLoadingScreen label="Loading..." />}>
            <AppRoutes />
          </Suspense>
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
