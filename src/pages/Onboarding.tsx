import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

export default function Onboarding() {
  const { lang, user } = useApp()
  const navigate = useNavigate()

  const choose = async (track: 'fasttrack' | 'course') => {
    localStorage.setItem('hp_onboarding_done', track)
    if (user) {
      supabase.auth.updateUser({ data: { onboarding_done: true, track } })
    }
    navigate(track === 'fasttrack' ? '/fasttrack' : '/home')
  }

  const t = {
    en: {
      welcome: 'Welcome to #Python',
      sub: 'How do you want to start?',
      ft: '⚡ FastTrack',
      ftSub: '7 days · 20 min/day',
      ftDesc: 'Get a solid overview of Python in one week. Perfect for meetings, conversations, or just getting started.',
      ftBadge: 'Best for beginners',
      course: '🎓 Full Course',
      courseSub: '27 phases · beginner to expert',
      courseDesc: 'Go deep — from complete beginner to professional Python developer. All three tracks: data science, web, automation.',
      courseBadge: 'Professional path',
    },
    pt: {
      welcome: 'Bem-vindo ao #Python',
      sub: 'Como você quer começar?',
      ft: '⚡ FastTrack',
      ftSub: '7 dias · 20 min/dia',
      ftDesc: 'Uma visão geral sólida de Python em uma semana. Perfeito para reuniões, conversas ou simplesmente começar.',
      ftBadge: 'Melhor para iniciantes',
      course: '🎓 Curso Completo',
      courseSub: '27 fases · do zero ao expert',
      courseDesc: 'Aprofunde-se — do zero ao desenvolvedor Python profissional. Três trilhas: dados, web, automação.',
      courseBadge: 'Caminho profissional',
    }
  }[lang]

  return (
    <div
      className="flex flex-col items-center justify-center p-6 text-center"
      style={{
        minHeight: '100dvh',
        background: 'var(--c-bg)',
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
      }}
    >
      <div className="font-mono text-4xl font-medium mb-2" style={{ color: 'var(--c-purple-l)' }}>#Python</div>
      <h1 className="text-xl font-medium mb-1" style={{ color: 'var(--c-text)' }}>{t.welcome}</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--c-muted)' }}>{t.sub}</p>

      <div className="w-full max-w-sm space-y-4">
        {/* FastTrack */}
        <button
          onClick={() => choose('fasttrack')}
          className="w-full text-left rounded-2xl p-5 transition-all active:scale-98"
          style={{ background: '#1a1040', border: '2px solid var(--c-purple)', display: 'block', minHeight: 'auto' }}
        >
          <div className="text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-3" style={{ background: 'var(--c-purple)', color: '#fff', fontSize: '10px' }}>
            {t.ftBadge}
          </div>
          <div className="text-xl font-medium mb-0.5" style={{ color: 'var(--c-purple-l)' }}>{t.ft}</div>
          <div className="text-sm mb-3" style={{ color: 'var(--c-purple-l)', opacity: 0.7 }}>{t.ftSub}</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.ftDesc}</p>
        </button>

        {/* Full Course */}
        <button
          onClick={() => choose('course')}
          className="w-full text-left rounded-2xl p-5 transition-all active:scale-98"
          style={{ background: 'var(--c-card)', border: '0.5px solid var(--c-border)', display: 'block', minHeight: 'auto' }}
        >
          <div className="text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-3" style={{ background: 'var(--c-card2)', color: 'var(--c-muted)', fontSize: '10px' }}>
            {t.courseBadge}
          </div>
          <div className="text-xl font-medium mb-0.5" style={{ color: 'var(--c-text)' }}>{t.course}</div>
          <div className="text-sm mb-3" style={{ color: 'var(--c-muted)' }}>{t.courseSub}</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.courseDesc}</p>
        </button>

        <p className="text-xs" style={{ color: 'var(--c-dimmer)' }}>
          {lang === 'en' ? 'You can switch anytime from your profile.' : 'Você pode trocar a qualquer momento pelo perfil.'}
        </p>
      </div>
    </div>
  )
}
