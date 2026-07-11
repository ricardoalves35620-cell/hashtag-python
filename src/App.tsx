import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Exercises from './pages/Exercises'
import Quiz from './pages/Quiz'
import Exam from './pages/Exam'
import Profile from './pages/Profile'
import Group from './pages/Group'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:phaseId" element={<Lesson />} />
            <Route path="/exercises/:phaseId" element={<Exercises />} />
            <Route path="/quiz/:phaseId" element={<Quiz />} />
            <Route path="/exam/:phaseId" element={<Exam />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/group" element={<Group />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
