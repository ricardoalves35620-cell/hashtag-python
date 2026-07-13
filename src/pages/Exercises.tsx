import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import VSCodeEditor from '../components/VSCodeEditor'
import TestInputEditor from '../components/TestInputEditor'
import ErrorExplainer from '../components/ErrorExplainer'
import ExerciseFeedback from '../components/ExerciseFeedback'
import LearningBrief from '../components/LearningBrief'
import { Alert, Badge, Button, Card, Progress } from '../components/ui'
import { explainError, type ErrorExplanation } from '../lib/errorExplainer'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'
import { preparePythonEngine } from '../lib/pyodide'
import { gradeExercise, type ValidationItem } from '../lib/learningValidation'
import { getSkillsForPhase } from '../data/skills'
import { extractErrorCategory } from '../lib/learningEngine'
import { chooseNewestDraft, fetchRemoteDraft, loadLocalDraft, saveLocalDraft, saveRemoteDraft } from '../lib/codeDrafts'
import { scrollToTop } from '../lib/scroll'
import { getExercisePedagogy } from '../lib/pedagogy'
import { resolveLocalizedCode } from '../lib/localization'

interface AttemptView {
  id: string
  time: string
  passed: boolean
  output: string
  checks: number
  passedChecks: number
}

export default function Exercises() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, learnerId, user, refreshProgress, recordLearningAttempt } = useApp()
  const phase = ALL_PHASES.find(item => item.id === Number(id))

  const [activeEx, setActiveEx] = useState(0)
  const [codes, setCodes] = useState<Record<string, string>>(() => Object.fromEntries(phase?.exercises.map(ex => [ex.id, resolveLocalizedCode(ex.starterCode, lang)]) || []))
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
  const [attempts, setAttempts] = useState<Record<string, AttemptView[]>>({})
  const [predictions, setPredictions] = useState<Record<string, string>>({})
  const [changePlans, setChangePlans] = useState<Record<string, string>>({})
  const [observationRuns, setObservationRuns] = useState<Record<string, boolean>>({})
  const [draftStatus, setDraftStatus] = useState<'loading' | 'saved' | 'local' | 'idle'>('loading')
  const [hydratedDraftKey, setHydratedDraftKey] = useState<string | null>(null)
  const saveTimer = useRef<number | null>(null)
  const draftLoadToken = useRef(0)
  const lastEditAt = useRef(0)

  if (!phase || phase.exercises.length === 0) {
    return <Layout showBack backTo={`/phase/${phase?.id}`} title={lang === 'en' ? 'Exercises' : 'Exercícios'}><div className="page-shell"><Alert variant="info">{lang === 'en' ? 'Exercises for this phase are being prepared.' : 'Os exercícios desta fase estão sendo preparados.'}</Alert></div></Layout>
  }

  const exercise = phase.exercises[activeEx]
  const currentValidated = Boolean(validated[exercise.id])
  const isFirstExercise = activeEx === 0
  const starterCode = resolveLocalizedCode(exercise.starterCode, lang)
  const codeChanged = (codes[exercise.id] ?? starterCode).trim() !== starterCode.trim()
  const thinkingReady = (predictions[exercise.id] || '').trim().length >= 10 && (changePlans[exercise.id] || '').trim().length >= 3
  const allValidated = phase.exercises.every(item => validated[item.id])
  const checks = validationChecks[exercise.id] || []
  const passedChecks = checks.filter(check => check.passed).length
  const draftKey = `${learnerId || 'anonymous'}:${phase.id}:${exercise.id}`
  const learningBrief = useMemo(() => getExercisePedagogy(phase, exercise, activeEx, lang), [phase, exercise, activeEx, lang])

  useEffect(() => {
    let cancelled = false
    const token = ++draftLoadToken.current
    const loadStartedAt = Date.now()

    const load = async () => {
      setHydratedDraftKey(null)

      if (!learnerId) {
        setDraftStatus('idle')
        return
      }

      setDraftStatus('loading')
      const local = loadLocalDraft(learnerId, phase.id, exercise.id)

      // Restore the local copy immediately. This prevents a slow network request
      // from leaving the editor on starter code or overwriting a new edit.
      if (local) {
        setCodes(previous => ({ ...previous, [exercise.id]: local.code }))
        setCustomInputs(previous => ({ ...previous, [exercise.id]: local.inputs }))
        setDraftStatus('local')
      }

      const remote = user ? await fetchRemoteDraft(user.id, phase.id, exercise.id) : null
      if (cancelled || token !== draftLoadToken.current) return

      // Only apply the cloud copy when the learner has not typed since loading
      // started. User input always wins over a late network response.
      if (lastEditAt.current <= loadStartedAt) {
        const chosen = chooseNewestDraft(local, remote)
        if (chosen) {
          setCodes(previous => ({ ...previous, [exercise.id]: chosen.code }))
          setCustomInputs(previous => ({ ...previous, [exercise.id]: chosen.inputs }))
        }
        setDraftStatus(chosen ? (user ? 'saved' : 'local') : 'idle')
      }

      setHydratedDraftKey(draftKey)
    }

    void load()
    return () => { cancelled = true }
  }, [draftKey, learnerId, phase.id, exercise.id, user])

  useEffect(() => {
    if (!learnerId || hydratedDraftKey !== draftKey) return

    const draft = {
      code: codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang),
      inputs: customInputs[exercise.id] || '',
      updatedAt: new Date().toISOString(),
    }

    // Local persistence is synchronous and immediate. A refresh or tab close
    // right after typing must not lose work.
    saveLocalDraft(learnerId, phase.id, exercise.id, draft)
    setDraftStatus('local')

    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    if (user) {
      saveTimer.current = window.setTimeout(async () => {
        const synced = await saveRemoteDraft(user.id, phase.id, exercise.id, draft)
        setDraftStatus(synced ? 'saved' : 'local')
      }, 650)
    }

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [codes, customInputs, learnerId, phase.id, exercise.id, user, hydratedDraftKey, draftKey, lang])

  const t = useMemo(() => ({
    en: {
      exercise: 'Exercise', run: 'Run and validate', running: 'Running your code', loading: 'Preparing Python',
      hint: 'Reveal first hint', nextHint: 'Reveal next hint', allHints: 'All hints revealed', output: 'Console output', complete: 'All validated — go to knowledge check',
      next: 'Next exercise', phase: 'Phase', sampleOutput: 'Expected output', lockedNext: 'Run this exercise successfully to continue.',
      validated: 'Validated', reset: 'Restore starter code', saved: 'Saved across devices', local: 'Saved on this device', attempts: 'Recent attempts',
      noOutput: 'The program finished without printing anything.', ready: 'Ready to run', progress: 'Validation progress',
      thinkTitle: 'Think before running', predict: 'What do you predict this code will do?', plan: 'What one value, operator or line will you change after the first run?', thinkHelp: 'The first exercise is a predict → run → modify → run challenge. Merely pressing Run is not enough.', observeDone: 'Observation complete. Now make the planned code change and run again.'
    },
    pt: {
      exercise: 'Exercício', run: 'Executar e validar', running: 'Executando seu código', loading: 'Preparando o Python',
      hint: 'Revelar primeira dica', nextHint: 'Revelar próxima dica', allHints: 'Todas as dicas reveladas', output: 'Saída do console', complete: 'Todos validados — ir para verificação',
      next: 'Próximo exercício', phase: 'Fase', sampleOutput: 'Saída esperada', lockedNext: 'Execute este exercício corretamente para continuar.',
      validated: 'Validado', reset: 'Restaurar código inicial', saved: 'Salvo entre dispositivos', local: 'Salvo neste aparelho', attempts: 'Tentativas recentes',
      noOutput: 'O programa terminou sem imprimir nada.', ready: 'Pronto para executar', progress: 'Progresso da validação',
      thinkTitle: 'Pense antes de executar', predict: 'O que você prevê que este código fará?', plan: 'Qual valor, operador ou linha você mudará depois da primeira execução?', thinkHelp: 'O primeiro exercício agora segue prever → executar → modificar → executar. Apenas apertar Executar não é suficiente.', observeDone: 'Observação concluída. Agora faça a alteração planejada no código e execute novamente.'
    }
  })[lang], [lang])

  const clearResult = () => {
    setValidated(previous => ({ ...previous, [exercise.id]: false }))
    setValidationMessage('')
    setValidationChecks(previous => ({ ...previous, [exercise.id]: [] }))
    setErrorExplanation(null)
    setOutput('')
  }

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
      const inputs = (customInputs[exercise.id] || '').split('\n').map(line => line.trim()).filter(Boolean)
      const grade = await gradeExercise(exercise, phase.id, lang, codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang), inputs)
      setOutput(grade.output || (grade.error ? '' : t.noOutput))
      setValidationChecks(previous => ({ ...previous, [exercise.id]: grade.checks }))
      setValidated(previous => ({ ...previous, [exercise.id]: grade.passed }))
      if (isFirstExercise && !observationRuns[exercise.id]) {
        setObservationRuns(previous => ({ ...previous, [exercise.id]: true }))
        setValidated(previous => ({ ...previous, [exercise.id]: false }))
        setValidationMessage(t.observeDone)
      } else if (isFirstExercise && !codeChanged) {
        setValidated(previous => ({ ...previous, [exercise.id]: false }))
        setValidationMessage(t.observeDone)
      } else {
        setValidationMessage(grade.message)
      }

      const passed = grade.checks.filter(check => check.passed).length
      setAttempts(previous => ({ ...previous, [exercise.id]: [{
        id: crypto.randomUUID(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        passed: grade.passed, output: grade.output || '', checks: grade.checks.length, passedChecks: passed,
      }, ...(previous[exercise.id] || [])].slice(0, 5) }))

      recordLearningAttempt({
        phaseId: phase.id, activity: 'exercise', itemId: exercise.id, skillIds: getSkillsForPhase(phase.id),
        score: grade.passed ? 100 : grade.checks.length ? Math.round((passed / grade.checks.length) * 100) : 0,
        passed: grade.passed, hintsUsed: hintLevels[exercise.id] || 0,
        errorCategory: extractErrorCategory(grade.error, grade.timedOut),
      })

      if (grade.error) {
        setOutput(`❌ ${grade.error}\n\n${grade.output}`)
        setErrorExplanation(explainError(grade.error, codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang)))
      }
    } catch (error) {
      setOutput(`❌ ${String(error)}`)
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

  return (
    <Layout showBack backTo={`/phase/${phase.id}`} backLabel={`${t.phase} ${phase.id}`} title={`${t.exercise} · ${phase.title[lang]}`}>
      <div className="page-shell space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {phase.exercises.map((item, index) => (
            <Button key={item.id} size="sm" variant={index === activeEx ? 'primary' : validated[item.id] ? 'success' : 'secondary'} onClick={() => changeExercise(index)}>
              {validated[item.id] ? '✓ ' : ''}{t.exercise} {index + 1}
            </Button>
          ))}
        </div>

        <LearningBrief brief={learningBrief} lang={lang} />

        <Card padding="md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-lg font-semibold text-ink">{exercise.title[lang]}</h2><p className="mt-1 text-sm leading-6 text-ink-secondary">{exercise.description[lang]}</p></div>
            <Badge data-testid="draft-status" variant={draftStatus === 'saved' ? 'success' : 'neutral'}>{draftStatus === 'saved' ? `✓ ${t.saved}` : draftStatus === 'local' ? `✓ ${t.local}` : t.ready}</Badge>
          </div>
          {exercise.sampleOutput && <div className="mt-3 rounded-lg border border-line bg-raised p-3"><div className="mb-1 text-xs text-muted">{t.sampleOutput}</div><pre className="whitespace-pre-wrap font-mono text-sm text-success-text">{exercise.sampleOutput[lang]}</pre></div>}
        </Card>

        {isFirstExercise && <Card padding="md" variant="subtle">
          <h3 className="font-semibold text-ink">🧠 {t.thinkTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-secondary">{t.thinkHelp}</p>
          <label className="mt-3 block text-sm font-medium text-ink">{t.predict}</label>
          <textarea className="mt-1 min-h-20 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink" value={predictions[exercise.id] || ''} onChange={event => setPredictions(previous => ({ ...previous, [exercise.id]: event.target.value }))} />
          <label className="mt-3 block text-sm font-medium text-ink">{t.plan}</label>
          <input className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink" value={changePlans[exercise.id] || ''} onChange={event => setChangePlans(previous => ({ ...previous, [exercise.id]: event.target.value }))} />
          {observationRuns[exercise.id] && !codeChanged && <Alert variant="info" className="mt-3">{t.observeDone}</Alert>}
        </Card>}

        <VSCodeEditor
          value={codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang)}
          onChange={value => {
            lastEditAt.current = Date.now()
            setCodes(previous => ({ ...previous, [exercise.id]: value }))
            if (learnerId) {
              saveLocalDraft(learnerId, phase.id, exercise.id, {
                code: value,
                inputs: customInputs[exercise.id] || '',
                updatedAt: new Date().toISOString(),
              })
              setDraftStatus('local')
            }
            clearResult()
          }}
          filename={`exercise_${activeEx + 1}.py`} height="clamp(280px, 48vh, 520px)" label={lang === 'en' ? 'editable' : 'editável'}
        />

        <div><TestInputEditor code={codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang)} value={customInputs[exercise.id] || ''} onChange={value => {
            lastEditAt.current = Date.now()
            setCustomInputs(previous => ({ ...previous, [exercise.id]: value }))
            if (learnerId) {
              saveLocalDraft(learnerId, phase.id, exercise.id, {
                code: codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang),
                inputs: value,
                updatedAt: new Date().toISOString(),
              })
              setDraftStatus('local')
            }
            clearResult()
          }} lang={lang} suggestedInputs={exercise.suggestedInputs} /></div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Button data-testid="exercise-run-button" fullWidth size="lg" loading={running || pyodideLoading} disabled={isFirstExercise && !thinkingReady} onClick={handleRun} leftIcon="▶">
            {pyodideLoading ? t.loading : running ? t.running : t.run}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => {
            lastEditAt.current = Date.now()
            setCodes(previous => ({ ...previous, [exercise.id]: resolveLocalizedCode(exercise.starterCode, lang) }))
            clearResult()
          }}>{t.reset}</Button>
        </div>

        <div data-testid="exercise-feedback">{checks.length > 0 && <Progress value={passedChecks} max={checks.length} label={t.progress} showValue tone={currentValidated ? 'success' : 'warning'} />}
        {validationMessage && <Alert variant={currentValidated ? 'success' : 'warning'} title={currentValidated ? t.validated : (lang === 'en' ? 'Keep improving' : 'Continue ajustando')}>{validationMessage}</Alert>}
        <ExerciseFeedback checks={checks} lang={lang} /></div>

        {(output || errorExplanation) && <Card data-testid="exercise-output" padding="none" className="overflow-hidden"><div className="border-b border-line px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">{t.output}</div>{errorExplanation ? <div className="p-3"><ErrorExplainer explanation={errorExplanation} lang={lang} rawError={output} showRaw={showRawError} onToggleRaw={() => setShowRawError(value => !value)} /></div> : <pre className="max-h-72 overflow-auto whitespace-pre-wrap bg-[#0d1117] p-4 font-mono text-sm leading-6 text-[#7ee787]">{output}</pre>}</Card>}

        {exercise.hints.length > 0 && <Card variant="subtle" padding="md"><Button variant="ghost" size="sm" disabled={(hintLevels[exercise.id] || 0) >= exercise.hints.length} onClick={() => setHintLevels(previous => ({ ...previous, [exercise.id]: Math.min((previous[exercise.id] || 0) + 1, exercise.hints.length) }))}>💡 {(hintLevels[exercise.id] || 0) === 0 ? t.hint : (hintLevels[exercise.id] || 0) < exercise.hints.length ? t.nextHint : t.allHints}</Button>{(hintLevels[exercise.id] || 0) > 0 && <div className="mt-3 space-y-2">{exercise.hints.slice(0, hintLevels[exercise.id] || 0).map((hint, index) => <Alert key={index} variant="info" title={lang === 'en' ? `Hint ${index + 1}` : `Dica ${index + 1}`}>{hint[lang]}</Alert>)}</div>}</Card>}

        {(attempts[exercise.id] || []).length > 0 && <Card padding="md"><h3 className="font-semibold">{t.attempts}</h3><div className="mt-3 space-y-2">{attempts[exercise.id].map(item => <div key={item.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm"><span>{item.time} · {item.passedChecks}/{item.checks}</span><Badge variant={item.passed ? 'success' : 'warning'}>{item.passed ? (lang === 'en' ? 'Passed' : 'Aprovado') : (lang === 'en' ? 'Review' : 'Revisar')}</Badge></div>)}</div></Card>}

        <div>{activeEx < phase.exercises.length - 1 ? <Button fullWidth size="lg" variant={currentValidated ? 'secondary' : 'ghost'} disabled={!currentValidated} onClick={() => changeExercise(activeEx + 1)}>{currentValidated ? `${t.next} →` : `🔒 ${t.lockedNext}`}</Button> : <Button fullWidth size="lg" disabled={!allValidated} onClick={handleComplete}>{allValidated ? `${t.complete} →` : `🔒 ${t.lockedNext}`}</Button>}</div>
      </div>
    </Layout>
  )
}
