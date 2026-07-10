import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'

interface Props {
  children: React.ReactNode
  showBack?: boolean
  backTo?: string
  backLabel?: string
  title?: string
}

export default function Layout({ children, showBack, backTo = '/home', backLabel, title }: Props) {
  const { lang, setLang, displayName, user } = useApp()
  const location = useLocation()
  const isHome = location.pathname === '/home'

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-[#0d0d1f] border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        {showBack ? (
          <Link to={backTo} className="text-purple-light flex items-center gap-1 text-sm mr-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {backLabel || (lang === 'en' ? 'Back' : 'Voltar')}
          </Link>
        ) : (
          <Link to="/home" className="font-mono text-purple-light text-lg font-medium tracking-tight">
            #Python
          </Link>
        )}

        {title && (
          <h1 className="flex-1 text-sm font-medium text-white truncate">{title}</h1>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex bg-[#0a0a18] border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 text-xs transition-colors ${lang === 'en' ? 'bg-purple-dim text-purple-light' : 'text-muted hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('pt')}
              className={`px-2 py-1 text-xs transition-colors ${lang === 'pt' ? 'bg-purple-dim text-purple-light' : 'text-muted hover:text-white'}`}
            >
              PT
            </button>
          </div>

          {isHome && (
            <Link
              to="/family"
              className="text-xs bg-purple-dim text-purple-light px-3 py-1.5 rounded-lg hover:bg-[#3d2b79] transition-colors"
            >
              {lang === 'en' ? 'Family' : 'Família'}
            </Link>
          )}

          {user && (
            <button
              onClick={handleSignOut}
              className="w-8 h-8 rounded-full bg-purple-dark flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
              title={lang === 'en' ? 'Sign out' : 'Sair'}
            >
              {displayName[0].toUpperCase()}
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
