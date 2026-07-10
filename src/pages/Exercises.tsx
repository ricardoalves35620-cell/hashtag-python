import { useState } from 'react'
import { scrollToTop } from '../lib/scroll'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import VSCodeEditor from '../components/VSCodeEditor'
import TestInputEditor from '../components/TestInputEditor'
import ErrorExplainer from '../components/ErrorExplainer'
import { explainError, type ErrorExplanation } from '../lib/errorExplainer'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'
import { getPyodide, runCode } from '../lib/pyodide'

export default function Exercises() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))

  const [activeEx, setActiveEx] = useState(0)
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    phase?.exercises.forEach(ex => { initial[ex.id] = ex.starterCode })
    return initial
  })
  const [output, setOutput] = useState('')
  const [errorExplanation, setErrorExplanation] = useState<ErrorExplanation | null>(null)
  const [showRawError, setShowRawError] = useState(false)
  const [running, setRunning] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [hintsShown, setHintsShown] = useState<Record<string, boolean>>({})
  const [customInput, setCustomInput] = useState('')

  if (!phase || phase.exercises.length === 0) {
    return (
      <Layout showBack backTo={`/phase/${phase?.id}`} title={lang === 'en' ? 'Exercises' : 'Exercícios'}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
          <p style={{ fontSize: 14, color: 'var(--c-text2)', lineHeight: 1.6 }}>
            {lang === 'en'
              ? 'Exercises for this phase are being prepared. Complete previous phases first!'
              : 'Os exercícios desta fase estão sendo preparados. Complete as fases anteriores primeiro!'}
          </p>
          <button
            onClick={() => navigate(`/phase/${phase?.id}`)}
            style={{
              marginTop: 16, padding: '12px 24px', borderRadius: 10,
              background: 'var(--c-purple)', color: '#fff',
              fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
            }}
          >
            {lang === 'en' ? '← Back to phase' : '← Voltar para fase'}
          </button>
        </div>
      </Layout>
    )
  }

  const exercise = phase.exercises[activeEx]

  const handleExerciseChange = (idx: number) => {
    setActiveEx(idx)
    setOutput('')
    scrollToTop()
  }

  const handleRun = async () => {
    setRunning(true)
    setOutput('')
    setErrorExplanation(null)
    setShowRawError(false)
    try {
      setPyodideLoading(true)
      const py = await getPyodide()
      setPyodideLoading(false)
      const inputs = customInput.split('\n').map(l => l.trim()).filter(l => l !== '')
      const { output: out, error } = await runCode(py, codes[exercise.id], inputs)
      if (error) {
        setOutput(`❌ Error: ${error}\n\n${out}`)
        setErrorExplanation(explainError(error, codes[exercise.id]))
      } else {
        setOutput(out || '(no output)')
        setErrorExplanation(null)
      }
    } catch (e) {
      setOutput(`❌ Failed to run: ${e}`)
    } finally {
      setRunning(false)
    }
  }

  const handleComplete = async () => {
    if (!user) return
    await markStepDone(user.id, phase.id, 'exercises')
    await refreshProgress()
    navigate(`/phase/${phase.id}/quiz`)
    scrollToTop(100)
  }

  const t = {
    en: {
      exercise: 'Exercise', of: 'of', run: 'Run Code', running: 'Running...',
      loading: 'Loading Python...', hint: 'Show hints', hideHint: 'Hide hints',
      output: 'Output', input: 'Test inputs (one per line)',
      complete: 'All done — go to mini-test →', next: 'Next exercise →',
      phase: 'Phase', sampleOutput: 'Expected output',
    },
    pt: {
      exercise: 'Exercício', of: 'de', run: 'Executar', running: 'Executando...',
      loading: 'Carregando Python...', hint: 'Ver dicas', hideHint: 'Esconder dicas',
      output: 'Saída', input: 'Entradas de teste (uma por linha)',
      complete: 'Tudo pronto — ir para mini-teste →', next: 'Próximo exercício →',
      phase: 'Fase', sampleOutput: 'Saída esperada',
    }
  }[lang]

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.phase} ${phase.id}`}
      title={`${t.exercise} · ${phase.title[lang]}`}
    >
      <div style={{ padding: '12px 16px' }}>

        {/* Exercise tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {phase.exercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => handleExerciseChange(i)}
              style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: i === activeEx ? 'var(--c-purple)' : 'var(--c-card)',
                color: i === activeEx ? '#fff' : 'var(--c-muted)',
                border: i === activeEx ? 'none' : '0.5px solid var(--c-border)',
                cursor: 'pointer', minHeight: 36,
              }}
            >
              {t.exercise} {i + 1}
            </button>
          ))}
        </div>

        {/* Exercise description */}
        <div style={{
          background: 'var(--c-card)', border: '0.5px solid var(--c-border)',
          borderRadius: 12, padding: 14, marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>
            {exercise.title[lang]}
          </div>
          <p style={{ fontSize: 13, color: 'var(--c-text2)', margin: 0, lineHeight: 1.6 }}>
            {exercise.description[lang]}
          </p>

          {exercise.sampleOutput && (
            <div style={{ marginTop: 10, background: 'var(--c-bg)', borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 4 }}>{t.sampleOutput}:</div>
              <pre style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: '#4ec9b0', margin: 0 }}>
                {exercise.sampleOutput[lang]}
              </pre>
            </div>
          )}
        </div>

        {/* VS Code Editor */}
        <VSCodeEditor
          value={codes[exercise.id]}
          onChange={(val) => setCodes(prev => ({ ...prev, [exercise.id]: val }))}
          filename={`exercise_${activeEx + 1}.py`}
          height="260px"
          label={lang === 'en' ? 'editable' : 'editável'}
        />

        {/* Test inputs — smart labels from input() calls */}
        <div style={{ marginTop: 10 }}>
          <TestInputEditor
            code={codes[exercise.id]}
            value={customInput}
            onChange={setCustomInput}
            lang={lang}
          />
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={running || pyodideLoading}
          style={{
            width: '100%', marginTop: 10, padding: '12px',
            borderRadius: 10, background: '#1e1e1e',
            border: '1px solid #3e3e3e', color: '#dcdcaa',
            fontSize: 14, fontWeight: 500,
            cursor: running ? 'not-allowed' : 'pointer',
            opacity: running ? 0.6 : 1,
          }}
        >
          {pyodideLoading ? t.loading : running ? t.running : `▶ ${t.run}`}
        </button>

        {/* Output + Error Explainer */}
        {output && !errorExplanation && (
          <div style={{
            marginTop: 10, background: '#0d0d0d',
            border: '1px solid #3e3e3e', borderRadius: 8, padding: 14,
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
          <div style={{ marginTop: 10 }}>
            <ErrorExplainer
              explanation={errorExplanation}
              lang={lang}
              rawError={output}
              showRaw={showRawError}
              onToggleRaw={() => setShowRawError(r => !r)}
            />
          </div>
        )}

        {/* Hints */}
        {exercise.hints.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setHintsShown(prev => ({ ...prev, [exercise.id]: !prev[exercise.id] }))}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: 'var(--c-purple-l)', fontSize: 13, cursor: 'pointer',
              }}
            >
              💡 {hintsShown[exercise.id] ? t.hideHint : t.hint}
            </button>
            {hintsShown[exercise.id] && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {exercise.hints.map((hint, i) => (
                  <div key={i} style={{
                    fontSize: 13, background: 'var(--c-purple-f)',
                    border: '0.5px solid var(--c-purple-dm)',
                    borderRadius: 8, padding: '8px 12px', color: 'var(--c-purple-l)',
                  }}>
                    {hint[lang]}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ marginTop: 16 }}>
          {activeEx < phase.exercises.length - 1 ? (
            <button
              onClick={() => handleExerciseChange(activeEx + 1)}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: 'var(--c-card)', border: '0.5px solid var(--c-border)',
                color: 'var(--c-text)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}
            >
              {t.next}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: 'var(--c-purple)', color: '#fff',
                fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
              }}
            >
              {t.complete}
            </button>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
