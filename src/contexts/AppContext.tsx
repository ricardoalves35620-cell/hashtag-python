import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { getSupabase } from '../lib/supabase'
import { fetchProgress } from '../lib/progress'
import type { Lang, UserProgress } from '../data/types'
import type { User } from '@supabase/supabase-js'
import {
  applyLearningAttempt, applyLearningAttempts, createEmptyLearningState, loadLearningState,
  markDiagnosticComplete as markDiagnosticCompleteState, saveLearningState,
  type LearningAttemptInput, type LearningState,
} from '../lib/learningEngine'

export type Theme = 'dark' | 'light' | 'system'

interface AppContextType {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  user: User | null
  loading: boolean
  progress: UserProgress[]
  refreshProgress: () => Promise<void>
  refreshUser: () => Promise<void>
  displayName: string
  avatarUrl: string | null
  learningState: LearningState
  recordLearningAttempt: (attempt: LearningAttemptInput) => void
  recordLearningAttempts: (attempts: LearningAttemptInput[]) => void
  completeDiagnostic: () => void
  refreshLearningState: () => void
}

const AppContext = createContext<AppContextType | null>(null)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

function getDisplayName(u: User | null): string {
  if (!u) return 'Student'
  return u.user_metadata?.display_name ||
         u.user_metadata?.full_name ||
         u.user_metadata?.name ||
         u.email?.split('@')[0] ||
         'Student'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('hp_lang') as Lang) || 'en')
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('hp_theme') as Theme) || 'dark')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('Student')
  const [learningState, setLearningState] = useState<LearningState>(() => createEmptyLearningState())

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('hp_lang', l) }

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('hp_theme', t)
    applyTheme(t)
  }

  const updateUserState = (u: User | null) => {
    setUser(u)
    setAvatarUrl(u?.user_metadata?.avatar_url || null)
    setDisplayName(getDisplayName(u))
  }

  // Refresh user data from Supabase (call after profile save)
  const refreshUser = useCallback(async () => {
    const { data } = await getSupabase().auth.getUser()
    if (data.user) updateUserState(data.user)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  const refreshProgress = useCallback(async () => {
    if (!user) return
    try {
      const p = await fetchProgress(user.id)
      setProgress(p)
    } catch (e) { console.error(e) }
  }, [user])

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => {
      updateUserState(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => {
      updateUserState(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) refreshProgress() }, [user, refreshProgress])

  const refreshLearningState = useCallback(() => {
    if (!user) {
      setLearningState(createEmptyLearningState())
      return
    }
    setLearningState(loadLearningState(user.id))
  }, [user])

  useEffect(() => { refreshLearningState() }, [refreshLearningState])

  const persistLearningState = useCallback((updater: (state: LearningState) => LearningState) => {
    if (!user) return
    setLearningState(previous => {
      const next = updater(previous)
      saveLearningState(user.id, next)
      return next
    })
  }, [user])

  const recordLearningAttempt = useCallback((attempt: LearningAttemptInput) => {
    persistLearningState(state => applyLearningAttempt(state, attempt))
  }, [persistLearningState])

  const recordLearningAttempts = useCallback((attempts: LearningAttemptInput[]) => {
    persistLearningState(state => applyLearningAttempts(state, attempts))
  }, [persistLearningState])

  const completeDiagnostic = useCallback(() => {
    persistLearningState(state => markDiagnosticCompleteState(state))
  }, [persistLearningState])

  return (
    <AppContext.Provider value={{
      lang, setLang, theme, setTheme, user, loading, progress, refreshProgress, refreshUser,
      displayName, avatarUrl, learningState, recordLearningAttempt, recordLearningAttempts,
      completeDiagnostic, refreshLearningState,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
