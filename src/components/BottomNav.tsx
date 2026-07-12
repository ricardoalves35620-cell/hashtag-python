import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const icons = {
  course: <path d="M4 3.5h8a2 2 0 0 1 2 2v9H6a2 2 0 0 0-2 2v-13Zm0 0v13a2 2 0 0 1 2-2h8" />,
  paths: <><path d="m3 5 4-2 4 2 4-2v12l-4 2-4-2-4 2V5Z" /><path d="M7 3v12M11 5v12" /></>,
  fast: <path d="m10 2-5 8h4l-1 6 5-8H9l1-6Z" />,
  progress: <><path d="M3 15V9M8 15V5M13 15V2" /><path d="M2 16h14" /></>,
  profile: <><circle cx="9" cy="6" r="3" /><path d="M3.5 16a5.5 5.5 0 0 1 11 0" /></>,
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return <svg width="22" height="22" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
}

function routeIsActive(pathname: string, tabPath: string) {
  if (tabPath === '/') {
    return pathname === '/' || /^\/phase\/\d+$/.test(pathname) || /^\/(lesson|exercises|quiz|exam)\//.test(pathname)
  }
  return pathname === tabPath || pathname.startsWith(`${tabPath}/`)
}

export default function BottomNav({ hidden = false }: { hidden?: boolean }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useApp()
  const tabs = [
    { path: '/', label: lang === 'en' ? 'Course' : 'Curso', icon: icons.course },
    { path: '/roadmap', label: lang === 'en' ? 'Paths' : 'Trilhas', icon: icons.paths },
    { path: '/fasttrack', label: 'FastTrack', icon: icons.fast },
    { path: '/progress', label: lang === 'en' ? 'Progress' : 'Progresso', icon: icons.progress },
    { path: '/profile', label: lang === 'en' ? 'Profile' : 'Perfil', icon: icons.profile },
  ]

  return (
    <nav className={`hp-bottom-nav ${hidden ? 'hp-bottom-nav--hidden' : ''}`} aria-hidden={hidden || undefined} aria-label={lang === 'en' ? 'Main navigation' : 'Navegação principal'}>
      <div className="hp-bottom-nav__inner">
        {tabs.map(tab => {
          const isActive = routeIsActive(location.pathname, tab.path)
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`hp-bottom-nav__item ${isActive ? 'hp-bottom-nav__item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              title={tab.label}
            >
              <span className="hp-bottom-nav__icon"><NavIcon>{tab.icon}</NavIcon></span>
              <span className="hp-bottom-nav__label">{tab.label}</span>
              <span className="hp-bottom-nav__active-dot" aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
