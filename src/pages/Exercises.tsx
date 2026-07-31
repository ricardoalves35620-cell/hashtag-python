import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import VSCodeEditor from '../components/VSCodeEditor'
import TestInputEditor from '../components/TestInputEditor'
import ErrorExplainer from '../components/ErrorExplainer'
import ExerciseFeedback from '../components/ExerciseFeedback'
import ExerciseExpectedOutput from '../components/ExerciseExpectedOutput'
import TaskDescription from '../components/TaskDescription'
import LearningBrief from '../components/LearningBrief'
import { Alert, Badge, Button, Card, Progress, useToast } from '../components/ui'
import { explainError, type ErrorExplanation } from '../lib/errorExplainer'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'
import { loadCompletedExercises, saveCompletedExercise, loadExerciseNotes, saveExerciseNote } from '../lib/exerciseProgress'
import { subscribeState, getStateVersion } from '../lib/syncedStore'
import { canWarmPythonAutomatically, isPythonReady, preparePythonEngine, PythonUnavailableError } from '../lib/pyodide'
import PythonLoadingProgress from '../components/PythonLoadingProgress'
import { gradeExercise, type ValidationItem } from '../lib/learningValidation'
import { getSkillsForPhase } from '../data/skills'
import { extractErrorCategory } from '../lib/learningEngine'
import { chooseNewestDraft, fetchRemoteDraft, flushLocalDrafts, loadLocalDraft, saveLocalDraft, scheduleLocalDraft, saveRemoteDraft } from '../lib/codeDrafts'
import { scrollToTop } from '../lib/scroll'
import { getExercisePedagogy } from '../lib/pedagogy'
import { resolveLocalizedCode } from '../lib/localization'
import { personalize } from '../lib/learnerProfile'
import { useLearnerProfileVersion } from '../components/LessonBlock'
import { getPrimaryExerciseInputs } from '../lib/exerciseContract'

interface AttemptView {
  id: string
  time: string
  passed: boolean
  output: string
  checks: number
  passedChecks: number
}

