import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

interface Props {
  children: React.ReactNode
  showBack?: boolean
  backTo?: string
  backLabel?: string
  title?: string
}

export default function Layout({ children, showBack, backTo = '/home', backLabel, title }: Props) {
  const { lang, setLang, displayName, avatarUrl } = useApp()
  const location = useLocation()
  const isHome = location.pathname === '/home'

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto" style={{ background: 'var(--c-bg)' }}>
      {/* Header with safe area */}
      <header className="safe-header sticky top-0 z-20 flex items-center gap-3" style={{ background: 'var(--c-header)', borderBottom: '0.5px solid var(--c-border)' }}>
        {showBack ? (
          <Link to={backTo} className="flex items-center gap-1 text-sm mr-1 flex-shrink-0" style={{ color: 'var(--c-purple-l)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {backLabel || (lang === 'en' ? 'Back' : 'Voltar')}
          </Link>
        ) : (
          <Link to="/home" className="font-mono text-lg font-medium tracking-tight flex-shrink-0" style={{ color: 'var(--c-purple-l)' }}>
            #Python
          </Link>
        )}

        {title && (
          <h1 className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--c-text)' }}>{title}</h1>
        )}

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {/* Language toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ background: 'var(--c-bg)', border: '0.5px solid var(--c-border)' }}>
            <button onClick={() => setLang('en')} className="px-2 py-1 text-xs transition-colors" style={{ background: lang === 'en' ? 'var(--c-purple-dm)' : 'transparent', color: lang === 'en' ? 'var(--c-purple-l)' : 'var(--c-muted)' }}>EN</button>
            <button onClick={() => setLang('pt')} className="px-2 py-1 text-xs transition-colors" style={{ background: lang === 'pt' ? 'var(--c-purple-dm)' : 'transparent', color: lang === 'pt' ? 'var(--c-purple-l)' : 'var(--c-muted)' }}>PT</button>
          </div>

          {isHome && (
            <Link to="/family" className="text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ background: 'var(--c-purple-dm)', color: 'var(--c-purple-l)' }}>
              {lang === 'en' ? 'Family' : 'Família'}
            </Link>
          )}

          {/* Avatar → profile page */}
          <Link to="/profile" className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 overflow-hidden" style={{ background: 'var(--c-purple-d)' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              displayName[0].toUpperCase()
            )}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
        <div className="safe-bottom" />
      </main>
    </div>
  )
}
