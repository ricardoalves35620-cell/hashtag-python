import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { ENGINEERING_LAB_CHALLENGES } from '../data/labs'
import { useApp } from '../contexts/AppContext'

const STORAGE_KEY = 'hp_engineering_lab_v3'

function loadAnswers(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export default function EngineeringLab() {
  const { lang } = useApp()
  const [answers, setAnswers] = useState<Record<string, number>>(loadAnswers)
  const [active, setActive] = useState(0)
  const challenge = ENGINEERING_LAB_CHALLENGES[active]
  const answered = answers[challenge.id]
  const correctCount = useMemo(() => ENGINEERING_LAB_CHALLENGES.filter(item => answers[item.id] === item.correctIndex).length, [answers])
  const score = Math.round((correctCount / ENGINEERING_LAB_CHALLENGES.length) * 100)

  const choose = (index: number) => {
    const next = { ...answers, [challenge.id]: index }
    setAnswers(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <Layout showBack backTo="/" backLabel={lang === 'en' ? 'Course' : 'Curso'} title={lang === 'en' ? 'Engineering Decision Lab' : 'Laboratório de Decisões de Engenharia'}>
      <div className="p-4 space-y-4">
        <section className="rounded-2xl p-5" style={{ background: 'linear-gradient(145deg, #10223d, var(--c-card))', border: '1px solid #27517a' }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#7dd3fc' }}>v3.0 · Engineering Lab</div>
          <h1 className="text-xl font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{lang === 'en' ? 'Practice trade-offs, not memorized slogans' : 'Pratique decisões, não slogans decorados'}</h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{lang === 'en' ? 'Each scenario forces a choice about concurrency, data, architecture, security or delivery. Read the explanation even when you are correct.' : 'Cada cenário força uma escolha sobre concorrência, dados, arquitetura, segurança ou entrega. Leia a explicação mesmo quando acertar.'}</p>
          <div className="mt-4 flex items-center gap-3"><div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-bg)' }}><div className="h-full" style={{ width: `${score}%`, background: '#38bdf8' }} /></div><span className="text-xs" style={{ color: '#7dd3fc' }}>{correctCount}/{ENGINEERING_LAB_CHALLENGES.length}</span></div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {ENGINEERING_LAB_CHALLENGES.map((item, index) => {
            const isCorrect = answers[item.id] === item.correctIndex
            const hasAnswer = answers[item.id] !== undefined
            return <button key={item.id} onClick={() => setActive(index)} className="w-10 h-10 flex-shrink-0 rounded-full text-sm font-medium" style={{ background: index === active ? '#0c4a6e' : hasAnswer ? (isCorrect ? 'rgba(34,197,94,.16)' : 'rgba(239,68,68,.14)') : 'var(--c-card)', color: index === active ? '#bae6fd' : isCorrect ? '#4ade80' : hasAnswer ? '#f87171' : 'var(--c-muted)', border: `1px solid ${index === active ? '#38bdf8' : 'var(--c-border)'}` }}>{index + 1}</button>
          })}
        </div>

        <section className="rounded-xl p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? `Scenario ${active + 1}` : `Cenário ${active + 1}`}</div>
          <h2 className="text-lg font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{challenge.title[lang]}</h2>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{challenge.scenario[lang]}</p>
          <div className="space-y-2 mt-4">
            {challenge.options.map((option, index) => {
              const selected = answered === index
              const reveal = answered !== undefined
              const correct = index === challenge.correctIndex
              return <button key={option[lang]} onClick={() => choose(index)} className="w-full rounded-xl p-3 text-left text-sm" style={{ background: selected ? (correct ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)') : 'var(--c-bg)', border: `1px solid ${selected ? (correct ? '#22c55e' : '#ef4444') : reveal && correct ? '#22c55e' : 'var(--c-border)'}`, color: 'var(--c-text2)' }}><span className="mr-2" style={{ color: selected ? (correct ? '#4ade80' : '#f87171') : 'var(--c-muted)' }}>{String.fromCharCode(65 + index)}.</span>{option[lang]}</button>
            })}
          </div>
          {answered !== undefined && <div className="rounded-xl p-4 mt-4 text-sm leading-relaxed" style={{ background: answered === challenge.correctIndex ? 'rgba(34,197,94,.10)' : 'rgba(248,212,119,.08)', border: `1px solid ${answered === challenge.correctIndex ? '#1f6f45' : '#6b4d12'}`, color: answered === challenge.correctIndex ? '#86efac' : '#f8d477' }}><strong>{answered === challenge.correctIndex ? (lang === 'en' ? 'Correct reasoning:' : 'Raciocínio correto:') : (lang === 'en' ? 'Review the trade-off:' : 'Revise a decisão:')}</strong> {challenge.explanation[lang]}</div>}
        </section>

        <div className="grid grid-cols-2 gap-2">
          <button disabled={active === 0} onClick={() => setActive(value => Math.max(0, value - 1))} className="rounded-lg py-3 text-sm" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: active === 0 ? 'var(--c-muted)' : 'var(--c-text2)' }}>← {lang === 'en' ? 'Previous' : 'Anterior'}</button>
          <button disabled={active === ENGINEERING_LAB_CHALLENGES.length - 1} onClick={() => setActive(value => Math.min(ENGINEERING_LAB_CHALLENGES.length - 1, value + 1))} className="rounded-lg py-3 text-sm text-white" style={{ background: active === ENGINEERING_LAB_CHALLENGES.length - 1 ? 'var(--c-border)' : 'var(--c-purple)' }}>{lang === 'en' ? 'Next' : 'Próximo'} →</button>
        </div>
      </div>
    </Layout>
  )
}
