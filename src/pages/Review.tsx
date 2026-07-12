import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { getSkill } from '../data/skills'
import { buildReviewQueue } from '../lib/learningEngine'
import { conciseAssessmentOption, createAssessmentSeed, shuffledCopy, shuffledIndices } from '../lib/assessmentIntegrity'

export default function Review() {
  const navigate = useNavigate()
  const { lang, learningState, recordLearningAttempt } = useApp()
  const [attemptSeed] = useState(() => createAssessmentSeed())
  const [baseQueue] = useState(() => buildReviewQueue(learningState, ALL_PHASES, 8))
  const queue = useMemo(() => shuffledCopy(baseQueue, attemptSeed, 'spaced-review-questions'), [baseQueue, attemptSeed])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const t = {
    en: {
      title: 'Spaced review', empty: 'No skill has enough history for review yet.', diagnostic: 'Start with the diagnostic',
      progress: 'Review', next: 'Next review', finish: 'Finish review', correct: 'Correct', wrong: 'Not yet',
      explanation: 'Why', done: 'Review complete', result: 'correct answers', back: 'Back to progress',
    },
    pt: {
      title: 'Revisão espaçada', empty: 'Ainda não há histórico suficiente para gerar uma revisão.', diagnostic: 'Começar pelo diagnóstico',
      progress: 'Revisão', next: 'Próxima revisão', finish: 'Concluir revisão', correct: 'Correto', wrong: 'Ainda não',
      explanation: 'Por quê', done: 'Revisão concluída', result: 'respostas corretas', back: 'Voltar ao progresso',
    },
  }[lang]

  if (queue.length === 0) {
    return (
      <Layout showBack backTo="/progress" title={t.title}>
        <div className="p-4">
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--c-text2)' }}>{t.empty}</p>
            <button onClick={() => navigate('/diagnostic')} className="w-full rounded-xl py-3 text-white font-medium" style={{ background: 'var(--c-purple)' }}>{t.diagnostic}</button>
          </div>
        </div>
      </Layout>
    )
  }

  if (finished) {
    return (
      <Layout showBack backTo="/progress" title={t.title}>
        <div className="p-4">
          <div className="rounded-2xl p-7 text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <div className="text-5xl mb-3">🧠</div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{t.done}</h1>
            <div className="text-4xl font-mono mt-4" style={{ color: 'var(--c-purple-l)' }}>{correctCount}/{queue.length}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--c-muted)' }}>{t.result}</div>
            <button onClick={() => navigate('/progress')} className="w-full rounded-xl py-3 mt-5 text-white font-medium" style={{ background: 'var(--c-purple)' }}>{t.back}</button>
          </div>
        </div>
      </Layout>
    )
  }

  const item = queue[current]
  const question = item.question
  const optionOrder = shuffledIndices(question.options.length, attemptSeed, item.id)
  const answered = selected !== null
  const correct = selected === question.correctIndex
  const skill = getSkill(item.skillId)

  const choose = (index: number) => {
    if (answered) return
    setSelected(index)
    const isCorrect = index === question.correctIndex
    if (isCorrect) setCorrectCount(value => value + 1)
    recordLearningAttempt({
      phaseId: item.phaseId,
      activity: 'review',
      itemId: item.id,
      skillIds: [item.skillId],
      score: isCorrect ? 100 : 0,
      passed: isCorrect,
    })
  }

  const next = () => {
    if (!answered) return
    if (current + 1 >= queue.length) {
      setFinished(true)
      return
    }
    setCurrent(value => value + 1)
    setSelected(null)
  }

  return (
    <Layout showBack backTo="/progress" title={t.title}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between text-xs" style={{ color: 'var(--c-muted)' }}>
          <span>{skill?.title[lang]}</span>
          <span>{t.progress} {current + 1}/{queue.length}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--c-card)' }}>
          <div className="h-full rounded-full" style={{ width: `${((current + (answered ? 1 : 0)) / queue.length) * 100}%`, background: 'var(--c-purple)' }} />
        </div>
        <div className="rounded-xl p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--c-text)' }}>{question.question[lang]}</p>
        </div>
        <div className="space-y-2">
          {optionOrder.map((originalIndex, displayIndex) => {
            const option = question.options[originalIndex]
            let background = 'var(--c-card)'
            let border = 'var(--c-border)'
            let color = 'var(--c-text2)'
            if (answered && originalIndex === question.correctIndex) { background = '#052e16'; border = '#15803d'; color = '#86efac' }
            else if (answered && originalIndex === selected) { background = '#450a0a'; border = '#b91c1c'; color = '#fca5a5' }
            return (
              <button key={originalIndex} onClick={() => choose(originalIndex)} disabled={answered} className="w-full text-left rounded-xl px-4 py-3 text-sm" style={{ background, border: `1px solid ${border}`, color }}>
                <span className="font-mono text-xs mr-3 opacity-60">{String.fromCharCode(65 + displayIndex)}.</span>{conciseAssessmentOption(option[lang])}
              </button>
            )
          })}
        </div>
        {answered && (
          <div className="rounded-xl p-4" style={{ background: correct ? '#052e16' : '#1f0a0a', border: `1px solid ${correct ? '#15803d' : '#7f1d1d'}` }}>
            <div className="text-sm font-semibold mb-2" style={{ color: correct ? '#4ade80' : '#f87171' }}>{correct ? `✅ ${t.correct}` : `❌ ${t.wrong}`}</div>
            <div className="text-xs mb-1" style={{ color: 'var(--c-muted)' }}>{t.explanation}</div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{question.explanation[lang]}</div>
          </div>
        )}
        {answered && <button onClick={next} className="w-full rounded-xl py-3.5 text-white font-semibold" style={{ background: 'var(--c-purple)' }}>{current + 1 >= queue.length ? t.finish : t.next}</button>}
      </div>
    </Layout>
  )
}
