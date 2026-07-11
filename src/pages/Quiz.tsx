import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'

const QUIZ_PASS_SCORE = 80

export default function Quiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(item => item.id === Number(id))

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!phase || phase.quiz.length === 0) {
    return (
      <Layout showBack backTo={`/phase/${phase?.id}`}>
        <div className="p-4 text-muted text-sm">{lang === 'en' ? 'No knowledge check yet.' : 'Sem verificação de conhecimento ainda.'}</div>
      </Layout>
    )
  }

  const question = phase.quiz[current]
  const isAnswered = answers[current] !== undefined
  const correctAnswers = Object.entries(answers).filter(([questionIndex, answer]) => phase.quiz[Number(questionIndex)]?.correctIndex === answer).length
  const percentage = Math.round((correctAnswers / phase.quiz.length) * 100)
  const passed = percentage >= QUIZ_PASS_SCORE

  const handleSelect = (index: number) => {
    if (isAnswered) return
    setSelected(index)
    setAnswers(previous => ({ ...previous, [current]: index }))
  }

  const handleNext = () => {
    if (current + 1 >= phase.quiz.length) {
      setShowResult(true)
      return
    }
    setCurrent(value => value + 1)
    setSelected(null)
  }

  const handleContinue = async () => {
    if (!user || !passed) return
    setSaving(true)
    try {
      await markStepDone(user.id, phase.id, 'quiz')
      await refreshProgress()
      navigate(`/phase/${phase.id}/exam`)
    } finally {
      setSaving(false)
    }
  }

  const retry = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers({})
    setShowResult(false)
  }

  const t = {
    en: {
      question: 'Question', of: 'of', mastery: `Knowledge check · ${QUIZ_PASS_SCORE}% required`, next: 'Next question',
      result: 'Knowledge check result', correct: 'Correct!', wrong: 'Not quite.', explanation: 'Explanation',
      phase: 'Phase', score: 'Your score', continue: 'Go to exam →', retry: 'Review and try again', saving: 'Saving...',
      passed: 'You demonstrated enough understanding to attempt the exam.',
      failed: 'You need more review before the exam. Revisit the explanations and try again.'
    },
    pt: {
      question: 'Questão', of: 'de', mastery: `Verificação de conhecimento · mínimo ${QUIZ_PASS_SCORE}%`, next: 'Próxima questão',
      result: 'Resultado da verificação', correct: 'Correto!', wrong: 'Não foi dessa vez.', explanation: 'Explicação',
      phase: 'Fase', score: 'Sua pontuação', continue: 'Ir para o exame →', retry: 'Revisar e tentar novamente', saving: 'Salvando...',
      passed: 'Você demonstrou entendimento suficiente para tentar o exame.',
      failed: 'Você precisa revisar antes do exame. Releia as explicações e tente novamente.'
    }
  }[lang]

  if (showResult) {
    return (
      <Layout showBack backTo={`/phase/${phase.id}`} title={`${t.phase} ${phase.id}`}>
        <div className="p-4 space-y-4">
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--c-card)', border: `1px solid ${passed ? '#1f6f45' : '#7c5a13'}` }}>
            <div className="text-5xl mb-4">{passed ? '🎉' : '📚'}</div>
            <div className="text-xs text-muted mb-2 uppercase tracking-wide">{t.result}</div>
            <div className="text-4xl font-mono font-medium mb-1" style={{ color: 'var(--c-text)' }}>{correctAnswers}/{phase.quiz.length}</div>
            <div className="text-lg" style={{ color: passed ? '#4ade80' : '#f8d477' }}>{percentage}%</div>
            <div className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{passed ? t.passed : t.failed}</div>
          </div>

          {passed ? (
            <button onClick={handleContinue} disabled={saving} className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              {saving ? t.saving : t.continue}
            </button>
          ) : (
            <button onClick={retry} className="w-full font-medium py-3.5 rounded-xl text-sm" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}>
              ↻ {t.retry}
            </button>
          )}
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack backTo={`/phase/${phase.id}`} backLabel={`${t.phase} ${phase.id}`} title={lang === 'en' ? 'Knowledge check' : 'Verificação'}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center gap-3">
          <span className="text-xs text-muted">{t.question} {current + 1} {t.of} {phase.quiz.length}</span>
          <span className="text-xs text-purple-light text-right">{t.mastery}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
          <div className="h-full bg-purple-DEFAULT rounded-full transition-all" style={{ width: `${((current + (isAnswered ? 1 : 0)) / phase.quiz.length) * 100}%` }} />
        </div>

        <div className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--c-text)' }}>{question.question[lang]}</p>
        </div>

        <div className="space-y-2">
          {question.options.map((option, index) => {
            const correct = index === question.correctIndex
            const chosen = selected === index
            let background = 'var(--c-card)'
            let border = 'var(--c-border)'
            let color = 'var(--c-text2)'
            let opacity = 1
            if (isAnswered) {
              if (correct) { background = '#052e16'; border = '#15803d'; color = '#86efac' }
              else if (chosen) { background = '#450a0a'; border = '#b91c1c'; color = '#fca5a5' }
              else opacity = 0.5
            }
            return (
              <button key={index} onClick={() => handleSelect(index)} disabled={isAnswered} className="w-full text-left rounded-xl px-4 py-3 text-sm" style={{ background, border: `1px solid ${border}`, color, opacity }}>
                <span className="font-mono text-xs mr-3 opacity-60">{String.fromCharCode(65 + index)}.</span>
                <span className="whitespace-pre-line">{option[lang]}</span>
              </button>
            )
          })}
        </div>

        {isAnswered && (
          <div className="rounded-xl p-4" style={{ background: selected === question.correctIndex ? '#052e16' : '#1f0a0a', border: `1px solid ${selected === question.correctIndex ? '#15803d' : '#7f1d1d'}` }}>
            <div className="text-sm font-medium mb-2" style={{ color: selected === question.correctIndex ? '#4ade80' : '#f87171' }}>
              {selected === question.correctIndex ? `✅ ${t.correct}` : `❌ ${t.wrong}`}
            </div>
            <div className="text-xs text-muted mb-1">{t.explanation}</div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{question.explanation[lang]}</div>
          </div>
        )}

        {isAnswered && (
          <button onClick={handleNext} className="w-full text-white font-semibold rounded-xl" style={{ padding: 14, background: 'var(--c-purple)', border: 'none' }}>
            {current + 1 >= phase.quiz.length ? t.score : t.next}
          </button>
        )}
      </div>
    </Layout>
  )
}
