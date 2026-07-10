import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { fetchProgress } from '../lib/progress'
import type { Lang, UserProgress } from '../data/types'
import type { User } from '@supabase/supabase-js'

interface AppContextType {
  lang: Lang
  setLang: (l: Lang) => void
  user: User | null
  loading: boolean
  progress: UserProgress[]
  refreshProgress: () => Promise<void>
  displayName: string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('hp_lang') as Lang) || 'en'
  )
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress[]>([])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('hp_lang', l)
  }

  const refreshProgress = useCallback(async () => {
    if (!user) return
    try {
      const p = await fetchProgress(user.id)
      setProgress(p)
    } catch (e) {
      console.error('Failed to fetch progress', e)
    }
  }, [user])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) refreshProgress()
  }, [user, refreshProgress])

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student'

  return (
    <AppContext.Provider value={{ lang, setLang, user, loading, progress, refreshProgress, displayName }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
