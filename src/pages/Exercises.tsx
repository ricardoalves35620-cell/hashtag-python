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
  const [codes, setCodes] = useState<Record<string, string>>(() => Object.fromEntries(phase?.exercises.map(ex => [ex.id, ex.starterCode]) || []))
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
  const [draftStatus, setDraftStatus] = useState<'loading' | 'saved' | 'local' | 'idle'>('loading')
  const saveTimer = useRef<number | null>(null)

  if (!phase || phase.exercises.length === 0) {
    return <Layout showBack backTo={`/phase/${phase?.id}`} title={lang === 'en' ? 'Exercises' : 'Exercícios'}><div className="page-shell"><Alert variant="info">{lang === 'en' ? 'Exercises for this phase are being prepared.' : 'Os exercícios desta fase estão sendo preparados.'}</Alert></div></Layout>
  }

  const exercise = phase.exercises[activeEx]
  const currentValidated = Boolean(validated[exercise.id])
  const allValidated = phase.exercises.every(item => validated[item.id])
  const checks = validationChecks[exercise.id] || []
  const passedChecks = checks.filter(check => check.passed).length
  const draftKey = `${learnerId || 'anonymous'}:${phase.id}:${exercise.id}`
  const learningBrief = useMemo(() => getExercisePedagogy(phase, exercise, activeEx, lang), [phase, exercise, activeEx, lang])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!learnerId) { setDraftStatus('idle'); return }
      setDraftStatus('loading')
      const local = loadLocalDraft(learnerId, phase.id, exercise.id)
      const remote = user ? await fetchRemoteDraft(user.id, phase.id, exercise.id) : null
      const chosen = chooseNewestDraft(local, remote)
      if (cancelled) return
      if (chosen) {
        setCodes(previous => ({ ...previous, [exercise.id]: chosen.code }))
        setCustomInputs(previous => ({ ...previous, [exercise.id]: chosen.inputs }))
      }
      setDraftStatus(chosen ? (user ? 'saved' : 'local') : 'idle')
    }
    load()
    return () => { cancelled = true }
  }, [draftKey, learnerId, phase.id, exercise.id, user])

  useEffect(() => {
    if (!learnerId) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    setDraftStatus('idle')
    saveTimer.current = window.setTimeout(() => {
      const draft = { code: codes[exercise.id], inputs: customInputs[exercise.id] || '', updatedAt: new Date().toISOString() }
      saveLocalDraft(learnerId, phase.id, exercise.id, draft)
      setDraftStatus(user ? 'saved' : 'local')
      if (user) void saveRemoteDraft(user.id, phase.id, exercise.id, draft)
    }, 650)
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current) }
  }, [codes, customInputs, learnerId, phase.id, exercise.id, user])

  const t = useMemo(() => ({
    en: {
      exercise: 'Exercise', run: 'Run and validate', running: 'Running your code', loading: 'Preparing Python',
      hint: 'Reveal first hint', nextHint: 'Reveal next hint', allHints: 'All hints revealed', output: 'Console output', complete: 'All validated — go to knowledge check',
      next: 'Next exercise', phase: 'Phase', sampleOutput: 'Expected output', lockedNext: 'Run this exercise successfully to continue.',
      validated: 'Validated', reset: 'Restore starter code', saved: 'Saved across devices', local: 'Saved on this device', attempts: 'Recent attempts',
      noOutput: 'The program finished without printing anything.', ready: 'Ready to run', progress: 'Validation progress'
    },
    pt: {
      exercise: 'Exercício', run: 'Executar e validar', running: 'Executando seu código', loading: 'Preparando o Python',
      hint: 'Revelar primeira dica', nextHint: 'Revelar próxima dica', allHints: 'Todas as dicas reveladas', output: 'Saída do console', complete: 'Todos validados — ir para verificação',
      next: 'Próximo exercício', phase: 'Fase', sampleOutput: 'Saída esperada', lockedNext: 'Execute este exercício corretamente para continuar.',
      validated: 'Validado', reset: 'Restaurar código inicial', saved: 'Salvo entre dispositivos', local: 'Salvo neste aparelho', attempts: 'Tentativas recentes',
      noOutput: 'O programa terminou sem imprimir nada.', ready: 'Pronto para executar', progress: 'Progresso da validação'
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
      const grade = await gradeExercise(exercise, phase.id, lang, codes[exercise.id], inputs)
      setOutput(grade.output || (grade.error ? '' : t.noOutput))
      setValidationChecks(previous => ({ ...previous, [exercise.id]: grade.checks }))
      setValidated(previous => ({ ...previous, [exercise.id]: grade.passed }))
      setValidationMessage(grade.message)

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
        setErrorExplanation(explainError(grade.error, codes[exercise.id]))
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
            <Badge variant={draftStatus === 'saved' ? 'success' : 'neutral'}>{draftStatus === 'saved' ? `✓ ${t.saved}` : draftStatus === 'local' ? `✓ ${t.local}` : t.ready}</Badge>
          </div>
          {exercise.sampleOutput && <div className="mt-3 rounded-lg border border-line bg-raised p-3"><div className="mb-1 text-xs text-muted">{t.sampleOutput}</div><pre className="whitespace-pre-wrap font-mono text-sm text-success-text">{exercise.sampleOutput[lang]}</pre></div>}
        </Card>

        <VSCodeEditor
          value={codes[exercise.id]}
          onChange={value => { setCodes(previous => ({ ...previous, [exercise.id]: value })); clearResult() }}
          filename={`exercise_${activeEx + 1}.py`} height="clamp(280px, 48vh, 520px)" label={lang === 'en' ? 'editable' : 'editável'}
        />

        <div><TestInputEditor code={codes[exercise.id]} value={customInputs[exercise.id] || ''} onChange={value => { setCustomInputs(previous => ({ ...previous, [exercise.id]: value })); clearResult() }} lang={lang} /></div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Button fullWidth size="lg" loading={running || pyodideLoading} onClick={handleRun} leftIcon="▶">
            {pyodideLoading ? t.loading : running ? t.running : t.run}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => { setCodes(previous => ({ ...previous, [exercise.id]: exercise.starterCode })); clearResult() }}>{t.reset}</Button>
        </div>

        {checks.length > 0 && <Progress value={passedChecks} max={checks.length} label={t.progress} showValue tone={currentValidated ? 'success' : 'warning'} />}
        {validationMessage && <Alert variant={currentValidated ? 'success' : 'warning'} title={currentValidated ? t.validated : (lang === 'en' ? 'Keep improving' : 'Continue ajustando')}>{validationMessage}</Alert>}
        <ExerciseFeedback checks={checks} lang={lang} />

        {(output || errorExplanation) && <Card padding="none" className="overflow-hidden"><div className="border-b border-line px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">{t.output}</div>{errorExplanation ? <div className="p-3"><ErrorExplainer explanation={errorExplanation} lang={lang} rawError={output} showRaw={showRawError} onToggleRaw={() => setShowRawError(value => !value)} /></div> : <pre className="max-h-72 overflow-auto whitespace-pre-wrap bg-[#0d1117] p-4 font-mono text-sm leading-6 text-[#7ee787]">{output}</pre>}</Card>}

        {exercise.hints.length > 0 && <Card variant="subtle" padding="md"><Button variant="ghost" size="sm" disabled={(hintLevels[exercise.id] || 0) >= exercise.hints.length} onClick={() => setHintLevels(previous => ({ ...previous, [exercise.id]: Math.min((previous[exercise.id] || 0) + 1, exercise.hints.length) }))}>💡 {(hintLevels[exercise.id] || 0) === 0 ? t.hint : (hintLevels[exercise.id] || 0) < exercise.hints.length ? t.nextHint : t.allHints}</Button>{(hintLevels[exercise.id] || 0) > 0 && <div className="mt-3 space-y-2">{exercise.hints.slice(0, hintLevels[exercise.id] || 0).map((hint, index) => <Alert key={index} variant="info" title={lang === 'en' ? `Hint ${index + 1}` : `Dica ${index + 1}`}>{hint[lang]}</Alert>)}</div>}</Card>}

        {(attempts[exercise.id] || []).length > 0 && <Card padding="md"><h3 className="font-semibold">{t.attempts}</h3><div className="mt-3 space-y-2">{attempts[exercise.id].map(item => <div key={item.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm"><span>{item.time} · {item.passedChecks}/{item.checks}</span><Badge variant={item.passed ? 'success' : 'warning'}>{item.passed ? (lang === 'en' ? 'Passed' : 'Aprovado') : (lang === 'en' ? 'Review' : 'Revisar')}</Badge></div>)}</div></Card>}

        <div>{activeEx < phase.exercises.length - 1 ? <Button fullWidth size="lg" variant={currentValidated ? 'secondary' : 'ghost'} disabled={!currentValidated} onClick={() => changeExercise(activeEx + 1)}>{currentValidated ? `${t.next} →` : `🔒 ${t.lockedNext}`}</Button> : <Button fullWidth size="lg" disabled={!allValidated} onClick={handleComplete}>{allValidated ? `${t.complete} →` : `🔒 ${t.lockedNext}`}</Button>}</div>
      </div>
    </Layout>
  )
}
