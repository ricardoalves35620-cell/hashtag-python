import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LessonBlock from '../components/LessonBlock'
import VSCodeBlock from '../components/VSCodeBlock'
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
  const [customInput, setCustomInput] = useState(day?.exercise.inputHint || '')
  const [hasRun, setHasRun] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  // Scroll to top whenever day changes
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'instant' })
    // Reset state for new day
    setTab('lesson')
    setCode(day?.exercise.starterCode || '')
    setOutput('')
    setHasRun(false)
    setShowSolution(false)
    setCustomInput(day?.exercise.inputHint || '')
  }, [id])

  if (!day) return null

  const doneDays: number[] = JSON.parse(localStorage.getItem('hp_ft_done') || '[]')
  const isDone = doneDays.includes(day.id)
  const nextDay = FASTTRACK_DAYS.find(d => !doneDays.includes(d.id) && d.id !== day.id)

  const markDone = () => {
    const updated = [...new Set([...doneDays, day.id])]
    localStorage.setItem('hp_ft_done', JSON.stringify(updated))
    const next = FASTTRACK_DAYS.find(d => !updated.includes(d.id))
    if (next) {
      navigate(`/fasttrack/${next.id}`)
    } else {
      navigate('/fasttrack')
    }
    // Scroll handled by useEffect on id change
  }

  const handleRun = async () => {
    setRunning(true)
    setOutput('')
    try {
      setPyLoading(true)
      const py = await getPyodide()
      setPyLoading(false)
      const inputs = customInput.split('\n').map(l => l.trim()).filter(l => l !== '')
      const { output: out, error } = await runCode(py, code, inputs)
      setOutput(error ? `❌ ${error}\n\n${out}` : out || '(no output)')
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
      {/* Invisible top anchor for scroll */}
      <div ref={topRef} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Day header */}
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{
            borderRadius: 12, padding: 14, marginBottom: 4,
            background: day.color + '33', border: `1px solid ${day.textColor}44`,
          }}>
            <div style={{ fontSize: 11, color: day.textColor, opacity: 0.7, marginBottom: 2 }}>
              {t.day} {day.id} of 7 · {day.duration} min
              {isDone && <span style={{ marginLeft: 8, background: '#166534', color: '#86efac', padding: '1px 6px', borderRadius: 10, fontSize: 10 }}>✓ Done</span>}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: day.textColor }}>{day.title[lang]}</div>
            <div style={{ fontSize: 12, color: day.textColor, opacity: 0.6, marginTop: 2 }}>{day.subtitle[lang]}</div>
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

            {/* VS Code editor */}
            <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 10, border: '1px solid #3e3e3e' }}>
              <div style={{
                background: '#252526', display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', borderBottom: '1px solid #3e3e3e',
              }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57','#febc2e','#28c840'].map(c => (
                    <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 13 }}>🐍</span>
                <span style={{ fontSize: 12, color: '#d4d4d4', fontFamily: 'monospace' }}>exercise.py</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#858585' }}>editable</span>
              </div>
              <div style={{ background: '#1e1e1e', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: 40,
                  background: '#1e1e1e', borderRight: '1px solid #3e3e3e',
                  display: 'flex', flexDirection: 'column', pointerEvents: 'none', paddingTop: 8,
                }}>
                  {code.split('\n').map((_, i) => (
                    <div key={i} style={{
                      fontSize: 12, color: '#858585', textAlign: 'right',
                      paddingRight: 8, lineHeight: '20px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  style={{
                    width: '100%', minHeight: 200,
                    background: 'transparent', color: '#d4d4d4',
                    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                    fontSize: 13, lineHeight: '20px',
                    padding: '8px 12px 8px 48px',
                    border: 'none', outline: 'none', resize: 'vertical',
                    caretColor: '#d4d4d4',
                  }}
                />
              </div>
            </div>

            {/* Test inputs */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                {t.testInput}
              </label>
              <div style={{ fontSize: 11, color: 'var(--c-dimmer)', marginBottom: 4 }}>{t.inputNote}</div>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                rows={Math.max(2, customInput.split('\n').length)}
                style={{
                  width: '100%', background: '#1e1e1e',
                  border: '1px solid #3e3e3e', borderRadius: 8,
                  padding: '8px 12px', fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#9cdcfe', outline: 'none', resize: 'none',
                }}
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

            {/* Output */}
            {output && (
              <div style={{
                background: '#0d0d0d', border: '1px solid #3e3e3e',
                borderRadius: 8, padding: 14, marginBottom: 10,
              }}>
                <div style={{ fontSize: 11, color: '#858585', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  {t.output}
                </div>
                <pre style={{
                  fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                  color: output.startsWith('❌') ? '#f48771' : '#4ec9b0',
                  whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6,
                }}>
                  {output}
                </pre>
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
