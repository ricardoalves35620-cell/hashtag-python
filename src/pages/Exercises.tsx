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
import { preparePythonEngine } from '../lib/pyodide'
import { gradeExercise, type ValidationItem } from '../lib/learningValidation'
import { getSkillsForPhase } from '../data/skills'
import { extractErrorCategory } from '../lib/learningEngine'

export default function Exercises() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, learnerId, refreshProgress, recordLearningAttempt } = useApp()
  const phase = ALL_PHASES.find(item => item.id === Number(id))

  const [activeEx, setActiveEx] = useState(0)
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    phase?.exercises.forEach(exercise => { initial[exercise.id] = exercise.starterCode })
    return initial
  })
  const [output, setOutput] = useState('')
  const [errorExplanation, setErrorExplanation] = useState<ErrorExplanation | null>(null)
  const [showRawError, setShowRawError] = useState(false)
  const [running, setRunning] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [hintLevels, setHintLevels] = useState<Record<string, number>>({})
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [validated, setValidated] = useState<Record<string, boolean>>({})
  const [validationMessage, setValidationMessage] = useState('')
  const [validationChecks, setValidationChecks] = useState<Record<string, ValidationItem[]>>({})

  if (!phase || phase.exercises.length === 0) {
    return (
      <Layout showBack backTo={`/phase/${phase?.id}`} title={lang === 'en' ? 'Exercises' : 'Exercícios'}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
          <p style={{ fontSize: 14, color: 'var(--c-text2)', lineHeight: 1.6 }}>
            {lang === 'en' ? 'Exercises for this phase are being prepared.' : 'Os exercícios desta fase estão sendo preparados.'}
          </p>
        </div>
      </Layout>
    )
  }

  const exercise = phase.exercises[activeEx]
  const currentValidated = Boolean(validated[exercise.id])
  const allValidated = phase.exercises.every(item => validated[item.id])

  const changeExercise = (index: number) => {
    setActiveEx(index)
    setOutput('')
    setValidationMessage('')
    setErrorExplanation(null)
    scrollToTop()
  }

  const handleRun = async () => {
    setRunning(true)
    setOutput('')
    setValidationMessage('')
    setErrorExplanation(null)
    setShowRawError(false)
    try {
      setPyodideLoading(true)
      await preparePythonEngine()
      setPyodideLoading(false)

      const inputText = customInputs[exercise.id] || ''
      const inputs = inputText.split('\n').map(line => line.trim()).filter(Boolean)
      const grade = await gradeExercise(exercise, phase.id, lang, codes[exercise.id], inputs)

      setOutput(grade.output || (grade.error ? '' : '(no output)'))
      setValidationChecks(previous => ({ ...previous, [exercise.id]: grade.checks }))
      setValidated(previous => ({ ...previous, [exercise.id]: grade.passed }))
      setValidationMessage(grade.message)

      const passedChecks = grade.checks.filter(check => check.passed).length
      const attemptScore = grade.checks.length ? Math.round((passedChecks / grade.checks.length) * 100) : 0
      recordLearningAttempt({
        phaseId: phase.id,
        activity: 'exercise',
        itemId: exercise.id,
        skillIds: getSkillsForPhase(phase.id),
        score: grade.passed ? 100 : attemptScore,
        passed: grade.passed,
        hintsUsed: hintLevels[exercise.id] || 0,
        errorCategory: extractErrorCategory(grade.error, grade.timedOut),
      })

      if (grade.error) {
        setOutput(`❌ Error: ${grade.error}\n\n${grade.output}`)
        setErrorExplanation(explainError(grade.error, codes[exercise.id]))
      }
    } catch (error) {
      setOutput(`❌ Failed to run: ${error}`)
      setValidated(previous => ({ ...previous, [exercise.id]: false }))
      setValidationChecks(previous => ({ ...previous, [exercise.id]: [] }))
    } finally {
      setRunning(false)
      setPyodideLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!learnerId || !allValidated) return
    await markStepDone(learnerId, phase.id, 'exercises')
    await refreshProgress()
    navigate(`/phase/${phase.id}/quiz`)
    scrollToTop(100)
  }

  const t = {
    en: {
      exercise: 'Exercise', run: 'Run and validate', running: 'Running...', loading: 'Loading Python...',
      hint: 'Reveal first hint', nextHint: 'Reveal next hint', allHints: 'All hints revealed', output: 'Output', complete: 'All validated — go to knowledge check →',
      next: 'Next exercise →', phase: 'Phase', sampleOutput: 'Expected output',
      lockedNext: 'Run this exercise successfully to continue.', validated: 'Validated'
    },
    pt: {
      exercise: 'Exercício', run: 'Executar e validar', running: 'Executando...', loading: 'Carregando Python...',
      hint: 'Revelar primeira dica', nextHint: 'Revelar próxima dica', allHints: 'Todas as dicas reveladas', output: 'Saída', complete: 'Todos validados — ir para verificação →',
      next: 'Próximo exercício →', phase: 'Fase', sampleOutput: 'Saída esperada',
      lockedNext: 'Execute este exercício corretamente para continuar.', validated: 'Validado'
    }
  }[lang]

  return (
    <Layout showBack backTo={`/phase/${phase.id}`} backLabel={`${t.phase} ${phase.id}`} title={`${t.exercise} · ${phase.title[lang]}`}>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {phase.exercises.map((item, index) => (
            <button
              key={item.id}
              onClick={() => changeExercise(index)}
              style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                background: index === activeEx ? 'var(--c-purple)' : validated[item.id] ? 'rgba(34,197,94,.14)' : 'var(--c-card)',
                color: index === activeEx ? '#fff' : validated[item.id] ? '#4ade80' : 'var(--c-muted)',
                border: index === activeEx ? '1px solid var(--c-purple)' : validated[item.id] ? '1px solid #1f6f45' : '1px solid var(--c-border)'
              }}
            >
              {validated[item.id] ? '✓ ' : ''}{t.exercise} {index + 1}
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-text)', marginBottom: 6 }}>{exercise.title[lang]}</div>
          <p style={{ fontSize: 13, color: 'var(--c-text2)', margin: 0, lineHeight: 1.6 }}>{exercise.description[lang]}</p>
          {exercise.sampleOutput && (
            <div style={{ marginTop: 10, background: 'var(--c-bg)', borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 4 }}>{t.sampleOutput}:</div>
              <pre style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: '#4ec9b0', margin: 0, whiteSpace: 'pre-wrap' }}>{exercise.sampleOutput[lang]}</pre>
            </div>
          )}
        </div>

        <VSCodeEditor
          value={codes[exercise.id]}
          onChange={value => {
            setCodes(previous => ({ ...previous, [exercise.id]: value }))
            setValidated(previous => ({ ...previous, [exercise.id]: false }))
            setValidationMessage('')
            setValidationChecks(previous => ({ ...previous, [exercise.id]: [] }))
          }}
          filename={`exercise_${activeEx + 1}.py`}
          height="260px"
          label={lang === 'en' ? 'editable' : 'editável'}
        />

        <div style={{ marginTop: 10 }}>
          <TestInputEditor
            code={codes[exercise.id]}
            value={customInputs[exercise.id] || ''}
            onChange={value => setCustomInputs(previous => ({ ...previous, [exercise.id]: value }))}
            lang={lang}
          />
        </div>

        <button
          onClick={handleRun}
          disabled={running || pyodideLoading}
          style={{
            width: '100%', marginTop: 10, padding: '12px', borderRadius: 10,
            background: '#1e1e1e', border: '1px solid #3e3e3e', color: '#dcdcaa',
            fontSize: 14, fontWeight: 500, opacity: running ? 0.6 : 1
          }}
        >
          {pyodideLoading ? t.loading : running ? t.running : `▶ ${t.run}`}
        </button>

        {validationMessage && (
          <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 9, fontSize: 13, background: currentValidated ? 'rgba(34,197,94,.12)' : 'rgba(245,158,11,.12)', border: `1px solid ${currentValidated ? '#1f6f45' : '#7c5a13'}`, color: currentValidated ? '#4ade80' : '#f8d477' }}>
            {currentValidated ? '✅ ' : '🧭 '}{validationMessage}
          </div>
        )}

        {(validationChecks[exercise.id]?.length || 0) > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {validationChecks[exercise.id].map(check => (
              <div key={check.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 11px', borderRadius: 8,
                background: check.passed ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)',
                border: `1px solid ${check.passed ? '#1f6f45' : '#7f1d1d'}`,
                color: check.passed ? '#86efac' : '#fca5a5', fontSize: 12, lineHeight: 1.5,
              }}>
                <span>{check.passed ? '✓' : '×'}</span>
                <span style={{ flex: 1 }}>{check.hidden ? '🔒 ' : ''}{check.label}{check.detail ? ` · ${check.detail}` : ''}</span>
              </div>
            ))}
          </div>
        )}

        {output && !errorExplanation && (
          <div style={{ marginTop: 10, background: '#0d0d0d', border: '1px solid #3e3e3e', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#858585', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{t.output}</div>
            <pre style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: '#4ec9b0', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6 }}>{output}</pre>
          </div>
        )}

        {errorExplanation && (
          <div style={{ marginTop: 10 }}>
            <ErrorExplainer explanation={errorExplanation} lang={lang} rawError={output} showRaw={showRawError} onToggleRaw={() => setShowRawError(value => !value)} />
          </div>
        )}

        {exercise.hints.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setHintLevels(previous => ({
                ...previous,
                [exercise.id]: Math.min((previous[exercise.id] || 0) + 1, exercise.hints.length),
              }))}
              disabled={(hintLevels[exercise.id] || 0) >= exercise.hints.length}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--c-purple-l)', fontSize: 13, opacity: (hintLevels[exercise.id] || 0) >= exercise.hints.length ? 0.65 : 1 }}
            >
              💡 {(hintLevels[exercise.id] || 0) === 0 ? t.hint : (hintLevels[exercise.id] || 0) < exercise.hints.length ? t.nextHint : t.allHints}
              {(hintLevels[exercise.id] || 0) > 0 ? ` · ${hintLevels[exercise.id]}/${exercise.hints.length}` : ''}
            </button>
            {(hintLevels[exercise.id] || 0) > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {exercise.hints.slice(0, hintLevels[exercise.id] || 0).map((hint, index) => (
                  <div key={index} style={{ fontSize: 13, background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)', borderRadius: 8, padding: '8px 12px', color: 'var(--c-purple-l)' }}>
                    <strong>{lang === 'en' ? `Hint ${index + 1}: ` : `Dica ${index + 1}: `}</strong>{hint[lang]}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          {activeEx < phase.exercises.length - 1 ? (
            <button
              onClick={() => currentValidated && changeExercise(activeEx + 1)}
              disabled={!currentValidated}
              title={!currentValidated ? t.lockedNext : undefined}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: currentValidated ? 'var(--c-card)' : 'var(--c-bg)', border: '1px solid var(--c-border)',
                color: currentValidated ? 'var(--c-text)' : 'var(--c-muted)', fontSize: 14, fontWeight: 500, opacity: currentValidated ? 1 : 0.65
              }}
            >
              {currentValidated ? t.next : `🔒 ${t.lockedNext}`}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!allValidated}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: allValidated ? 'var(--c-purple)' : 'var(--c-bg)', color: allValidated ? '#fff' : 'var(--c-muted)',
                fontSize: 14, fontWeight: 500, border: `1px solid ${allValidated ? 'var(--c-purple)' : 'var(--c-border)'}`, opacity: allValidated ? 1 : 0.65
              }}
            >
              {allValidated ? t.complete : `🔒 ${t.lockedNext}`}
            </button>
          )}
        </div>
        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
