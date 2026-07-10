import { useState, useEffect } from 'react'
import { scrollToTop } from '../lib/scroll'
import { loadFTProgress, markFTDayDone } from '../lib/fasttrackProgress'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LessonBlock from '../components/LessonBlock'
import VSCodeBlock from '../components/VSCodeBlock'
import VSCodeEditor from '../components/VSCodeEditor'
import TestInputEditor from '../components/TestInputEditor'
import ErrorExplainer from '../components/ErrorExplainer'
import { explainError, type ErrorExplanation } from '../lib/errorExplainer'
import { useApp } from '../contexts/AppContext'
import { FASTTRACK_DAYS } from '../data/fasttrack'
import { getPyodide, runCode } from '../lib/pyodide'

type Tab = 'lesson' | 'exercise'

export default function FastTrackDay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user } = useApp()
  const day = FASTTRACK_DAYS.find(d => d.id === Number(id))

  const [tab, setTab] = useState<Tab>('lesson')
  const [code, setCode] = useState(day?.exercise.starterCode || '')
  const [output, setOutput] = useState('')
  const [errorExplanation, setErrorExplanation] = useState<ErrorExplanation | null>(null)
  const [showRawError, setShowRawError] = useState(false)
  const [running, setRunning] = useState(false)
  const [pyLoading, setPyLoading] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [customInput, setCustomInput] = useState(day?.exercise.inputHint || '')
  const [hasRun, setHasRun] = useState(false)

  // Scroll to top whenever day changes
  useEffect(() => {
    scrollToTop()
    // Reset state for new day
    setTab('lesson')
    setCode(day?.exercise.starterCode || '')
    setOutput('')
    setHasRun(false)
    setShowSolution(false)
    setCustomInput(day?.exercise.inputHint || '')
  }, [id])

  if (!day) return null

  const [doneDays, setDoneDays] = useState<number[]>([])
  const isDone = doneDays.includes(day.id)
  const nextDay = FASTTRACK_DAYS.find(d => !doneDays.includes(d.id) && d.id !== day.id)

  // Load progress from Supabase on mount
  useEffect(() => {
    if (user) loadFTProgress(user.id).then(setDoneDays)
  }, [user])

  const markDone = async () => {
    if (!user) return
    const updated = await markFTDayDone(user.id, day.id)
    const next = FASTTRACK_DAYS.find(d => !updated.includes(d.id))
    if (next) {
      navigate(`/fasttrack/${next.id}`)
    } else {
      navigate('/fasttrack')
    }
    scrollToTop(100)
  }

  const handleRun = async () => {
    setRunning(true)
    setOutput('')
    setErrorExplanation(null)
    setErrorExplanation(null)
    setShowRawError(false)
    try {
      setPyLoading(true)
      const py = await getPyodide()
      setPyLoading(false)
      const inputs = customInput.split('\n').map(l => l.trim()).filter(l => l !== '')
      const { output: out, error } = await runCode(py, code, inputs)
      if (error) {
        setOutput(`❌ ${error}\n\n${out}`)
        setErrorExplanation(explainError(error, code))
      } else {
        setOutput(out || '(no output)')
        setErrorExplanation(null)
      }
      setHasRun(true)
    } catch (e) {
      setOutput(`Error: ${e}`)
    } finally {
      setRunning(false)
    }
  }

  const t = {
    en: {
      lesson: 'Lesson', exercise: 'Exercise', day: 'Day',
      run: 'Run Code', running: 'Running...', loading: 'Loading Python...',
      solution: 'Show solution', hideSolution: 'Hide solution',
      markDone: isDone ? '↩ Revisit next' : '✓ Complete & continue',
      alreadyDone: isDone ? '↩ Go to next' : '✓ Mark as done',
      testInput: 'Test inputs (one per line)',
      output: 'Output', outcome: 'After this day',
      inputNote: 'These are example inputs — edit as needed.',
      goExercise: 'Go to exercise →',
    },
    pt: {
      lesson: 'Aula', exercise: 'Exercício', day: 'Dia',
      run: 'Executar', running: 'Executando...', loading: 'Carregando Python...',
      solution: 'Ver solução', hideSolution: 'Esconder solução',
      markDone: isDone ? '↩ Ir para o próximo' : '✓ Concluir e continuar',
      alreadyDone: isDone ? '↩ Ir para o próximo' : '✓ Marcar como feito',
      testInput: 'Entradas de teste (uma por linha)',
      output: 'Saída', outcome: 'Após este dia',
      inputNote: 'Estas são entradas de exemplo — edite se necessário.',
      goExercise: 'Ir para exercício →',
    }
  }[lang]

  return (
    <Layout showBack backTo="/fasttrack" backLabel="FastTrack" title={`${t.day} ${day.id}`}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Day header */}
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{
            borderRadius: 12, padding: 14, marginBottom: 4,
            background: 'var(--c-card)',
            border: '0.5px solid var(--c-border)',
            borderLeft: `3px solid ${day.textColor}`,
          }}>
            <div style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 4 }}>
              {t.day} {day.id} of 7 · {day.duration} min
              {isDone && <span style={{ marginLeft: 8, background: '#166534', color: '#86efac', padding: '1px 6px', borderRadius: 10, fontSize: 10 }}>✓ Done</span>}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--c-text)' }}>{day.title[lang]}</div>
            <div style={{ fontSize: 12, color: 'var(--c-text2)', marginTop: 3 }}>{day.subtitle[lang]}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid var(--c-border)', padding: '0 16px' }}>
          {(['lesson', 'exercise'] as Tab[]).map(tabId => (
            <button key={tabId} onClick={() => setTab(tabId)} style={{
              padding: '10px 16px', fontSize: 14,
              fontWeight: tab === tabId ? 500 : 400,
              color: tab === tabId ? 'var(--c-purple-l)' : 'var(--c-muted)',
              borderBottom: `2px solid ${tab === tabId ? 'var(--c-purple)' : 'transparent'}`,
              background: 'none', border: 'none',
              borderBottomWidth: 2, borderBottomStyle: 'solid',
              borderBottomColor: tab === tabId ? 'var(--c-purple)' : 'transparent',
              cursor: 'pointer', minHeight: 44,
            }}>
              {tabId === 'lesson' ? t.lesson : t.exercise}
            </button>
          ))}
        </div>

        {/* ── LESSON TAB ── */}
        {tab === 'lesson' && (
          <div style={{ padding: '12px 16px' }}>
            {day.blocks.map((block, i) => (
              <LessonBlock key={i} block={block as any} lang={lang} />
            ))}

            <div style={{
              borderRadius: 10, padding: 14, marginTop: 16,
              background: 'var(--c-purple-f)', border: `1px solid ${day.color}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--c-purple-l)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                {t.outcome}
              </div>
              <p style={{ fontSize: 13, color: 'var(--c-text2)', lineHeight: 1.6, margin: 0 }}>
                {day.outcome[lang]}
              </p>
            </div>

            <button onClick={() => setTab('exercise')} style={{
              width: '100%', padding: '14px', borderRadius: 12, marginTop: 16,
              background: 'var(--c-purple)', color: '#fff',
              fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
            }}>
              {t.goExercise}
            </button>
            <div style={{ height: 16 }} />
          </div>
        )}

        {/* ── EXERCISE TAB ── */}
        {tab === 'exercise' && (
          <div style={{ padding: '12px 16px' }}>

            {/* Description */}
            <div style={{
              background: 'var(--c-card)', border: '0.5px solid var(--c-border)',
              borderRadius: 12, padding: 14, marginBottom: 10,
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>
                {day.exercise.title[lang]}
              </div>
              <p style={{ fontSize: 13, color: 'var(--c-text2)', margin: 0, lineHeight: 1.6 }}>
                {day.exercise.description[lang]}
              </p>
            </div>

            {/* VS Code Editor (CodeMirror) */}
            <VSCodeEditor
              value={code}
              onChange={setCode}
              filename="exercise.py"
              height="220px"
              label={lang === 'en' ? 'editable' : 'editável'}
            />

            {/* Test inputs — smart labels */}
            <div style={{ marginBottom: 8 }}>
              <TestInputEditor
                code={code}
                value={customInput}
                onChange={setCustomInput}
                lang={lang}
              />
            </div>

            {/* Run */}
            <button onClick={handleRun} disabled={running || pyLoading} style={{
              width: '100%', padding: '12px', borderRadius: 10, marginBottom: 8,
              background: '#1e1e1e', border: '1px solid #3e3e3e',
              color: '#dcdcaa', fontSize: 14, fontWeight: 500,
              cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.6 : 1,
            }}>
              {pyLoading ? t.loading : running ? t.running : `▶ ${t.run}`}
            </button>

            {/* Output / Error Explainer */}
            {output && !errorExplanation && (
              <div style={{
                background: '#0d0d0d', border: '1px solid #3e3e3e',
                borderRadius: 8, padding: 14, marginBottom: 10,
              }}>
                <div style={{ fontSize: 11, color: '#858585', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  {t.output}
                </div>
                <pre style={{
                  fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                  color: '#4ec9b0', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6,
                }}>
                  {output}
                </pre>
              </div>
            )}
            {errorExplanation && (
              <div style={{ marginBottom: 10 }}>
                <ErrorExplainer
                  explanation={errorExplanation}
                  lang={lang}
                  rawError={output}
                  showRaw={showRawError}
                  onToggleRaw={() => setShowRawError(r => !r)}
                />
              </div>
            )}

            {/* Solution */}
            <button onClick={() => setShowSolution(!showSolution)} style={{
              background: 'none', border: 'none', padding: 0,
              color: 'var(--c-purple-l)', fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
            }}>
              💡 {showSolution ? t.hideSolution : t.solution}
            </button>

            {showSolution && (
              <VSCodeBlock code={day.exercise.solution} filename="solution.py" />
            )}

            {/* Single complete button — no more "Skip" */}
            <button onClick={markDone} style={{
              width: '100%', padding: '14px', borderRadius: 12, marginTop: 8,
              background: isDone ? '#166534' : 'var(--c-purple)',
              color: '#fff', fontSize: 14, fontWeight: 500,
              border: 'none', cursor: 'pointer',
            }}>
              {isDone ? t.alreadyDone : t.markDone}
            </button>

            <div style={{ height: 16 }} />
          </div>
        )}
      </div>
    </Layout>
  )
}
