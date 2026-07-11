import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { buildDiagnosticQueue, type LearningAttemptInput } from '../lib/learningEngine'

export default function Diagnostic() {
  const navigate = useNavigate()
  const { lang, recordLearningAttempts, completeDiagnostic } = useApp()
  const [queue] = useState(() => buildDiagnosticQueue(ALL_PHASES))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [finished, setFinished] = useState(false)

  const t = {
    en: {
      title: 'Initial diagnostic', intro: 'This does not block any phase. It only identifies what you already know and where the app should start reviewing.',
      start: 'Answer honestly. Guessing is allowed.', question: 'Question', next: 'Next question', finish: 'Finish diagnostic',
      done: 'Diagnostic complete', score: 'correct answers', note: 'Your skill dashboard is now personalized.', progress: 'See my skills',
    },
    pt: {
      title: 'Diagnóstico inicial', intro: 'Isso não bloqueia nenhuma fase. Serve apenas para identificar o que você já sabe e onde o app deve começar a revisar.',
      start: 'Responda com honestidade. Pode chutar quando não souber.', question: 'Questão', next: 'Próxima questão', finish: 'Concluir diagnóstico',
      done: 'Diagnóstico concluído', score: 'respostas corretas', note: 'Seu painel de habilidades agora está personalizado.', progress: 'Ver minhas habilidades',
    },
  }[lang]

  const finalize = (finalAnswers: Record<number, number>) => {
    const attempts: LearningAttemptInput[] = queue.map((item, index) => {
      const correct = finalAnswers[index] === item.question.correctIndex
      return {
        phaseId: item.phaseId,
        activity: 'diagnostic',
        itemId: item.id,
        skillIds: [item.skillId],
        score: correct ? 100 : 0,
        passed: correct,
      }
    })
    recordLearningAttempts(attempts)
    completeDiagnostic()
    setFinished(true)
  }

  if (finished) {
    const correct = queue.filter((item, index) => answers[index] === item.question.correctIndex).length
    return (
      <Layout showBack backTo="/progress" title={t.title}>
        <div className="p-4">
          <div className="rounded-2xl p-7 text-center" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <div className="text-5xl mb-3">🩺</div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{t.done}</h1>
            <div className="text-4xl font-mono mt-4" style={{ color: 'var(--c-purple-l)' }}>{correct}/{queue.length}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--c-muted)' }}>{t.score}</div>
            <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.note}</p>
            <button onClick={() => navigate('/progress')} className="w-full rounded-xl py-3 mt-5 text-white font-medium" style={{ background: 'var(--c-purple)' }}>{t.progress}</button>
          </div>
        </div>
      </Layout>
    )
  }

  const item = queue[current]
  const selected = answers[current]
  const answered = selected !== undefined

  const next = () => {
    if (!answered) return
    if (current + 1 >= queue.length) {
      finalize(answers)
      return
    }
    setCurrent(value => value + 1)
  }

  return (
    <Layout showBack backTo="/progress" title={t.title}>
      <div className="p-4 space-y-4">
        {current === 0 && (
          <div className="rounded-xl p-4" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.intro}</p>
            <p className="text-xs mt-2" style={{ color: 'var(--c-purple-l)' }}>{t.start}</p>
          </div>
        )}
        <div className="flex justify-between text-xs" style={{ color: 'var(--c-muted)' }}>
          <span>{t.question} {current + 1}</span><span>{current + 1}/{queue.length}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--c-card)' }}>
          <div className="h-full rounded-full" style={{ width: `${((current + (answered ? 1 : 0)) / queue.length) * 100}%`, background: 'var(--c-purple)' }} />
        </div>
        <div className="rounded-xl p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--c-text)' }}>{item.question.question[lang]}</p>
        </div>
        <div className="space-y-2">
          {item.question.options.map((option, index) => (
            <button key={index} onClick={() => setAnswers(previous => ({ ...previous, [current]: index }))} className="w-full text-left rounded-xl px-4 py-3 text-sm" style={{ background: selected === index ? 'var(--c-purple-dm)' : 'var(--c-card)', border: `1px solid ${selected === index ? 'var(--c-purple)' : 'var(--c-border)'}`, color: selected === index ? 'var(--c-purple-l)' : 'var(--c-text2)' }}>
              <span className="font-mono text-xs mr-3 opacity-60">{String.fromCharCode(65 + index)}.</span>{option[lang]}
            </button>
          ))}
        </div>
        <button onClick={next} disabled={!answered} className="w-full rounded-xl py-3.5 text-white font-semibold disabled:opacity-40" style={{ background: 'var(--c-purple)' }}>{current + 1 >= queue.length ? t.finish : t.next}</button>
      </div>
    </Layout>
  )
}
