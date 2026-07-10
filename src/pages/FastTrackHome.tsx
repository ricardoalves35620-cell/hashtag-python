import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { FASTTRACK_DAYS } from '../data/fasttrack'

export default function FastTrackHome() {
  const { lang } = useApp()
  const navigate = useNavigate()
  const doneDays: number[] = JSON.parse(localStorage.getItem('hp_ft_done') || '[]')
  const completed = doneDays.length === 7

  const t = {
    en: {
      title: 'FastTrack', badge: '⚡ 7 days · 20 min/day',
      desc: 'A complete overview of Python in one week.',
      progress: 'Your progress', day: 'Day', done: 'Done', start: 'Start',
      review: 'Review', continue: 'Continue',
      completedTitle: 'FastTrack Complete! 🎉',
      completedDesc: 'You covered the essentials of Python. Ready to go deeper?',
      goDeep: 'Start the full course →',
    },
    pt: {
      title: 'FastTrack', badge: '⚡ 7 dias · 20 min/dia',
      desc: 'Uma visão completa de Python em uma semana.',
      progress: 'Seu progresso', day: 'Dia', done: 'Feito', start: 'Começar',
      review: 'Revisar', continue: 'Continuar',
      completedTitle: 'FastTrack Completo! 🎉',
      completedDesc: 'Você cobriu os fundamentos do Python. Pronto para ir mais fundo?',
      goDeep: 'Começar o curso completo →',
    }
  }[lang]

  const nextDay = FASTTRACK_DAYS.find(d => !doneDays.includes(d.id))

  return (
    <Layout showBack backTo="/home" title={t.title}>
      <div className="p-4 space-y-4">

        {/* Header */}
        <div className="rounded-2xl p-5" style={{ background: '#1a1040', border: '1px solid var(--c-purple)' }}>
          <div className="text-xs px-2 py-0.5 rounded-full inline-block mb-2" style={{ background: 'var(--c-purple)', color: '#fff' }}>
            {t.badge}
          </div>
          <p className="text-sm" style={{ color: 'var(--c-text2)' }}>{t.desc}</p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--c-muted)' }}>
              <span>{t.progress}</span>
              <span>{doneDays.length}/7</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(doneDays.length / 7) * 100}%`, background: 'var(--c-purple)' }}
              />
            </div>
          </div>
        </div>

        {/* Completed banner */}
        {completed && (
          <div className="rounded-2xl p-5 text-center" style={{ background: '#052e16', border: '1px solid #166534' }}>
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-base font-medium mb-1" style={{ color: '#86efac' }}>{t.completedTitle}</div>
            <p className="text-sm mb-4" style={{ color: '#4ade80' }}>{t.completedDesc}</p>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 rounded-xl text-sm font-medium text-white"
              style={{ background: '#166534' }}
            >
              {t.goDeep}
            </button>
          </div>
        )}

        {/* Continue button */}
        {!completed && nextDay && (
          <button
            onClick={() => navigate(`/fasttrack/${nextDay.id}`)}
            className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--c-purple)' }}
          >
            {t.continue} — {t.day} {nextDay.id}: {nextDay.title[lang]}
          </button>
        )}

        {/* Day list */}
        <div className="space-y-2">
          {FASTTRACK_DAYS.map(day => {
            const isDone = doneDays.includes(day.id)
            return (
              <button
                key={day.id}
                onClick={() => navigate(`/fasttrack/${day.id}`)}
                className="w-full text-left rounded-xl p-4 transition-all flex items-center gap-3"
                style={{
                  background: isDone ? '#0a1a0a' : 'var(--c-card)',
                  border: `0.5px solid ${isDone ? '#1a4a1a' : 'var(--c-border)'}`,
                  minHeight: 'auto',
                }}
              >
                {/* Day number circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                  style={{ background: isDone ? '#166534' : day.color, color: isDone ? '#fff' : day.textColor }}
                >
                  {isDone ? '✓' : day.id}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--c-text)' }}>
                    {t.day} {day.id} — {day.title[lang]}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: 'var(--c-muted)' }}>
                    {day.subtitle[lang]}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs" style={{ color: 'var(--c-dimmer)' }}>{day.duration}min</span>
                  {isDone && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#14532d', color: '#86efac' }}>
                      {t.done}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
