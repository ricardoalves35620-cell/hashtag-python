import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

export default function Login() {
  const { lang, setLang } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const t = {
    en: {
      title: 'Learn Python as a family',
      subtitle: 'Complete guided course with real coding exercises',
      email: 'Email',
      password: 'Password',
      name: 'Your name',
      login: 'Sign in',
      register: 'Create account',
      switchToRegister: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Sign in',
      or: 'or'
    },
    pt: {
      title: 'Aprenda Python em família',
      subtitle: 'Curso guiado completo com exercícios de código reais',
      email: 'Email',
      password: 'Senha',
      name: 'Seu nome',
      login: 'Entrar',
      register: 'Criar conta',
      switchToRegister: 'Não tem conta? Cadastre-se',
      switchToLogin: 'Já tem conta? Entrar',
      or: 'ou'
    }
  }[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/home')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } }
        })
        if (error) throw error
        navigate('/home')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="text-5xl font-mono font-medium text-purple-light tracking-tight mb-2">
          #Python
        </div>
        <div className="text-[#8888aa] text-sm">{t.title}</div>
        <div className="text-[#555570] text-xs mt-1">{t.subtitle}</div>
      </div>

      {/* Lang toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setLang('en')}
          className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${lang === 'en' ? 'bg-purple-dim border-purple-DEFAULT text-purple-light' : 'border-border text-muted hover:text-white'}`}
        >
          🇨🇦 English
        </button>
        <button
          onClick={() => setLang('pt')}
          className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${lang === 'pt' ? 'bg-purple-dim border-purple-DEFAULT text-purple-light' : 'border-border text-muted hover:text-white'}`}
        >
          🇧🇷 Português
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        {mode === 'register' && (
          <div>
            <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.name}</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Ricardo"
              required
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted"
            />
          </div>
        )}

        <div>
          <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted"
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.password}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/40 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? '...' : mode === 'login' ? t.login : t.register}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full text-center text-sm text-muted hover:text-white transition-colors py-2"
        >
          {mode === 'login' ? t.switchToRegister : t.switchToLogin}
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-[#333355]">
        {lang === 'en' ? 'Family plan · Everyone learns at their own pace' : 'Plano família · Cada um aprende no seu ritmo'}
      </div>
    </div>
  )
}
