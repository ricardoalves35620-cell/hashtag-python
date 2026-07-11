import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { getSupabase } from '../lib/supabase'
import { fetchProgress, migrateGuestProgress } from '../lib/progress'
import type { Lang, UserProgress } from '../data/types'
import type { User } from '@supabase/supabase-js'
import {
  applyLearningAttempt, applyLearningAttempts, createEmptyLearningState, loadLearningState,
  markDiagnosticComplete as markDiagnosticCompleteState, saveLearningState,
  mergeLearningStates, type LearningAttemptInput, type LearningState,
} from '../lib/learningEngine'
import { migrateGuestBaseZeroState } from '../lib/baseZero'
import { chooseNewestLearningState, fetchRemoteLearningState, scheduleLearningStateSync } from '../lib/learningSync'

export type Theme = 'dark' | 'light' | 'system'

interface AppContextType {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  user: User | null
  isGuest: boolean
  learnerId: string | null
  continueAsGuest: () => void
  exitGuest: () => void
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
const GUEST_ID = 'guest'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else root.setAttribute('data-theme', theme)
}

function getDisplayName(u: User | null): string {
  if (!u) return 'Student'
  return u.user_metadata?.display_name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Student'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('hp_lang') as Lang) || 'en')
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('hp_theme') as Theme) || 'dark')
  const [user, setUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('hp_guest_mode') === 'true')
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [accountDisplayName, setAccountDisplayName] = useState('Student')
  const [learningState, setLearningState] = useState<LearningState>(() => createEmptyLearningState())
  const learnerId = user?.id || (isGuest ? GUEST_ID : null)
  const displayName = isGuest ? (lang === 'pt' ? 'Aluno visitante' : 'Guest student') : accountDisplayName

  const setLang = (value: Lang) => { setLangState(value); localStorage.setItem('hp_lang', value) }
  const setTheme = (value: Theme) => { setThemeState(value); localStorage.setItem('hp_theme', value); applyTheme(value) }

  const updateUserState = (nextUser: User | null) => {
    setUser(nextUser)
    setAvatarUrl(nextUser?.user_metadata?.avatar_url || null)
    setAccountDisplayName(getDisplayName(nextUser))
    if (nextUser) {
      if (localStorage.getItem('hp_guest_mode') === 'true' || localStorage.getItem('hp_guest_transfer_pending') === 'true') {
        localStorage.setItem('hp_guest_migrate_to', nextUser.id)
        localStorage.removeItem('hp_guest_transfer_pending')
      }
      setIsGuest(false)
      localStorage.removeItem('hp_guest_mode')
    }
  }

  const continueAsGuest = useCallback(() => {
    localStorage.setItem('hp_guest_mode', 'true')
    setIsGuest(true)
  }, [])

  const exitGuest = useCallback(() => {
    localStorage.removeItem('hp_guest_mode')
    setIsGuest(false)
    setProgress([])
    setLearningState(createEmptyLearningState())
  }, [])

  const refreshUser = useCallback(async () => {
    const { data } = await getSupabase().auth.getUser()
    if (data.user) updateUserState(data.user)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const refreshProgress = useCallback(async () => {
    if (!learnerId) { setProgress([]); return }
    try { setProgress(await fetchProgress(learnerId)) } catch (error) { console.error(error) }
  }, [learnerId])

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => {
      updateUserState(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => updateUserState(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (learnerId) refreshProgress(); else setProgress([]) }, [learnerId, refreshProgress])

  useEffect(() => {
    if (!user || localStorage.getItem('hp_guest_migrate_to') !== user.id) return
    const migrate = async () => {
      await migrateGuestProgress(user.id)
      migrateGuestBaseZeroState(user.id)
      const accountState = loadLearningState(user.id)
      const guestState = loadLearningState(GUEST_ID)
      const merged = mergeLearningStates(accountState, guestState)
      saveLearningState(user.id, merged)
      scheduleLearningStateSync(user.id, merged)
      localStorage.removeItem('hp_guest_migrate_to')
      await refreshProgress()
      setLearningState(merged)
    }
    migrate()
  }, [user, refreshProgress])

  const refreshLearningState = useCallback(() => {
    if (!learnerId) { setLearningState(createEmptyLearningState()); return }
    const local = loadLearningState(learnerId)
    setLearningState(local)
    if (user) {
      fetchRemoteLearningState(user.id).then(remote => {
        const chosen = chooseNewestLearningState(local, remote)
        setLearningState(chosen)
        saveLearningState(user.id, chosen)
        if (chosen === local && (!remote || local.updatedAt > remote.updatedAt)) scheduleLearningStateSync(user.id, local)
      })
    }
  }, [learnerId, user])

  useEffect(() => { refreshLearningState() }, [refreshLearningState])

  const persistLearningState = useCallback((updater: (state: LearningState) => LearningState) => {
    if (!learnerId) return
    setLearningState(previous => {
      const next = updater(previous)
      saveLearningState(learnerId, next)
      if (user) scheduleLearningStateSync(user.id, next)
      return next
    })
  }, [learnerId, user])

  const recordLearningAttempt = useCallback((attempt: LearningAttemptInput) => persistLearningState(state => applyLearningAttempt(state, attempt)), [persistLearningState])
  const recordLearningAttempts = useCallback((attempts: LearningAttemptInput[]) => persistLearningState(state => applyLearningAttempts(state, attempts)), [persistLearningState])
  const completeDiagnostic = useCallback(() => persistLearningState(state => markDiagnosticCompleteState(state)), [persistLearningState])

  return (
    <AppContext.Provider value={{
      lang, setLang, theme, setTheme, user, isGuest, learnerId, continueAsGuest, exitGuest,
      loading, progress, refreshProgress, refreshUser, displayName, avatarUrl, learningState,
      recordLearningAttempt, recordLearningAttempts, completeDiagnostic, refreshLearningState,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
