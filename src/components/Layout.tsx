import { useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import BottomNav from './BottomNav'

interface Props {
  children: React.ReactNode
  showBack?: boolean
  backTo?: string
  backLabel?: string
  title?: string
  hideNav?: boolean
}

export default function Layout({ children, showBack, backTo = '/home', backLabel, title, hideNav }: Props) {
  const { lang, setLang, displayName, avatarUrl } = useApp()
  const { pathname } = useLocation()

  // Pages that show the bottom nav
  const showNav = !hideNav && ['/home', '/fasttrack', '/family', '/profile'].some(p =>
    pathname === p || (p !== '/home' && pathname.startsWith(p + '/'))
  ) || pathname.startsWith('/phase') || pathname.startsWith('/fasttrack')

  return (
    <div className="flex flex-col max-w-lg mx-auto" style={{ minHeight: '100dvh', background: 'var(--c-bg)' }}>

      {/* ── Header with proper safe area ── */}
      <header
        className="sticky z-20 flex items-center gap-2"
        style={{
          top: 0,
          background: 'var(--c-header)',
          borderBottom: '0.5px solid var(--c-border)',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
          paddingBottom: '10px',
          paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
        }}
      >
        {/* Left */}
        {showBack ? (
          <a
            href={backTo}
            onClick={e => { e.preventDefault(); window.history.back() }}
            className="flex items-center gap-1 flex-shrink-0 rounded-lg"
            style={{ color: 'var(--c-purple-l)', minHeight: 44, minWidth: 44, textDecoration: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L7 10l5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <span className="text-sm">{backLabel || (lang === 'en' ? 'Back' : 'Voltar')}</span>
          </a>
        ) : (
          <span className="font-mono text-lg font-medium tracking-tight flex-shrink-0 px-1" style={{ color: 'var(--c-purple-l)' }}>
            #Python
          </span>
        )}

        {/* Title */}
        {title ? (
          <h1 className="flex-1 text-sm font-medium truncate px-1" style={{ color: 'var(--c-text)' }}>{title}</h1>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right: lang toggle only — nav moved to bottom */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex rounded-lg overflow-hidden" style={{ background: 'var(--c-bg)', border: '0.5px solid var(--c-border)' }}>
            {(['en', 'pt'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? 'var(--c-purple-dm)' : 'transparent',
                  color: lang === l ? 'var(--c-purple-l)' : 'var(--c-muted)',
                  minHeight: 36, minWidth: 36,
                  fontSize: 12, fontWeight: lang === l ? 500 : 400,
                  border: 'none', padding: '0 8px',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: showNav ? 'calc(52px + max(env(safe-area-inset-bottom, 0px), 8px))' : 0 }}
      >
        {children}
      </main>

      {/* ── Bottom Nav ── */}
      {showNav && <BottomNav />}
    </div>
  )
}