export default function Exercises() {
  useLearnerProfileVersion()
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, learnerId, user, refreshProgress, recordLearningAttempt } = useApp()
  // ToastProvider has been mounted in App.tsx all along, but useToast had zero call
  // sites — which is why every failed write in this app was silent.
  const { showToast } = useToast()
  const phase = ALL_PHASES.find(item => item.id === Number(id))

  const [activeEx, setActiveEx] = useState(0)
  const [codes, setCodes] = useState<Record<string, string>>(() => Object.fromEntries(phase?.exercises.map(ex => [ex.id, resolveLocalizedCode(ex.starterCode, lang)]) || []))
  const [output, setOutput] = useState('')
  const [errorExplanation, setErrorExplanation] = useState<ErrorExplanation | null>(null)
  const [showRawError, setShowRawError] = useState(false)
  const [runtimeUnavailable, setRuntimeUnavailable] = useState(false)
  const [running, setRunning] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [hintLevels, setHintLevels] = useState<Record<string, number>>({})
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [validated, setValidated] = useState<Record<string, boolean>>({})
  const [validationMessage, setValidationMessage] = useState('')
  // The observation step is neither a pass nor a failure: the learner was asked to
  // run the starter code and watch. Deriving its tone from grade.passed meant the
  // SAME correct action read as '✓ Validated' on phases whose starter happens to
  // satisfy the checks and '⚠ Keep improving' on phases whose starter prints
  // nothing yet — an arbitrary difference from the learner's point of view.
  const [messageTone, setMessageTone] = useState<'success' | 'warning' | 'info'>('warning')
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

  // Exercises already earned survive a reload, an offline session or a deploy — and
  // the page opens on the first one still outstanding rather than always on number 1.
  useSyncExternalStore(subscribeState, getStateVersion, getStateVersion)
  const restoredFor = useRef<string | null>(null)
  useEffect(() => {
    if (!learnerId || !phase) return
    const token = `${learnerId}:${phase.id}`
    const done = loadCompletedExercises(learnerId, phase.id)
    // Stored state must win on load. Spreading `previous` last made an optimistic
    // local `true` permanent: a completion whose cloud write failed stayed green
    // through every reload and refetch, and still unlocked the quiz. Nothing is lost
    // by trusting `done` here — loadCompletedExercises only ever returns positives.
    if (Object.keys(done).length) setValidated(previous => ({ ...previous, ...done }))
    if (restoredFor.current === token) return
    restoredFor.current = token
    const notes = loadExerciseNotes(learnerId, phase.id)
    if (Object.keys(notes).length) {
      setPredictions(previous => ({ ...Object.fromEntries(Object.entries(notes).map(([id, note]) => [id, note.prediction || ''])), ...previous }))
      setChangePlans(previous => ({ ...Object.fromEntries(Object.entries(notes).map(([id, note]) => [id, note.plan || ''])), ...previous }))
    }
    const firstOutstanding = phase.exercises.findIndex(item => !done[item.id])
    setActiveEx(firstOutstanding === -1 ? phase.exercises.length - 1 : firstOutstanding)
  }, [learnerId, phase?.id])

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
  const outstanding = phase.exercises
    .map((item, index) => (validated[item.id] ? null : index + 1))
    .filter((n): n is number => n !== null)
  const checks = validationChecks[exercise.id] || []
  const passedChecks = checks.filter(check => check.passed).length
  const draftKey = `${learnerId || 'anonymous'}:${phase.id}:${exercise.id}`
  const learningBrief = useMemo(() => getExercisePedagogy(phase, exercise, activeEx, lang), [phase, exercise, activeEx, lang])
  const contractInputs = useMemo(() => getPrimaryExerciseInputs(exercise), [exercise])

  // The runtime is ~12 MB on first use. The learner spends a minute reading the
  // brief and writing a prediction before they can even press Run, so start the
  // download during that time rather than after it. Opt out on metered and 2G
  // connections — spending someone's data plan unasked is not acceptable.
  useEffect(() => {
    if (isPythonReady() || !canWarmPythonAutomatically()) return
    let cancelled = false
    const idle = window.setTimeout(() => {
      if (!cancelled) void preparePythonEngine().catch(() => { /* surfaced on Run */ })
    }, 1200)
    return () => { cancelled = true; window.clearTimeout(idle) }
  }, [])

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

  // Follow a language switch. The editor keeps the learner's code across an EN/PT
  // toggle, which is correct for real work — but a PRISTINE starter must switch with
  // the language, or an English learner is left reading the Portuguese starter (its
  // comments are Portuguese). Runs on lang change and after a draft hydrates; only
  // ever replaces code that still equals a pristine starter of EITHER language, so a
  // real edit is never touched.
  useEffect(() => {
    const en = resolveLocalizedCode(exercise.starterCode, 'en').trim()
    const pt = resolveLocalizedCode(exercise.starterCode, 'pt').trim()
    const wanted = resolveLocalizedCode(exercise.starterCode, lang)
    setCodes(previous => {
      const current = previous[exercise.id]
      if (current === undefined) return previous
      const isPristine = current.trim() === en || current.trim() === pt
      if (isPristine && current !== wanted) return { ...previous, [exercise.id]: wanted }
      return previous
    })
  }, [lang, exercise.id, exercise.starterCode, hydratedDraftKey])

  useEffect(() => {
    if (!learnerId || hydratedDraftKey !== draftKey) return

    const draft = {
      code: codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang),
      inputs: customInputs[exercise.id] || '',
      updatedAt: new Date().toISOString(),
    }

    // This path runs on a settled edit rather than per keystroke, so the write stays
    // immediate: a refresh or tab close right after typing must not lose work. The
    // per-keystroke path below uses scheduleLocalDraft instead, which coalesces the
    // synchronous JSON.stringify + setItem that was costing a frame per character.
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
      // Navigating away must not strand a debounced keystroke write in memory.
      flushLocalDrafts()
    }
  }, [codes, customInputs, learnerId, phase.id, exercise.id, user, hydratedDraftKey, draftKey, lang])

  const t = useMemo(() => ({
    en: {
      exercise: 'Exercise', run: 'Run and validate', running: 'Running your code', loading: 'Preparing Python',
      hint: 'Reveal first hint', nextHint: 'Reveal next hint', allHints: 'All hints revealed', output: 'Console output', complete: 'All validated — go to knowledge check',
      next: 'Next exercise', phase: 'Phase', sampleOutput: 'Expected output', lockedNext: 'Run this exercise successfully to continue.', stillToDo: 'Still to finish',
      validated: 'Validated', reset: 'Restore starter code', saved: 'Saved across devices', local: 'Saved on this device', attempts: 'Recent attempts',
      noOutput: 'The program finished without printing anything.', ready: 'Ready to run', progress: 'Validation progress',
      observeComplete: 'Cycle complete — you predicted, ran it, changed one thing and saw the effect.', thinkTitle: 'Think before running', predict: 'What do you predict this code will do?', plan: 'What one value, operator or line will you change after the first run?', thinkHelp: 'The first exercise is a predict → run → modify → run challenge. Merely pressing Run is not enough.', observeDone: 'Observation complete. Now make the planned code change and run again.', notChangedYet: 'The code is still exactly as it started. Edit the value you planned to change — then run again.',
      runtimeTitle: 'Python could not be loaded',
      runtimeBody: 'This is not a problem with your code \u2014 nothing was checked. Python is downloaded the first time you run it, so this usually means the connection dropped.',
      runtimeHint: 'Check your connection and try again. Once Python has loaded successfully one time, it works offline.',
      runtimeRetry: 'Try again',
      unlockTitle: 'Complete these two short steps to enable Run', predictionMissing: 'Write a prediction with at least 10 characters.', planMissing: 'Describe one change with at least 3 characters.', readyToRun: 'Prediction and change plan completed. Run is enabled.'
    },
    pt: {
      exercise: 'Exercício', run: 'Executar e validar', running: 'Executando seu código', loading: 'Preparando o Python',
      hint: 'Revelar primeira dica', nextHint: 'Revelar próxima dica', allHints: 'Todas as dicas reveladas', output: 'Saída do console', complete: 'Todos validados — ir para verificação',
      next: 'Próximo exercício', phase: 'Fase', sampleOutput: 'Saída esperada', lockedNext: 'Execute este exercício corretamente para continuar.', stillToDo: 'Ainda falta',
      validated: 'Validado', reset: 'Restaurar código inicial', saved: 'Salvo entre dispositivos', local: 'Salvo neste aparelho', attempts: 'Tentativas recentes',
      noOutput: 'O programa terminou sem imprimir nada.', ready: 'Pronto para executar', progress: 'Progresso da validação',
      observeComplete: 'Ciclo completo — você previu, executou, mudou uma coisa e viu o efeito.', thinkTitle: 'Pense antes de executar', predict: 'O que você prevê que este código fará?', plan: 'Qual valor, operador ou linha você mudará depois da primeira execução?', thinkHelp: 'O primeiro exercício agora segue prever → executar → modificar → executar. Apenas apertar Executar não é suficiente.', observeDone: 'Observação concluída. Agora faça a alteração planejada no código e execute novamente.', notChangedYet: 'O código continua exatamente como começou. Edite o valor que você planejou mudar — depois execute de novo.',
      runtimeTitle: 'Não foi possível carregar o Python',
      runtimeBody: 'Não é um problema no seu código — nada foi verificado. O Python é baixado na primeira execução, então normalmente isso significa que a conexão caiu.',
      runtimeHint: 'Verifique sua conexão e tente de novo. Depois que o Python carregar uma vez, ele funciona offline.',
      runtimeRetry: 'Tentar de novo',
      unlockTitle: 'Conclua estes dois passos curtos para liberar Executar', predictionMissing: 'Escreva uma previsão com pelo menos 10 caracteres.', planMissing: 'Descreva uma alteração com pelo menos 3 caracteres.', readyToRun: 'Previsão e plano preenchidos. O botão Executar está liberado.'
    }
  })[lang], [lang])

  const clearResult = () => {
    setValidated(previous => ({ ...previous, [exercise.id]: previous[exercise.id] || false }))
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
    setRuntimeUnavailable(false)
    setMessageTone('warning')
    try {
      setPyodideLoading(true)
      await preparePythonEngine()
      setPyodideLoading(false)
      const inputs = (customInputs[exercise.id] || '').split('\n').map(line => line.trim()).filter(Boolean)
      const grade = await gradeExercise(exercise, phase.id, lang, codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang), inputs)

      // Python never started. Nothing about the learner's code was assessed, so no
      // attempt is recorded and no checks are shown — the alternative is telling
      // someone they got an exercise wrong because a CDN was unreachable.
      if (grade.runtimeUnavailable) {
        setRuntimeUnavailable(true)
        return
      }

      setOutput(grade.output || (grade.error ? '' : t.noOutput))
      setValidationChecks(previous => ({ ...previous, [exercise.id]: grade.checks }))
      setValidated(previous => ({ ...previous, [exercise.id]: previous[exercise.id] || grade.passed }))
      if (grade.passed && learnerId) saveCompletedExercise(learnerId, phase.id, exercise.id)
      if (isFirstExercise && !observationRuns[exercise.id]) {
        setObservationRuns(previous => ({ ...previous, [exercise.id]: true }))
        setValidated(previous => ({ ...previous, [exercise.id]: previous[exercise.id] || false }))
        setValidationMessage(t.observeDone)
        setMessageTone('info')
      } else if (isFirstExercise && !codeChanged) {
        setValidated(previous => ({ ...previous, [exercise.id]: previous[exercise.id] || false }))
        setValidationMessage(t.notChangedYet)
        setMessageTone('warning')
      } else if (isFirstExercise) {
        // This exercise asks the learner to CHANGE a value and run again, so its
        // output is SUPPOSED to differ from the published sample. Judging it against
        // that sample made it impossible by design: leave the code alone and it says
        // "not changed yet"; change it and the comparison fails. Completing the
        // cycle without a runtime error is the pass condition.
        const cycleComplete = !grade.error
        setValidated(previous => ({ ...previous, [exercise.id]: previous[exercise.id] || cycleComplete }))
        if (cycleComplete && learnerId) saveCompletedExercise(learnerId, phase.id, exercise.id)
        setValidationMessage(cycleComplete ? t.observeComplete : grade.message)
        setMessageTone(cycleComplete ? 'success' : 'warning')
      } else {
        setValidationMessage(grade.message)
        setMessageTone(grade.passed ? 'success' : 'warning')
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
      if (error instanceof PythonUnavailableError) {
        // Was: setOutput(`❌ ${String(error)}`), which printed
        // "Failed to execute 'importScripts' on 'WorkerGlobalScope'" into the
        // console panel, in English, styled as the learner's own program output.
        setRuntimeUnavailable(true)
      } else {
        setOutput(`❌ ${String(error)}`)
        setValidated(previous => ({ ...previous, [exercise.id]: previous[exercise.id] || false }))
        setValidationChecks(previous => ({ ...previous, [exercise.id]: [] }))
      }
    } finally {
      setRunning(false)
      setPyodideLoading(false)
    }
  }

  // The terminal CTA was fully enabled across two awaited network calls, so repeated
  // taps fired duplicate markStepDone writes and queued several navigations. It also
  // had no catch: a rejection became an unhandled promise and a visibly dead button.
  const [completing, setCompleting] = useState(false)
  const completeLock = useRef(false)

  const handleComplete = async () => {
    if (!learnerId || !allValidated || completeLock.current) return
    completeLock.current = true
    setCompleting(true)
    try {
      await markStepDone(learnerId, phase.id, 'exercises')
      await refreshProgress()
      navigate(`/phase/${phase.id}/quiz`)
      scrollToTop(100)
    } catch {
      showToast({
        tone: 'danger',
        title: lang === 'pt' ? 'Não foi possível concluir' : "Couldn't complete",
        description: lang === 'pt'
          ? 'Seu trabalho está salvo neste aparelho. Tente novamente em instantes.'
          : 'Your work is saved on this device. Please try again in a moment.',
      })
    } finally {
      completeLock.current = false
      setCompleting(false)
    }
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
            <div><h2 className="text-lg font-semibold text-ink">{personalize(exercise.title[lang])}</h2><TaskDescription text={personalize(exercise.description[lang])} lang={lang} /></div>
            <Badge data-testid="draft-status" variant={draftStatus === 'saved' ? 'success' : 'neutral'}>{draftStatus === 'saved' ? `✓ ${t.saved}` : draftStatus === 'local' ? `✓ ${t.local}` : t.ready}</Badge>
          </div>
          <ExerciseExpectedOutput exercise={exercise} lang={lang} />
        </Card>

        <VSCodeEditor
          value={codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang)}
          onChange={value => {
            lastEditAt.current = Date.now()
            setCodes(previous => ({ ...previous, [exercise.id]: value }))
            if (learnerId) {
              scheduleLocalDraft(learnerId, phase.id, exercise.id, {
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

        {isFirstExercise && <Card padding="md" variant="subtle">
          <h3 className="font-semibold text-ink">🧠 {t.thinkTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-secondary">{t.thinkHelp}</p>
          <label htmlFor="exercise-prediction-field" className="mt-3 block text-sm font-medium text-ink">{t.predict}</label>
          <textarea id="exercise-prediction-field" data-testid="exercise-prediction" aria-describedby="exercise-run-requirements" className="mt-1 min-h-20 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink" value={predictions[exercise.id] || ''} onChange={event => { setPredictions(previous => ({ ...previous, [exercise.id]: event.target.value })); if (learnerId) saveExerciseNote(learnerId, phase.id, exercise.id, { prediction: event.target.value }) }} />
          <label htmlFor="exercise-change-plan-field" className="mt-3 block text-sm font-medium text-ink">{t.plan}</label>
          <input id="exercise-change-plan-field" data-testid="exercise-change-plan" aria-describedby="exercise-run-requirements" className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink" value={changePlans[exercise.id] || ''} onChange={event => { setChangePlans(previous => ({ ...previous, [exercise.id]: event.target.value })); if (learnerId) saveExerciseNote(learnerId, phase.id, exercise.id, { plan: event.target.value }) }} />
          <div id="exercise-run-requirements" data-testid="exercise-run-requirements" className="mt-3 rounded-lg border border-line bg-surface p-3 text-sm text-ink-secondary">
            <div className="font-semibold text-ink">{t.unlockTitle}</div>
            <div className="mt-2 grid gap-1">
              <span>{(predictions[exercise.id] || '').trim().length >= 10 ? '✓' : '○'} {t.predictionMissing}</span>
              <span>{(changePlans[exercise.id] || '').trim().length >= 3 ? '✓' : '○'} {t.planMissing}</span>
            </div>
            {thinkingReady && <div className="mt-2 font-medium text-success">✓ {t.readyToRun}</div>}
          </div>
          {observationRuns[exercise.id] && !codeChanged && <Alert variant="warning" className="mt-3">{t.notChangedYet}</Alert>}
        </Card>}


        <div><TestInputEditor key={exercise.id} code={codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang)} value={customInputs[exercise.id] || ''} onChange={(value, origin) => {
            setCustomInputs(previous => ({ ...previous, [exercise.id]: value }))
            // A derived value is this component re-reading the code for input()
            // prompts. It is not the learner doing anything, so it must neither
            // count as an edit nor be written back as a draft: on mount it fires
            // before the saved draft has loaded, and persisting it replaced the
            // learner's code with the starter on every exercise that reads input().
            if (origin === 'derived') return
            lastEditAt.current = Date.now()
            if (learnerId && hydratedDraftKey === draftKey) {
              scheduleLocalDraft(learnerId, phase.id, exercise.id, {
                code: codes[exercise.id] ?? resolveLocalizedCode(exercise.starterCode, lang),
                inputs: value,
                updatedAt: new Date().toISOString(),
              })
              setDraftStatus('local')
            }
            clearResult()
          }} lang={lang} suggestedInputs={contractInputs} /></div>

        {/*
          The loading progress used to sit INSIDE this grid, which made three children
          share two columns: the progress took column one, Run fell into the narrow
          `auto` column on the right, and Reset wrapped onto a second row at full width.
          The two actions ended up different widths on different rows.

          Two equal halves is what every other action row in the app uses — BaseZero,
          EngineeringLab, LearningProgress, Roadmap, Profile — so this now matches them
          instead of being the one screen with its own layout.
        */}
        <div className="mb-3"><PythonLoadingProgress lang={lang} /></div>

        <div className="grid grid-cols-2 gap-2">
          <Button data-testid="exercise-run-button" aria-describedby={isFirstExercise ? 'exercise-run-requirements' : undefined} fullWidth size="lg" loading={running || pyodideLoading} disabled={isFirstExercise && !thinkingReady} onClick={handleRun} leftIcon="▶">
            {pyodideLoading ? t.loading : running ? t.running : t.run}
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={() => {
            lastEditAt.current = Date.now()
            setCodes(previous => ({ ...previous, [exercise.id]: resolveLocalizedCode(exercise.starterCode, lang) }))
            clearResult()
          }}>{t.reset}</Button>
        </div>

        {/* Once the exercise is satisfied, the strict-check percentage stops being a
            score and starts being a contradiction — a 40% bar under a "✓ Validated"
            heading. Show completion instead. */}
        <div data-testid="exercise-feedback">{checks.length > 0 && (
          <Progress
            value={currentValidated ? checks.length : passedChecks}
            max={checks.length}
            label={currentValidated ? t.validated : t.progress}
            showValue
            tone={currentValidated ? 'success' : 'warning'}
          />
        )}
        {validationMessage && (
          <Alert
            variant={messageTone}
            title={messageTone === 'success'
              ? t.validated
              : messageTone === 'info'
                ? (lang === 'en' ? 'Observation complete' : 'Observação concluída')
                : (lang === 'en' ? 'Keep improving' : 'Continue ajustando')}
          >{validationMessage}</Alert>
        )}
        <ExerciseFeedback checks={checks} lang={lang} satisfied={currentValidated} /></div>

        {runtimeUnavailable && (
          <Alert variant="warning" title={t.runtimeTitle} data-testid="python-unavailable">
            <p className="mb-2">{t.runtimeBody}</p>
            <p className="mb-3 text-sm text-ink-secondary">{t.runtimeHint}</p>
            <Button size="sm" variant="secondary" onClick={handleRun} loading={running || pyodideLoading} data-testid="python-unavailable-retry">
              {t.runtimeRetry}
            </Button>
          </Alert>
        )}

        {(output || errorExplanation) && <Card data-testid="exercise-output" padding="none" className="overflow-hidden"><div className="border-b border-line px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">{t.output}</div>{errorExplanation ? <div className="p-3"><ErrorExplainer explanation={errorExplanation} lang={lang} rawError={output} showRaw={showRawError} onToggleRaw={() => setShowRawError(value => !value)} /></div> : <pre className="max-h-72 overflow-auto whitespace-pre-wrap bg-[#0d1117] p-4 font-mono text-sm leading-6 text-[#7ee787]">{output}</pre>}</Card>}

        {exercise.hints.length > 0 && <Card variant="subtle" padding="md"><Button variant="ghost" size="sm" disabled={(hintLevels[exercise.id] || 0) >= exercise.hints.length} onClick={() => setHintLevels(previous => ({ ...previous, [exercise.id]: Math.min((previous[exercise.id] || 0) + 1, exercise.hints.length) }))}>💡 {(hintLevels[exercise.id] || 0) === 0 ? t.hint : (hintLevels[exercise.id] || 0) < exercise.hints.length ? t.nextHint : t.allHints}</Button>{(hintLevels[exercise.id] || 0) > 0 && <div className="mt-3 space-y-2">{exercise.hints.slice(0, hintLevels[exercise.id] || 0).map((hint, index) => <Alert key={index} variant="info" title={lang === 'en' ? `Hint ${index + 1}` : `Dica ${index + 1}`}>{personalize(hint[lang])}</Alert>)}</div>}</Card>}

        {(attempts[exercise.id] || []).length > 0 && <Card padding="md"><h3 className="font-semibold">{t.attempts}</h3><div className="mt-3 space-y-2">{attempts[exercise.id].map(item => <div key={item.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm"><span>{item.time} · {item.passedChecks}/{item.checks}</span><Badge variant={item.passed ? 'success' : 'warning'}>{item.passed ? (lang === 'en' ? 'Passed' : 'Aprovado') : (lang === 'en' ? 'Review' : 'Revisar')}</Badge></div>)}</div></Card>}

        <div>{activeEx < phase.exercises.length - 1 ? <Button fullWidth size="lg" variant={currentValidated ? 'secondary' : 'ghost'} disabled={!currentValidated} onClick={() => changeExercise(activeEx + 1)}>{currentValidated ? `${t.next} →` : `🔒 ${t.lockedNext}`}</Button> : <Button fullWidth size="lg" disabled={!allValidated} loading={completing} onClick={handleComplete}>{allValidated ? `${t.complete} →` : (currentValidated && outstanding.length ? `🔒 ${t.stillToDo}: ${outstanding.map(n => `${lang === 'en' ? 'exercise' : 'exercício'} ${n}`).join(', ')}` : `🔒 ${t.lockedNext}`)}</Button>}</div>
      </div>
    </Layout>
  )
}
