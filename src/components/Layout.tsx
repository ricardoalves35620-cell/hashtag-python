import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import BottomNav from './BottomNav'
import { Button } from './ui'

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
  useLocation()
  const navigate = useNavigate()
  const showNav = !hideNav

  return (
    <div className="flex min-h-[100dvh] flex-col max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-canvas">
      <header className="hp-app-header">
        {showBack ? (
          <Button
            onClick={() => navigate(backTo)}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 px-2"
            leftIcon={(
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12 4L7 10l5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          >
            {backLabel || (lang === 'en' ? 'Back' : 'Voltar')}
          </Button>
        ) : (
          <Link to="/" className="hp-brand-link">#Python</Link>
        )}

        {title ? <h1 className="hp-app-header__title">{title}</h1> : <div className="flex-1" />}

        <div className="hp-segmented" role="group" aria-label={lang === 'en' ? 'Language' : 'Idioma'}>
          {(['en', 'pt'] as const).map(language => (
            <button
              key={language}
              type="button"
              onClick={() => setLang(language)}
              className={`hp-segmented__item ${lang === language ? 'hp-segmented__item--active' : ''}`}
              aria-pressed={lang === language}
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main
        className="flex-1 overflow-y-auto"
        id="main-scroll"
        style={{ paddingBottom: showNav ? 'calc(72px + max(env(safe-area-inset-bottom, 0px), 16px))' : 0 }}
      >
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  )
}
