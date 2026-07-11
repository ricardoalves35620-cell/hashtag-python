import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

export default function ResetPassword() {
  const { lang } = useApp()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const t = {
    en: { title: 'Set new password', newPass: 'New password', confirm: 'Confirm password',
          save: 'Save new password', mismatch: 'Passwords do not match',
          done: 'Password updated! Redirecting...', short: 'Minimum 6 characters' },
    pt: { title: 'Definir nova senha', newPass: 'Nova senha', confirm: 'Confirmar senha',
          save: 'Salvar nova senha', mismatch: 'As senhas não coincidem',
          done: 'Senha atualizada! Redirecionando...', short: 'Mínimo 6 caracteres' }
  }[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError(t.short)
    if (password !== confirm) return setError(t.mismatch)
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => navigate('/'), 2000)
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="text-4xl font-mono font-medium text-purple-light mb-2">#Python</div>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h2 className="text-sm font-medium text-white">{t.title}</h2>
        </div>

        {success ? (
          <div className="text-green-400 text-sm bg-green-900/20 border border-green-900/40 rounded-xl px-4 py-3 text-center">
            {t.done}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.newPass}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wide">{t.confirm}</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-DEFAULT placeholder:text-muted" />
            </div>
            {error && <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/40 rounded-xl px-4 py-3">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
              {loading ? '...' : t.save}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
