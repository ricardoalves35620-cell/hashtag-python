import { Link, useLocation, useNavigate } from 'react-router-dom'
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

export default function Layout({ children, showBack, backTo = '/', backLabel, title, hideNav }: Props) {
  const { lang, setLang } = useApp()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const showNav = !hideNav

  return (
    <div className="flex flex-col max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto" style={{ minHeight: '100dvh', background: 'var(--c-bg)' }}>

      {/* ── Header ── */}
      <header
        className="sticky z-20 flex items-center gap-2"
        style={{
          top: 0,
          background: 'var(--c-header)',
          borderBottom: '0.5px solid var(--c-border)',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
          paddingBottom: '10px',
          minHeight: '64px',
          paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
          paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
        }}
      >
        {/* Left: back button OR #Python home link */}
        {showBack ? (
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1 flex-shrink-0"
            style={{ color: 'var(--c-purple-l)', minHeight: 44, minWidth: 44, background: 'none', border: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L7 10l5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <span className="text-sm">{backLabel || (lang === 'en' ? 'Back' : 'Voltar')}</span>
          </button>
        ) : (
          <Link
            to="/"
            className="font-mono text-lg font-medium tracking-tight flex-shrink-0"
            style={{ color: 'var(--c-purple-l)', minHeight: 44, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            #Python
          </Link>
        )}

        {/* Title */}
        {title ? (
          <h1 className="flex-1 text-sm font-semibold truncate px-1" style={{ color: 'var(--c-text)' }}>{title}</h1>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right: lang toggle */}
        <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--c-bg)', border: '0.5px solid var(--c-border)' }}>
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
      </header>

      {/* ── Content ── */}
      <main
        className="flex-1 overflow-y-auto" id="main-scroll"
        style={{ paddingBottom: showNav ? 'calc(72px + max(env(safe-area-inset-bottom, 0px), 16px))' : 0 }}
      >
        {children}
      </main>

      {/* ── Bottom Nav ── */}
      {showNav && <BottomNav />}
    </div>
  )
}
