import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

type Level = 'zero' | 'comfortable' | 'coded'

export default function Onboarding() {
  const { lang, user, isGuest } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Level | null>(null)
  const [saving, setSaving] = useState(false)

  const choices = {
    en: [
      { id: 'zero' as const, icon: '🌱', title: 'I am starting from zero', desc: 'I still get lost with files, folders, downloads or installing programs.', badge: 'Recommended for true beginners' },
      { id: 'comfortable' as const, icon: '🧭', title: 'I use a computer comfortably', desc: 'I can organize files and install apps, but I have never programmed.', badge: 'Quick readiness check' },
      { id: 'coded' as const, icon: '🐍', title: 'I have already tried programming', desc: 'I know basic computer use and want the app to find my Python starting point.', badge: 'Python diagnostic' },
    ],
    pt: [
      { id: 'zero' as const, icon: '🌱', title: 'Estou começando do zero', desc: 'Ainda me perco com arquivos, pastas, downloads ou instalação de programas.', badge: 'Recomendado para iniciantes reais' },
      { id: 'comfortable' as const, icon: '🧭', title: 'Uso o computador com tranquilidade', desc: 'Consigo organizar arquivos e instalar apps, mas nunca programei.', badge: 'Teste rápido de preparo' },
      { id: 'coded' as const, icon: '🐍', title: 'Já tentei programar', desc: 'Domino o uso básico do computador e quero descobrir onde começar em Python.', badge: 'Diagnóstico de Python' },
    ],
  }[lang]

  const t = {
    en: { eyebrow: 'Your first decision', title: 'Where should we start?', sub: 'There is no “good” or “bad” answer. The app changes the path so missing computer basics do not become Python problems.', continue: 'Build my starting path', guest: 'Visitor mode: progress is saved only on this device.' },
    pt: { eyebrow: 'Sua primeira decisão', title: 'Por onde devemos começar?', sub: 'Não existe resposta “boa” ou “ruim”. O app adapta o caminho para que lacunas de computador não virem problemas em Python.', continue: 'Montar meu ponto de partida', guest: 'Modo visitante: o progresso fica salvo apenas neste aparelho.' },
  }[lang]

  const finish = async () => {
    if (!selected) return
    setSaving(true)
    localStorage.setItem('hp_onboarding_done', 'course')
    localStorage.setItem('hp_computer_level', selected)
    if (user) {
      try { await getSupabase().auth.updateUser({ data: { onboarding_done: true, track: 'course', computer_level: selected } }) } catch { /* local onboarding remains valid */ }
    }
    if (selected === 'zero') navigate('/base-zero')
    else if (selected === 'comfortable') navigate('/base-zero?mode=check')
    else navigate('/diagnostic')
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'var(--c-bg)', paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}>
      <div className="max-w-lg mx-auto">
        <div className="font-mono text-3xl font-medium mb-8" style={{ color: 'var(--c-purple-l)' }}>#Python</div>
        <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-purple-l)' }}>{t.eyebrow}</div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--c-text)' }}>{t.title}</h1>
        <p className="text-sm leading-relaxed mt-2 mb-6" style={{ color: 'var(--c-text2)' }}>{t.sub}</p>

        {isGuest && <div className="rounded-xl p-3 text-xs mb-4" style={{ background: '#1f1000', color: '#fbbf24', border: '1px solid #4a2a00' }}>ℹ️ {t.guest}</div>}

        <div className="space-y-3">
          {choices.map(choice => (
            <button key={choice.id} onClick={() => setSelected(choice.id)} className="w-full rounded-2xl p-4 text-left transition-all" style={{ background: selected === choice.id ? 'var(--c-purple-f)' : 'var(--c-card)', border: `2px solid ${selected === choice.id ? 'var(--c-purple)' : 'var(--c-border)'}` }}>
              <div className="flex gap-3">
                <div className="text-3xl">{choice.icon}</div>
                <div className="flex-1"><div className="text-xs mb-1" style={{ color: selected === choice.id ? 'var(--c-purple-l)' : 'var(--c-muted)' }}>{choice.badge}</div><div className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>{choice.title}</div><p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{choice.desc}</p></div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: `2px solid ${selected === choice.id ? 'var(--c-purple)' : 'var(--c-border)'}`, background: selected === choice.id ? 'var(--c-purple)' : 'transparent', color: '#fff', fontSize: 11 }}>{selected === choice.id ? '✓' : ''}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={finish} disabled={!selected || saving} className="w-full rounded-xl py-4 mt-6 text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'var(--c-purple)' }}>{saving ? '...' : t.continue} →</button>
      </div>
    </div>
  )
}
