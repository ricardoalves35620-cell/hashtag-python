import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'

export default function Quiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState<number[]>([])
  const [correct, setCorrect] = useState(0)

  if (!phase || phase.quiz.length === 0) {
    return (
      <Layout showBack backTo={`/phase/${phase?.id}`}>
        <div className="p-4 text-muted text-sm">{lang === 'en' ? 'No quiz yet.' : 'Sem quiz ainda.'}</div>
      </Layout>
    )
  }

  const question = phase.quiz[current]
  const isAnswered = answered.includes(current)
  const isDone = current >= phase.quiz.length

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelected(idx)
    setAnswered(prev => [...prev, current])
    if (idx === question.correctIndex) setCorrect(c => c + 1)
  }

  const handleNext = () => {
    setSelected(null)
    setCurrent(c => c + 1)
  }

  const handleFinish = async () => {
    if (!user) return
    await markStepDone(user.id, phase.id, 'quiz')
    await refreshProgress()
    navigate(`/phase/${phase.id}/exam`)
  }

  const t = {
    en: { question: 'Question', of: 'of', noGrade: 'Practice — no grade', next: 'Next question', finish: 'Go to exam →', correct: 'Correct!', wrong: 'Not quite.', explanation: 'Explanation', phase: 'Phase', score: 'Your score' },
    pt: { question: 'Questão', of: 'de', noGrade: 'Prática — sem nota', next: 'Próxima questão', finish: 'Ir para o exame →', correct: 'Correto!', wrong: 'Não foi dessa vez.', explanation: 'Explicação', phase: 'Fase', score: 'Sua pontuação' }
  }[lang]

  if (isDone) {
    const pct = Math.round((correct / phase.quiz.length) * 100)
    return (
      <Layout showBack backTo={`/phase/${phase.id}`} title={`${t.phase} ${phase.id}`}>
        <div className="p-4 space-y-4">
          <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-6 text-center">
            <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : '📚'}</div>
            <div className="text-xs text-muted mb-2 uppercase tracking-wide">{t.score}</div>
            <div className="text-4xl font-mono font-medium text-white mb-1">{correct}/{phase.quiz.length}</div>
            <div className="text-purple-light text-lg">{pct}%</div>
            <div className="text-sm text-muted mt-3">
              {lang === 'en'
                ? 'The mini-test is for practice only — no grade. Ready for the real exam?'
                : 'O mini-teste é só prática — sem nota. Pronto para o exame de verdade?'}
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
          >
            {t.finish}
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.phase} ${phase.id}`}
      title="Mini-test"
    >
      <div className="p-4 space-y-4">
        {/* Progress */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted">{t.question} {current + 1} {t.of} {phase.quiz.length}</span>
          <span className="text-xs text-purple-light">{t.noGrade}</span>
        </div>
        <div className="h-1.5 bg-[#0a0a18] rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-DEFAULT rounded-full transition-all"
            style={{ width: `${((current) / phase.quiz.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4">
          <p className="text-sm text-white leading-relaxed whitespace-pre-line">{question.question[lang]}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex
            const isSelected = selected === i

            let style = 'bg-card border-border text-[#b0b0d0]'
            if (isAnswered) {
              if (isCorrect) style = 'bg-[#052e16] border-green-700 text-green-300'
              else if (isSelected) style = 'bg-[#450a0a] border-red-700 text-red-300'
              else style = 'bg-card border-border text-muted opacity-50'
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={`w-full text-left border rounded-xl px-4 py-3 text-sm transition-all ${style} ${!isAnswered ? 'hover:border-purple-dim cursor-pointer' : ''}`}
              >
                <span className="font-mono text-xs mr-3 opacity-60">{String.fromCharCode(65 + i)}.</span>
                <span className="whitespace-pre-line">{opt[lang]}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={`rounded-xl p-4 border ${selected === question.correctIndex ? 'bg-[#052e16] border-green-700' : 'bg-[#1f0a0a] border-red-900'}`}>
            <div className={`text-sm font-medium mb-2 ${selected === question.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
              {selected === question.correctIndex ? `✅ ${t.correct}` : `❌ ${t.wrong}`}
            </div>
            <div className="text-xs text-muted mb-1">{t.explanation}</div>
            <div className="text-sm text-[#b0b0d0] leading-relaxed">{question.explanation[lang]}</div>
          </div>
        )}

        {isAnswered && (
          <button
            onClick={current + 1 >= phase.quiz.length ? handleFinish : handleNext}
            className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            {current + 1 >= phase.quiz.length ? t.finish : t.next}
          </button>
        )}
      </div>
    </Layout>
  )
}
