import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LessonBlock from '../components/LessonBlock'
import CodeEditor from '../components/CodeEditor'
import { useApp } from '../contexts/AppContext'
import { FASTTRACK_DAYS } from '../data/fasttrack'
import { getPyodide, runCode } from '../lib/pyodide'

type Tab = 'lesson' | 'exercise'

export default function FastTrackDay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang } = useApp()
  const day = FASTTRACK_DAYS.find(d => d.id === Number(id))

  const [tab, setTab] = useState<Tab>('lesson')
  const [code, setCode] = useState(day?.exercise.starterCode || '')
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [pyLoading, setPyLoading] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [customInput, setCustomInput] = useState('')

  if (!day) return null

  const doneDays: number[] = JSON.parse(localStorage.getItem('hp_ft_done') || '[]')
  const isDone = doneDays.includes(day.id)
  const isAlreadyDone = isDone

  const markDone = () => {
    const updated = [...new Set([...doneDays, day.id])]
    localStorage.setItem('hp_ft_done', JSON.stringify(updated))
    const nextDay = FASTTRACK_DAYS.find(d => !updated.includes(d.id))
    if (nextDay) navigate(`/fasttrack/${nextDay.id}`)
    else navigate('/fasttrack')
  }

  const handleRun = async () => {
    setRunning(true)
    setOutput('')
    try {
      setPyLoading(true)
      const py = await getPyodide()
      setPyLoading(false)
      const inputs = customInput.split('\n').filter(l => l.trim())
      const { output: out, error } = await runCode(py, code, inputs)
      setOutput(error ? `❌ ${error}\n\n${out}` : out || '(no output)')
    } catch (e) {
      setOutput(`Error: ${e}`)
    } finally {
      setRunning(false)
    }
  }

  const t = {
    en: { lesson: 'Lesson', exercise: 'Exercise', day: 'Day', run: 'Run Code', running: 'Running...', loading: 'Loading Python...', solution: 'Show solution', hideSolution: 'Hide solution', markDone: 'Mark as done →', alreadyDone: 'Revisit ↩', skip: 'Skip day', testInput: 'Test inputs (one per line)', output: 'Output', outcome: 'After this day' },
    pt: { lesson: 'Aula', exercise: 'Exercício', day: 'Dia', run: 'Executar', running: 'Executando...', loading: 'Carregando Python...', solution: 'Ver solução', hideSolution: 'Esconder solução', markDone: 'Marcar como feito →', alreadyDone: 'Revisar ↩', skip: 'Pular dia', testInput: 'Entradas de teste (uma por linha)', output: 'Saída', outcome: 'Após este dia' }
  }[lang]

  return (
    <Layout
      showBack
      backTo="/fasttrack"
      backLabel="FastTrack"
      title={`${t.day} ${day.id}`}
    >
      <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 64px)' }}>

        {/* Day header */}
        <div className="px-4 pt-4 pb-2">
          <div className="rounded-xl p-4" style={{ background: day.color, border: `1px solid ${day.textColor}33` }}>
            <div className="text-xs font-medium mb-1" style={{ color: day.textColor, opacity: 0.7 }}>
              {t.day} {day.id} of 7 · {day.duration} min
            </div>
            <div className="text-base font-medium" style={{ color: day.textColor }}>{day.title[lang]}</div>
            <div className="text-xs mt-0.5" style={{ color: day.textColor, opacity: 0.6 }}>{day.subtitle[lang]}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-0 border-b" style={{ borderColor: 'var(--c-border)' }}>
          {(['lesson', 'exercise'] as Tab[]).map(t_ => (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderColor: tab === t_ ? 'var(--c-purple)' : 'transparent',
                color: tab === t_ ? 'var(--c-purple-l)' : 'var(--c-muted)',
                minHeight: 44,
              }}
            >
              {t_ === 'lesson' ? t.lesson : t.exercise}
            </button>
          ))}
        </div>

        {/* Lesson tab */}
        {tab === 'lesson' && (
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {day.blocks.map((block, i) => (
              <LessonBlock key={i} block={block as any} lang={lang} />
            ))}

            {/* Outcome */}
            <div className="rounded-xl p-4 mt-4" style={{ background: 'var(--c-purple-f)', border: `1px solid ${day.color}` }}>
              <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--c-purple-l)' }}>
                {t.outcome}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{day.outcome[lang]}</p>
            </div>

            <button
              onClick={() => setTab('exercise')}
              className="w-full py-3.5 rounded-xl text-sm font-medium text-white mt-4"
              style={{ background: 'var(--c-purple)' }}
            >
              {lang === 'en' ? 'Go to exercise →' : 'Ir para exercício →'}
            </button>
          </div>
        )}

        {/* Exercise tab */}
        {tab === 'exercise' && (
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {/* Exercise description */}
            <div className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '0.5px solid var(--c-border)' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--c-text)' }}>
                {day.exercise.title[lang]}
              </div>
              <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
                {day.exercise.description[lang]}
              </p>
            </div>

            {/* Code editor */}
            <CodeEditor value={code} onChange={setCode} height="220px" />

            {/* Test inputs */}
            <div>
              <label className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: 'var(--c-muted)' }}>{t.testInput}</label>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                rows={3}
                className="w-full rounded-xl px-3 py-2 text-sm font-mono resize-none focus:outline-none"
                style={{ background: 'var(--c-card)', border: '0.5px solid var(--c-border)', color: 'var(--c-purple-l)' }}
                placeholder="Ricardo&#10;1992&#10;Oshawa"
              />
            </div>

            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={running || pyLoading}
              className="w-full py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
              style={{ background: 'var(--c-card)', border: '0.5px solid var(--c-border)', color: 'var(--c-purple-l)' }}
            >
              {pyLoading ? t.loading : running ? t.running : `▶ ${t.run}`}
            </button>

            {/* Output */}
            {output && (
              <div className="rounded-xl p-4" style={{ background: '#040410', border: '0.5px solid var(--c-border)' }}>
                <div className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--c-muted)' }}>{t.output}</div>
                <pre className={`text-sm font-mono whitespace-pre-wrap ${output.startsWith('❌') ? 'text-red-400' : 'text-green-300'}`}>
                  {output}
                </pre>
              </div>
            )}

            {/* Solution toggle */}
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-sm transition-colors"
              style={{ color: 'var(--c-purple-l)' }}
            >
              💡 {showSolution ? t.hideSolution : t.solution}
            </button>

            {showSolution && (
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${day.color}` }}>
                <div className="px-4 py-2 text-xs font-medium" style={{ background: day.color, color: day.textColor }}>
                  Solution
                </div>
                <pre className="p-4 text-sm font-mono overflow-x-auto" style={{ background: 'var(--c-code-bg)', color: 'var(--c-purple-l)' }}>
                  {day.exercise.solution}
                </pre>
              </div>
            )}

            {/* Mark done / skip */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={markDone}
                className="flex-1 py-3.5 rounded-xl text-sm font-medium text-white"
                style={{ background: isAlreadyDone ? '#166534' : 'var(--c-purple)' }}
              >
                {isAlreadyDone ? t.alreadyDone : t.markDone}
              </button>
              {!isAlreadyDone && (
                <button
                  onClick={markDone}
                  className="px-4 py-3.5 rounded-xl text-sm"
                  style={{ border: '0.5px solid var(--c-border)', color: 'var(--c-muted)' }}
                >
                  {t.skip}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
