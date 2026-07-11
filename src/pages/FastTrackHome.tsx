import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { FASTTRACK_DAYS } from '../data/fasttrack'
import { loadFTProgress, resetFTProgress } from '../lib/fasttrackProgress'

export default function FastTrackHome() {
  const { lang, user } = useApp()
  const navigate = useNavigate()
  const [doneDays, setDoneDays] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  // Load from Supabase (multi-device sync) on mount
  useEffect(() => {
    if (!user) return
    loadFTProgress(user.id).then(days => {
      setDoneDays(days)
      setLoading(false)
    })
  }, [user])

  const completed = doneDays.length === 7

  const t = {
    en: {
      title: 'FastTrack', badge: '⚡ 7 days · 20 min/day',
      desc: 'A complete overview of Python in one week.',
      progress: 'Your progress', day: 'Day', done: 'Done',
      continue: 'Continue', loading: 'Loading...',
      completedTitle: 'FastTrack Complete! 🎉',
      completedDesc: 'You covered the essentials of Python. Ready to go deeper?',
      goDeep: 'Start the full course →',
      resetTitle: 'Reset progress',
      resetDesc: 'Clear all completed days and start the 7-day track from scratch.',
      resetBtn: '🔄 Reset FastTrack',
      resetConfirm: 'Reset all FastTrack progress? This cannot be undone.',
      resetting: 'Resetting...',
    },
    pt: {
      title: 'FastTrack', badge: '⚡ 7 dias · 20 min/dia',
      desc: 'Uma visão completa de Python em uma semana.',
      progress: 'Seu progresso', day: 'Dia', done: 'Feito',
      continue: 'Continuar', loading: 'Carregando...',
      completedTitle: 'FastTrack Completo! 🎉',
      completedDesc: 'Você cobriu os fundamentos do Python. Pronto para ir mais fundo?',
      goDeep: 'Começar o curso completo →',
      resetTitle: 'Resetar progresso',
      resetDesc: 'Limpar todos os dias concluídos e recomeçar os 7 dias do zero.',
      resetBtn: '🔄 Resetar FastTrack',
      resetConfirm: 'Resetar todo o progresso do FastTrack? Não pode ser desfeito.',
      resetting: 'Resetando...',
    }
  }[lang]

  const nextDay = FASTTRACK_DAYS.find(d => !doneDays.includes(d.id))

  const card = (extra = {}) => ({
    background: 'var(--c-card)',
    border: '0.5px solid var(--c-border)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    ...extra,
  })

  const handleReset = async () => {
    if (!user) return
    if (!window.confirm(t.resetConfirm)) return
    setResetting(true)
    await resetFTProgress(user.id)
    setDoneDays([])
    setResetting(false)
  }

  return (
    <Layout title={t.title}>
      <div style={{ padding: '12px 16px' }}>

        {/* Header */}
        <div style={{ ...card(), background: '#1a1040', border: '1px solid var(--c-purple)' }}>
          <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 10, background: 'var(--c-purple)', color: '#fff' }}>
            {t.badge}
          </div>
          <p style={{ fontSize: 13, color: 'var(--c-text2)', margin: 0, marginBottom: 12 }}>{t.desc}</p>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-muted)', marginBottom: 6 }}>
              <span>{t.progress}</span>
              <span>{doneDays.length}/7</span>
            </div>
            <div style={{ height: 6, background: 'var(--c-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(doneDays.length / 7) * 100}%`, background: 'var(--c-purple)', borderRadius: 3, transition: 'width 0.4s' }} />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--c-muted)', fontSize: 14 }}>{t.loading}</div>
        ) : (
          <>
            {/* Completed banner */}
            {completed && (
              <div style={{ ...card(), background: '#052e16', border: '1px solid #166534', textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🏆</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#86efac', marginBottom: 6 }}>{t.completedTitle}</div>
                <p style={{ fontSize: 13, color: '#4ade80', marginBottom: 14 }}>{t.completedDesc}</p>
                <button onClick={() => navigate('/')} style={{ width: '100%', padding: 12, borderRadius: 10, background: '#166534', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                  {t.goDeep}
                </button>
              </div>
            )}

            {/* Continue button */}
            {!completed && nextDay && (
              <button onClick={() => navigate(`/fasttrack/${nextDay.id}`)} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'var(--c-purple)', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', marginBottom: 10 }}>
                {t.continue} — {t.day} {nextDay.id}: {nextDay.title[lang]}
              </button>
            )}

            {/* Day list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FASTTRACK_DAYS.map(day => {
                const isDone = doneDays.includes(day.id)
                return (
                  <button key={day.id} onClick={() => navigate(`/fasttrack/${day.id}`)} style={{
                    ...card({ marginBottom: 0 }),
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: isDone ? '#0a1a0a' : 'var(--c-card)',
                    border: `0.5px solid ${isDone ? '#1a4a1a' : 'var(--c-border)'}`,
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 500,
                      background: isDone ? '#166534' : 'var(--c-purple-dm)',
                      color: isDone ? '#fff' : day.textColor,
                    }}>
                      {isDone ? '✓' : day.id}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.day} {day.id} — {day.title[lang]}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {day.subtitle[lang]}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: 'var(--c-dimmer)' }}>{day.duration}min</span>
                      {isDone && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 10, background: '#14532d', color: '#86efac' }}>{t.done}</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Reset progress */}
            <div style={{ ...card(), marginTop: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-text)', marginBottom: 4 }}>{t.resetTitle}</div>
              <p style={{ fontSize: 12, color: 'var(--c-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>{t.resetDesc}</p>
              <button onClick={handleReset} disabled={resetting} style={{
                padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: 'transparent', color: '#f87171',
                border: '0.5px solid rgba(239,68,68,0.4)', cursor: 'pointer',
                opacity: resetting ? 0.5 : 1,
              }}>
                {resetting ? t.resetting : t.resetBtn}
              </button>
            </div>
          </>
        )}

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
