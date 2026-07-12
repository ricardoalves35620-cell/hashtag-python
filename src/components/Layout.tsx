import { useEffect } from 'react'
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
  const location = useLocation()
  const navigate = useNavigate()
  const showNav = !hideNav

  useEffect(() => {
    const scroller = document.getElementById('main-scroll')
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className={`hp-app-shell ${showNav ? 'hp-app-shell--with-nav' : ''}`}>
      <a className="hp-skip-link" href="#main-content">
        {lang === 'en' ? 'Skip to content' : 'Pular para o conteúdo'}
      </a>

      <header className="hp-app-header">
        <div className="hp-app-header__inner">
          <div className="hp-app-header__leading">
            {showBack ? (
              <Button
                onClick={() => navigate(backTo)}
                variant="ghost"
                size="sm"
                className="hp-back-button"
                leftIcon={(
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M12 4L7 10l5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              >
                {backLabel || (lang === 'en' ? 'Back' : 'Voltar')}
              </Button>
            ) : (
              <Link to="/" className="hp-brand-link" aria-label="Hashtag Python home">
                <span className="hp-brand-mark" aria-hidden="true">#</span>
                <span>Python</span>
              </Link>
            )}
          </div>

          {title ? <h1 className="hp-app-header__title" title={title}>{title}</h1> : <div className="hp-app-header__title-spacer" />}

          <div className="hp-app-header__actions">
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
          </div>
        </div>
      </header>

      <main
        className="hp-main"
        id="main-scroll"
        aria-label={lang === 'en' ? 'Learning content' : 'Conteúdo de aprendizagem'}
      >
        <div id="main-content" className="hp-main__content" tabIndex={-1}>
          {children}
        </div>
      </main>

      {showNav && <BottomNav />}
    </div>
  )
}
