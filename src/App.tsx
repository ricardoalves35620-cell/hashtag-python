import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import AppLoadingScreen from './components/AppLoadingScreen'
import { ToastProvider } from './components/ui'
import LearningRouteGuard from './components/LearningRouteGuard'

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
function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, isGuest, loading, progressReady, lang } = useApp()
  if (loading || ((user || isGuest) && !progressReady)) {
    return <AppLoadingScreen label={lang === 'pt' ? 'Preparando seu espaço de aprendizagem...' : 'Preparing your learning space...'} />
  }
  if (!user && !isGuest) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Redirect to / if already authenticated
function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isGuest, loading, lang } = useApp()
  if (loading) {
    return <AppLoadingScreen label={lang === 'pt' ? 'Preparando sua conta...' : 'Preparing your account...'} />
  }
  if (user || isGuest) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { lang } = useApp()

  return (
    <Suspense fallback={<AppLoadingScreen label={lang === 'pt' ? 'Carregando...' : 'Loading...'} />}>
      <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Home */}
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      {/* Legacy /home redirect */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* Phase flow — ALL use /phase/:id as base */}
      <Route path="/phase/:id" element={<PrivateRoute><LearningRouteGuard step="overview"><PhaseOverview /></LearningRouteGuard></PrivateRoute>} />
      <Route path="/phase/:id/lesson" element={<PrivateRoute><LearningRouteGuard step="lesson"><Lesson /></LearningRouteGuard></PrivateRoute>} />
      <Route path="/phase/:id/exercises" element={<PrivateRoute><LearningRouteGuard step="exercises"><Exercises /></LearningRouteGuard></PrivateRoute>} />
      <Route path="/phase/:id/quiz" element={<PrivateRoute><LearningRouteGuard step="quiz"><Quiz /></LearningRouteGuard></PrivateRoute>} />
      <Route path="/phase/:id/exam" element={<PrivateRoute><LearningRouteGuard step="exam"><Exam /></LearningRouteGuard></PrivateRoute>} />
      <Route path="/mini-project/:projectId" element={<PrivateRoute><LearningRouteGuard step="project"><MiniProject /></LearningRouteGuard></PrivateRoute>} />

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
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
