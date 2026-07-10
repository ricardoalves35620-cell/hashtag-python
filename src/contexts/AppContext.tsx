import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { fetchProgress } from '../lib/progress'
import type { Lang, UserProgress } from '../data/types'
import type { User } from '@supabase/supabase-js'

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
  displayName: string
  avatarUrl: string | null
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('hp_lang') as Lang) || 'en'
  )
  const [theme, setThemeState] = useState<Theme>(() =>
    (localStorage.getItem('hp_theme') as Theme) || 'dark'
  )
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('hp_lang', l) }

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('hp_theme', t)
    applyTheme(t)
  }

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
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const meta = u.user_metadata
        setAvatarUrl(meta?.avatar_url || null)
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) setAvatarUrl(u.user_metadata?.avatar_url || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) refreshProgress() }, [user, refreshProgress])

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student'

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, user, loading, progress, refreshProgress, displayName, avatarUrl }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
