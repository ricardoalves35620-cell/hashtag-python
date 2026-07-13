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
import { initialSyncState, SYNC_EVENT, type SyncSnapshot } from '../lib/syncStatus'

export type Theme = 'dark' | 'light' | 'system'
export type EditorHeightMode = 'auto' | 'compact'
export type EditorWrapMode = 'wrap' | 'scroll'
export type EditorFontSize = 14 | 16 | 18 | 20 | 22

interface AppContextType {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  editorHeightMode: EditorHeightMode
  setEditorHeightMode: (mode: EditorHeightMode) => void
  editorWrapMode: EditorWrapMode
  setEditorWrapMode: (mode: EditorWrapMode) => void
  editorFontSize: EditorFontSize
  setEditorFontSize: (size: EditorFontSize) => void
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
  syncSnapshot: SyncSnapshot
  syncNow: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)
const GUEST_ID = 'guest'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  root.setAttribute('data-theme', resolved)
  root.style.colorScheme = resolved

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (themeColor) themeColor.content = resolved === 'dark' ? '#090914' : '#f7f6fb'
}

function getDisplayName(u: User | null): string {
  if (!u) return 'Student'
  return u.user_metadata?.display_name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Student'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('hp_lang') as Lang) || 'en')
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('hp_theme') as Theme) || 'dark')
  const [editorHeightMode, setEditorHeightModeState] = useState<EditorHeightMode>(() =>
    (localStorage.getItem('hp_editor_height') as EditorHeightMode) || 'auto'
  )
  const [editorWrapMode, setEditorWrapModeState] = useState<EditorWrapMode>(() =>
    (localStorage.getItem('hp_editor_wrap') as EditorWrapMode) ||
    (window.matchMedia('(max-width: 767px)').matches ? 'wrap' : 'scroll')
  )
  const [editorFontSize, setEditorFontSizeState] = useState<EditorFontSize>(() => {
    const saved = Number(localStorage.getItem('hp_editor_font_size'))
    return ([14, 16, 18, 20, 22] as const).includes(saved as EditorFontSize) ? saved as EditorFontSize : 16
  })
  const [user, setUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('hp_guest_mode') === 'true')
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [accountDisplayName, setAccountDisplayName] = useState('Student')
  const [learningState, setLearningState] = useState<LearningState>(() => createEmptyLearningState())
  const [syncSnapshot, setSyncSnapshot] = useState<SyncSnapshot>(() => initialSyncState())
  const learnerId = user?.id || (isGuest ? GUEST_ID : null)
  const displayName = isGuest ? (lang === 'pt' ? 'Aluno visitante' : 'Guest student') : accountDisplayName

  const setLang = (value: Lang) => { setLangState(value); localStorage.setItem('hp_lang', value) }
  const setTheme = (value: Theme) => { setThemeState(value); localStorage.setItem('hp_theme', value); applyTheme(value) }

  const persistEditorPreference = useCallback((key: 'editor_height' | 'editor_wrap' | 'editor_font_size', value: string | number) => {
    if (!user) return
    void getSupabase().auth.updateUser({
      data: { [key]: value },
    }).catch(error => console.warn('Could not sync editor preference', error))
  }, [user])

  const setEditorHeightMode = useCallback((value: EditorHeightMode) => {
    setEditorHeightModeState(value)
    localStorage.setItem('hp_editor_height', value)
    persistEditorPreference('editor_height', value)
  }, [persistEditorPreference])

  const setEditorWrapMode = useCallback((value: EditorWrapMode) => {
    setEditorWrapModeState(value)
    localStorage.setItem('hp_editor_wrap', value)
    persistEditorPreference('editor_wrap', value)
  }, [persistEditorPreference])

  const setEditorFontSize = useCallback((value: EditorFontSize) => {
    setEditorFontSizeState(value)
    localStorage.setItem('hp_editor_font_size', String(value))
    persistEditorPreference('editor_font_size', value)
  }, [persistEditorPreference])

  const updateUserState = (nextUser: User | null) => {
    setUser(nextUser)
    setAvatarUrl(nextUser?.user_metadata?.avatar_url || null)
    setAccountDisplayName(getDisplayName(nextUser))

    const remoteHeight = nextUser?.user_metadata?.editor_height
    if (remoteHeight === 'auto' || remoteHeight === 'compact') {
      setEditorHeightModeState(remoteHeight)
      localStorage.setItem('hp_editor_height', remoteHeight)
    }

    const remoteWrap = nextUser?.user_metadata?.editor_wrap
    if (remoteWrap === 'wrap' || remoteWrap === 'scroll') {
      setEditorWrapModeState(remoteWrap)
      localStorage.setItem('hp_editor_wrap', remoteWrap)
    }

    const remoteFontSize = Number(nextUser?.user_metadata?.editor_font_size)
    if (([14, 16, 18, 20, 22] as const).includes(remoteFontSize as EditorFontSize)) {
      setEditorFontSizeState(remoteFontSize as EditorFontSize)
      localStorage.setItem('hp_editor_font_size', String(remoteFontSize))
    }
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


  useEffect(() => {
    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<SyncSnapshot>).detail
      if (detail) setSyncSnapshot(detail)
    }
    const handleOffline = () => setSyncSnapshot(current => ({ ...current, state: 'offline', message: lang === 'pt' ? 'Sem conexão. Alterações salvas neste aparelho.' : 'Offline. Changes are saved on this device.' }))
    const handleOnline = () => setSyncSnapshot(current => ({ ...current, state: 'pending', message: lang === 'pt' ? 'Conexão recuperada. Sincronizando...' : 'Connection restored. Syncing...' }))
    window.addEventListener(SYNC_EVENT, handleSync)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [lang])

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

  // Keep progress current across tabs and devices. Local state remains the fallback
  // when the network is unavailable, and the next refresh reconciles it with cloud.
  useEffect(() => {
    if (!user) return
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refreshProgress()
    }
    window.addEventListener('focus', refreshProgress)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    const channel = getSupabase()
      .channel(`progress-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${user.id}`,
      }, () => { refreshProgress() })
      .subscribe()

    return () => {
      window.removeEventListener('focus', refreshProgress)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      getSupabase().removeChannel(channel)
    }
  }, [user, refreshProgress])

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


  const syncNow = useCallback(async () => {
    if (!user) return
    setSyncSnapshot(current => ({ ...current, state: navigator.onLine ? 'syncing' : 'offline' }))
    if (!navigator.onLine) return
    try {
      await refreshProgress()
      const local = loadLearningState(user.id)
      const remote = await fetchRemoteLearningState(user.id)
      const chosen = chooseNewestLearningState(local, remote)
      saveLearningState(user.id, chosen)
      setLearningState(chosen)
      scheduleLearningStateSync(user.id, chosen)
    } catch (error) {
      setSyncSnapshot(current => ({ ...current, state: 'error', message: error instanceof Error ? error.message : 'Sync failed' }))
    }
  }, [user, refreshProgress])

  useEffect(() => {
    if (!user) return
    const retry = () => { if (navigator.onLine) void syncNow() }
    window.addEventListener('online', retry)
    window.addEventListener('focus', retry)
    return () => {
      window.removeEventListener('online', retry)
      window.removeEventListener('focus', retry)
    }
  }, [user, syncNow])

  const recordLearningAttempt = useCallback((attempt: LearningAttemptInput) => persistLearningState(state => applyLearningAttempt(state, attempt)), [persistLearningState])
  const recordLearningAttempts = useCallback((attempts: LearningAttemptInput[]) => persistLearningState(state => applyLearningAttempts(state, attempts)), [persistLearningState])
  const completeDiagnostic = useCallback(() => persistLearningState(state => markDiagnosticCompleteState(state)), [persistLearningState])

  return (
    <AppContext.Provider value={{
      lang, setLang, theme, setTheme, editorHeightMode, setEditorHeightMode, editorWrapMode, setEditorWrapMode, editorFontSize, setEditorFontSize,
      user, isGuest, learnerId, continueAsGuest, exitGuest,
      loading, progress, refreshProgress, refreshUser, displayName, avatarUrl, learningState,
      recordLearningAttempt, recordLearningAttempts, completeDiagnostic, refreshLearningState,
      syncSnapshot, syncNow,
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
