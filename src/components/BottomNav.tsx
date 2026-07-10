import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function BottomNav() {
  const { lang } = useApp()
  const { pathname } = useLocation()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const items = [
    {
      to: '/home',
      active: isActive('/home') || isActive('/phase'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      ),
      label: { en: 'Course', pt: 'Curso' }
    },
    {
      to: '/fasttrack',
      active: isActive('/fasttrack'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      label: { en: 'FastTrack', pt: 'FastTrack' }
    },
    {
      to: '/family',
      active: isActive('/family'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="9" cy="7" r="3"/>
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
          <circle cx="19" cy="9" r="2"/>
          <path d="M23 21v-1.5a3 3 0 0 0-3-3h-1"/>
        </svg>
      ),
      label: { en: 'Family', pt: 'Família' }
    },
    {
      to: '/profile',
      active: isActive('/profile'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 21a8 8 0 0 1 16 0"/>
        </svg>
      ),
      label: { en: 'Profile', pt: 'Perfil' }
    }
  ]

  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-30 flex max-w-lg mx-auto"
      style={{
        background: 'var(--c-header)',
        borderTop: '0.5px solid var(--c-border)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      {items.map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => document.getElementById('main-scroll')?.scrollTo({ top: 0, behavior: 'instant' })}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
          style={{
            color: item.active ? 'var(--c-purple-l)' : 'var(--c-dimmer)',
            minHeight: 52,
            paddingTop: 8,
          }}
        >
          <div style={{ color: item.active ? 'var(--c-purple-l)' : 'var(--c-dimmer)' }}>
            {item.icon}
          </div>
          <span style={{ fontSize: 10, fontWeight: item.active ? 500 : 400 }}>
            {item.label[lang]}
          </span>
        </Link>
      ))}
    </nav>
  )
}
