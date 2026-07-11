import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useApp()

  const tabs = [
    { path: '/', label: lang === 'en' ? 'Course' : 'Curso', icon: '📚' },
    { path: '/roadmap', label: lang === 'en' ? 'Paths' : 'Trilhas', icon: '🗺️' },
    { path: '/fasttrack', label: 'FastTrack', icon: '⚡' },
    { path: '/progress', label: lang === 'en' ? 'Progress' : 'Progresso', icon: '📈' },
    { path: '/profile', label: lang === 'en' ? 'Profile' : 'Perfil', icon: '👤' },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        background: 'var(--c-card)',
        borderTop: '0.5px solid var(--c-border)',
        zIndex: 1000,
        height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path || 
                        (tab.path === '/' && location.pathname.split('/').length === 2 && !location.pathname.match(/^\/[a-z]/))
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '8px 0',
              color: isActive ? 'var(--c-purple)' : 'var(--c-muted)',
              fontSize: 10,
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
