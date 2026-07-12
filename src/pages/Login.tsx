import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { Alert, Button, Card, Input } from '../components/ui'

type Mode = 'login' | 'register' | 'forgot'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z" />
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z" />
    </svg>
  )
}

export default function Login() {
  const { lang, setLang, continueAsGuest } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const t = {
    en: {
      title: 'Learn Python with a clear path', subtitle: 'Guided lessons, real coding and progress you can see', email: 'Email', password: 'Password', name: 'Your name',
      login: 'Sign in', register: 'Create account', forgot: 'Forgot password', forgotDesc: "Enter your email and we'll send you a reset link.", sendReset: 'Send reset link',
      resetSent: 'Check your email — reset link sent!', backToLogin: 'Back to sign in', switchToRegister: "Don't have an account? Sign up", switchToLogin: 'Already have an account? Sign in',
      forgotLink: 'Forgot your password?', orContinueWith: 'or continue with', google: 'Continue with Google', guest: 'Explore without an account', guestNote: 'Progress stays on this device until you create an account',
      footer: 'Learn at your own pace. Keep your progress private.'
    },
    pt: {
      title: 'Aprenda Python com um caminho claro', subtitle: 'Aulas guiadas, código real e progresso visível', email: 'Email', password: 'Senha', name: 'Seu nome',
      login: 'Entrar', register: 'Criar conta', forgot: 'Esqueci a senha', forgotDesc: 'Digite seu email e enviaremos um link para redefinir a senha.', sendReset: 'Enviar link',
      resetSent: 'Verifique seu email — link enviado!', backToLogin: 'Voltar para entrar', switchToRegister: 'Não tem conta? Cadastre-se', switchToLogin: 'Já tem conta? Entrar',
      forgotLink: 'Esqueceu a senha?', orContinueWith: 'ou continue com', google: 'Continuar com Google', guest: 'Explorar sem criar conta', guestNote: 'O progresso fica neste aparelho até você criar uma conta',
      footer: 'Aprenda no seu ritmo. Seu progresso continua privado.'
    },
  }[lang]

  const reset = () => { setError(''); setSuccess('') }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    reset()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error: authError } = await getSupabase().auth.signInWithPassword({ email, password })
        if (authError) throw authError
        navigate('/')
      } else if (mode === 'register') {
        const { error: authError } = await getSupabase().auth.signUp({ email, password, options: { data: { display_name: displayName } } })
        if (authError) throw authError
        navigate('/')
      } else {
        const { error: authError } = await getSupabase().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
        if (authError) throw authError
        setSuccess(t.resetSent)
      }
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error: authError } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/`, queryParams: { prompt: 'select_account', access_type: 'online' } },
    })
    if (authError) { setError(authError.message); setGoogleLoading(false) }
  }

  return (
    <div className="min-h-[100dvh] bg-canvas px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="font-mono text-5xl font-bold tracking-[-0.06em] text-primary-text">#Python</div>
          <h1 className="mt-4 mb-1 text-h3">{t.title}</h1>
          <p className="mb-0 text-sm text-ink-muted">{t.subtitle}</p>
        </div>

        <div className="hp-segmented mx-auto mb-5 w-fit" role="group" aria-label={lang === 'en' ? 'Language' : 'Idioma'}>
          <button type="button" onClick={() => setLang('en')} className={`hp-segmented__item px-4 ${lang === 'en' ? 'hp-segmented__item--active' : ''}`} aria-pressed={lang === 'en'}>English</button>
          <button type="button" onClick={() => setLang('pt')} className={`hp-segmented__item px-4 ${lang === 'pt' ? 'hp-segmented__item--active' : ''}`} aria-pressed={lang === 'pt'}>Português</button>
        </div>

        <Card variant="raised" padding="lg" className="space-y-4">
          {mode !== 'forgot' && (
            <button type="button" onClick={() => { continueAsGuest(); navigate('/onboarding') }} className="hp-guest-entry">
              <span className="hp-guest-entry__icon" aria-hidden="true">↗</span>
              <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-bold text-primary-text">{t.guest}</span><span className="mt-1 block text-xs text-ink-muted">{t.guestNote}</span></span>
            </button>
          )}

          {mode === 'forgot' ? (
            <>
              <div><h2 className="mb-1 text-title">{t.forgot}</h2><p className="mb-0 text-sm text-ink-muted">{t.forgotDesc}</p></div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label={t.email} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@email.com" required autoComplete="email" />
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                {!success && <Button type="submit" fullWidth size="lg" loading={loading}>{t.sendReset}</Button>}
              </form>
              <Button variant="ghost" fullWidth onClick={() => { setMode('login'); reset() }}>← {t.backToLogin}</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="lg" fullWidth loading={googleLoading} onClick={handleGoogle} leftIcon={<GoogleIcon />}>{t.google}</Button>
              <div className="hp-divider"><span>{t.orContinueWith}</span></div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && <Input label={t.name} type="text" value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder={lang === 'en' ? 'Your name' : 'Seu nome'} required autoComplete="name" />}
                <Input label={t.email} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@email.com" required autoComplete="email" />
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="hp-field__label mb-0">{t.password}</span>
                    {mode === 'login' && <button type="button" onClick={() => { setMode('forgot'); reset() }} className="hp-text-link">{t.forgotLink}</button>}
                  </div>
                  <input className="hp-input" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="••••••••" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button type="submit" fullWidth size="lg" loading={loading}>{mode === 'login' ? t.login : t.register}</Button>
              </form>
              <Button variant="ghost" fullWidth onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); reset() }}>{mode === 'login' ? t.switchToRegister : t.switchToLogin}</Button>
            </>
          )}
        </Card>

        <p className="mt-6 mb-0 text-center text-xs text-ink-muted">{t.footer}</p>
      </div>
    </div>
  )
}
