import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

interface Props {
  children: React.ReactNode
  showBack?: boolean
  backTo?: string
  backLabel?: string
  title?: string
  hideActions?: boolean
}

export default function Layout({ children, showBack, backTo = '/home', backLabel, title, hideActions }: Props) {
  const { lang, setLang, displayName, avatarUrl } = useApp()
  const location = useLocation()
  const isHome = location.pathname === '/home'

  return (
    <div className="flex flex-col max-w-lg mx-auto" style={{ minHeight: '100dvh', background: 'var(--c-bg)' }}>

      {/* ── Header with safe area ── */}
      <header
        className="sticky z-20 flex items-center gap-2"
        style={{
          top: 0,
          background: 'var(--c-header)',
          borderBottom: '0.5px solid var(--c-border)',
          // Safe area: pad top for Dynamic Island / notch, sides for rounded corners
          paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
          paddingBottom: '10px',
          paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
        }}
      >
        {/* Left: back or logo */}
        {showBack ? (
          <Link
            to={backTo}
            className="flex items-center gap-1 flex-shrink-0 rounded-lg px-2"
            style={{ color: 'var(--c-purple-l)', minHeight: 44, minWidth: 44 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm">{backLabel || (lang === 'en' ? 'Back' : 'Voltar')}</span>
          </Link>
        ) : (
          <Link
            to="/home"
            className="font-mono text-lg font-medium tracking-tight flex-shrink-0 px-1"
            style={{ color: 'var(--c-purple-l)', minHeight: 44, display: 'flex', alignItems: 'center' }}
          >
            #Python
          </Link>
        )}

        {/* Center: title */}
        {title && (
          <h1
            className="flex-1 text-sm font-medium truncate px-1"
            style={{ color: 'var(--c-text)' }}
          >
            {title}
          </h1>
        )}
        {!title && <div className="flex-1" />}

        {/* Right: actions */}
        {!hideActions && (
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Lang toggle — compact on small screens */}
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ background: 'var(--c-bg)', border: '0.5px solid var(--c-border)' }}
            >
              <button
                onClick={() => setLang('en')}
                className="px-2 text-xs font-medium transition-colors"
                style={{
                  background: lang === 'en' ? 'var(--c-purple-dm)' : 'transparent',
                  color: lang === 'en' ? 'var(--c-purple-l)' : 'var(--c-muted)',
                  minHeight: 36, minWidth: 36,
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLang('pt')}
                className="px-2 text-xs font-medium transition-colors"
                style={{
                  background: lang === 'pt' ? 'var(--c-purple-dm)' : 'transparent',
                  color: lang === 'pt' ? 'var(--c-purple-l)' : 'var(--c-muted)',
                  minHeight: 36, minWidth: 36,
                }}
              >
                PT
              </button>
            </div>

            {/* Family — only on home, hidden on very small screens */}
            {isHome && (
              <Link
                to="/family"
                className="hidden sm:flex text-xs px-2 rounded-lg items-center"
                style={{
                  background: 'var(--c-purple-dm)',
                  color: 'var(--c-purple-l)',
                  minHeight: 36,
                }}
              >
                {lang === 'en' ? 'Family' : 'Família'}
              </Link>
            )}

            {/* Avatar → profile */}
            <Link
              to="/profile"
              className="rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
              style={{
                width: 36, height: 36,
                background: 'var(--c-purple-d)',
                minHeight: 36, minWidth: 36,
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                displayName[0]?.toUpperCase() || '?'
              )}
            </Link>
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        {children}
        {/* Safe area bottom padding */}
        <div style={{ height: 'max(env(safe-area-inset-bottom, 0px), 16px)' }} />
      </main>
    </div>
  )
}
