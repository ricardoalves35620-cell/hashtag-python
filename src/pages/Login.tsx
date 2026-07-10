import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

type Mode = 'login' | 'register' | 'forgot'

export default function Login() {
  const { lang, setLang } = useApp()
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
      title: 'Learn Python as a family',
      subtitle: 'Complete guided course with real coding exercises',
      email: 'Email', password: 'Password', name: 'Your name',
      login: 'Sign in', register: 'Create account',
      forgot: 'Forgot password',
      forgotDesc: "Enter your email and we'll send you a reset link.",
      sendReset: 'Send reset link',
      resetSent: 'Check your email — reset link sent!',
      backToLogin: 'Back to sign in',
      switchToRegister: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Sign in',
      forgotLink: 'Forgot your password?',
      orContinueWith: 'or continue with',
      google: 'Continue with Google'
    },
    pt: {
      title: 'Aprenda Python em família',
      subtitle: 'Curso guiado completo com exercícios de código reais',
      email: 'Email', password: 'Senha', name: 'Seu nome',
      login: 'Entrar', register: 'Criar conta',
      forgot: 'Esqueci a senha',
      forgotDesc: 'Digite seu email e enviaremos um link para redefinir a senha.',
      sendReset: 'Enviar link',
      resetSent: 'Verifique seu email — link enviado!',
      backToLogin: 'Voltar para entrar',
      switchToRegister: 'Não tem conta? Cadastre-se',
      switchToLogin: 'Já tem conta? Entrar',
      forgotLink: 'Esqueceu a senha?',
      orContinueWith: 'ou continue com',
      google: 'Continuar com Google'
    }
  }[lang]

  const reset = () => { setError(''); setSuccess('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    reset()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/home')
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: displayName } }
        })
        if (error) throw error
        navigate('/home')
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        })
        if (error) throw error
        setSuccess(t.resetSent)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` }
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="text-5xl font-mono font-medium text-purple-light tracking-tight mb-2">#Python</div>
        <div className="text-[#8888aa] text-sm">{t.title}</div>
        <div className="text-[#555570] text-xs mt-1">{t.subtitle}</div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${lang === 'en' ? 'bg-purple-dim border-purple-DEFAULT text-purple-light' : 'border-border text-muted hover:text-white'}`}>
          🇨🇦 English
        </button>
        <button onClick={() => setLang('pt')} className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${lang === 'pt' ? 'bg-purple-dim border-purple-DEFAULT text-purple-light' : 'border-border text-muted hover:text-white'}`}>
          🇧🇷 Português
        </button>
      </div>

      <div className="w-full max-w-sm space-y-3">

        {/* Forgot password mode */}
        {mode === 'forgot' ? (
          <>
            <div className="bg-card border border-border rounded-xl p-4 mb-2">
              <h2 className="text-sm font-medium text-white mb-1">{t.forgot}</h2>
              <p className="text-xs text-muted">{t.forgotDesc}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.email}</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" required
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted"
                />
              </div>

              {error && <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/40 rounded-xl px-4 py-3">{error}</div>}
              {success && <div className="text-green-400 text-sm bg-green-900/20 border border-green-900/40 rounded-xl px-4 py-3">{success}</div>}

              {!success && (
                <button type="submit" disabled={loading} className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {loading ? '...' : t.sendReset}
                </button>
              )}
            </form>

            <button onClick={() => { setMode('login'); reset() }} className="w-full text-center text-sm text-muted hover:text-white transition-colors py-2">
              ← {t.backToLogin}
            </button>
          </>
        ) : (
          <>
            {/* Google button */}
            <button
              onClick={handleGoogle} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50 border border-gray-200"
            >
              {googleLoading ? <span className="text-gray-500">Redirecting...</span> : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
                  </svg>
                  {t.google}
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted">{t.orContinueWith}</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.name}</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Ricardo" required className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.email}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-muted font-medium uppercase tracking-wide">{t.password}</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => { setMode('forgot'); reset() }} className="text-xs text-purple-light hover:text-white transition-colors">
                      {t.forgotLink}
                    </button>
                  )}
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted" />
              </div>

              {error && <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/40 rounded-xl px-4 py-3">{error}</div>}

              <button type="submit" disabled={loading} className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
                {loading ? '...' : mode === 'login' ? t.login : t.register}
              </button>
            </form>

            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); reset() }} className="w-full text-center text-sm text-muted hover:text-white transition-colors py-2">
              {mode === 'login' ? t.switchToRegister : t.switchToLogin}
            </button>
          </>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-[#333355]">
        {lang === 'en' ? 'Family plan · Everyone learns at their own pace' : 'Plano família · Cada um aprende no seu ritmo'}
      </div>
    </div>
  )
}
