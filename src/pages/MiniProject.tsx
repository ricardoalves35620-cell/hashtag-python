import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import VSCodeEditor from '../components/VSCodeEditor'
import { Alert, Badge, Button, Card } from '../components/ui'
import LearningCallout from '../components/learning/LearningCallout'
import LearningHero from '../components/learning/LearningHero'
import LearningStageRail from '../components/learning/LearningStageRail'
import StickyLearningActions from '../components/learning/StickyLearningActions'
import { useApp } from '../contexts/AppContext'
import { getMiniProject, type ProjectCheckpointId } from '../data/miniProjects'
import {
  createMiniProjectProgress,
  fetchRemoteProjectProgress,
  loadLocalProjectProgress,
  mergeProjectProgress,
  saveLocalProjectProgress,
  scheduleProjectProgressSync,
  syncProjectProgress,
  type MiniProjectProgress,
  type ProjectTestStatus,
} from '../lib/projectProgress'
import { normalizeAssessmentText, preparePythonEngine, runCode } from '../lib/pyodide'
import { scrollToTop } from '../lib/scroll'
import { markProjectDone } from '../lib/progress'
import { getSupabase } from '../lib/supabase'

const CHECKPOINTS: Array<{ id: ProjectCheckpointId; icon: string; en: string; pt: string }> = [
  { id: 'understand', icon: '🎯', en: 'Understand', pt: 'Entender' },
  { id: 'plan', icon: '🧩', en: 'Plan', pt: 'Planejar' },
  { id: 'build', icon: '🐍', en: 'Implement', pt: 'Implementar' },
  { id: 'test', icon: '🧪', en: 'Test', pt: 'Testar' },
  { id: 'refactor', icon: '✨', en: 'Refactor', pt: 'Refatorar' },
]

function checkpointIndex(id: ProjectCheckpointId) {
  return CHECKPOINTS.findIndex(item => item.id === id)
}

function includesExpected(output: string, expected: string) {
  return normalizeAssessmentText(output).includes(normalizeAssessmentText(expected))
}

export default function MiniProject() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const { lang, learnerId, refreshProgress } = useApp()
  const project = getMiniProject(projectId)
  const starterCode = project?.starterCode[lang] || ''
  const [progress, setProgress] = useState<MiniProjectProgress>(() => project
    ? loadLocalProjectProgress(learnerId || 'guest', project.id, starterCode)
    : createMiniProjectProgress(projectId, starterCode))
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('')
  const hydrationToken = useRef(0)

  useEffect(() => {
    if (!project || !learnerId) return
    const token = ++hydrationToken.current
    const local = loadLocalProjectProgress(learnerId, project.id, starterCode)
    setProgress(local)
    void fetchRemoteProjectProgress(learnerId, project.id).then(remote => {
      if (token !== hydrationToken.current) return
      const merged = mergeProjectProgress(local, remote)
      setProgress(merged)
      saveLocalProjectProgress(learnerId, merged)
      if (learnerId !== 'guest') scheduleProjectProgressSync(learnerId, merged)
    })

    if (learnerId === 'guest') return
    const channel = getSupabase()
      .channel(`project-progress-${learnerId}-${project.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'learning_project_progress',
        filter: `user_id=eq.${learnerId}`,
      }, payload => {
        const row = payload.new as { project_id?: string; state?: MiniProjectProgress; updated_at?: string }
        if (row.project_id !== project.id || !row.state) return
        setProgress(current => {
          const remote = { ...row.state!, updatedAt: row.updated_at || row.state!.updatedAt }
          const merged = mergeProjectProgress(current, remote)
          saveLocalProjectProgress(learnerId, merged)
          return merged
        })
      })
      .subscribe()

    return () => { void getSupabase().removeChannel(channel) }
  }, [learnerId, project, starterCode])

  useEffect(() => { scrollToTop() }, [projectId])

  const t = useMemo(() => ({
    en: {
      title: 'Block mini-project', back: 'Phase', workflow: 'Professional workflow',
      saved: 'Saved on this device', synced: 'Checkpoint saved', next: 'Complete checkpoint and continue',
      finish: 'Complete project', required: 'Required project artifact', optional: 'Optional note',
      understandTitle: 'Define the contract before coding', understandHelp: 'These fields are part of the project plan, not a personal journal. A developer must be able to state what enters, what leaves, and which rule is being implemented.',
      inputs: 'What enters the program?', output: 'What must the program produce?', rules: 'Which rules transform input into output?', edge: 'Which edge case will you test?',
      planTitle: 'Write the solution as ordered steps', planHelp: 'Do not write Python yet. Your pseudocode should be precise enough that each line can later become a small piece of code.',
      buildTitle: 'Implement one responsibility at a time', buildHelp: 'Use the suggested input below. First make the program run without errors; correctness is proven in the next checkpoint.',
      suggested: 'Suggested run inputs', expected: 'Expected output evidence', run: 'Run project', running: 'Running', outputLabel: 'Console output',
      testTitle: 'Prove behavior with multiple tests', testHelp: 'A single example is not proof. Here you will run the same program with different inputs and compare every result with the expected output.', runTests: 'Run all tests',
      testGoal: 'Goal: confirm that your program works in the normal case, in a different valid case and at the important limit defined for this project.',
      testStep1: 'Review each scenario below. The listed values will be entered into input() in exactly that order.',
      testStep2: 'Read the expected output before running. Predict which scenarios should pass and which may reveal a problem.',
      testStep3: 'Select Run all tests. The app will run a fresh copy of the same code for every scenario.',
      testStep4: 'A green Passed badge means the visible result and required Python structure matched. Needs work shows what the program actually returned.',
      testWhy: 'Why multiple tests matter: code that works for one prepared example may still fail with another valid value or a boundary case.',
      testDone: 'This checkpoint is complete when every scenario is green. Then use Complete checkpoint and continue below.',
      inputOrder: 'Values entered into input(), in order', expectedResult: 'What must appear in the output',
      testsNotRun: 'The scenarios have not been executed with this version of the code yet.', testsAllPassed: 'All scenarios passed with the current code.', testsNeedWork: 'Some scenarios need adjustment. Read the result, return to Implement, change one cause and run all tests again.', backToBuild: 'Return to Implement and fix the code',
      refactorTitle: 'Improve without changing behavior', refactorHelp: 'Choose at least one improvement, apply it, and run the tests again. Refactoring is complete only when behavior still passes.',
      completed: 'Project completed', accomplishment: 'You can now', openPhase: 'Return to phase',
      needUnderstand: 'Complete the input, output, rules, and edge-case fields.', needPlan: 'Write at least three clear pseudocode steps.',
      needBuild: 'Change the starter code and run it without an error.', needTests: 'All project tests must pass.', needRefactor: 'Choose an improvement and rerun all tests after the final code change.',
      noOutput: 'The program finished without printing output.', testPassed: 'Passed', testFailed: 'Needs work', nodeMissing: 'One or more required Python structures, imports, functions or the main guard were not found.',
    },
    pt: {
      title: 'Mini projeto do bloco', back: 'Fase', workflow: 'Fluxo profissional',
      saved: 'Salvo neste aparelho', synced: 'Checkpoint salvo', next: 'Concluir checkpoint e continuar',
      finish: 'Concluir projeto', required: 'Artefato obrigatório do projeto', optional: 'Anotação opcional',
      understandTitle: 'Defina o contrato antes de programar', understandHelp: 'Esses campos fazem parte do planejamento do projeto, não são diário pessoal. Um desenvolvedor precisa declarar o que entra, o que sai e qual regra será implementada.',
      inputs: 'O que entra no programa?', output: 'O que o programa precisa produzir?', rules: 'Quais regras transformam entrada em saída?', edge: 'Qual caso limite você vai testar?',
      planTitle: 'Escreva a solução como passos ordenados', planHelp: 'Ainda não escreva Python. O pseudocódigo deve ser preciso o bastante para que cada linha depois vire uma pequena parte do código.',
      buildTitle: 'Implemente uma responsabilidade por vez', buildHelp: 'Use a entrada sugerida abaixo. Primeiro faça o programa executar sem erros; a correção será comprovada no próximo checkpoint.',
      suggested: 'Entradas sugeridas para executar', expected: 'Evidências de saída esperadas', run: 'Executar projeto', running: 'Executando', outputLabel: 'Saída do console',
      testTitle: 'Comprove o comportamento com vários testes', testHelp: 'Um único exemplo não é prova. Aqui você executará o mesmo programa com entradas diferentes e comparará cada resultado com a saída esperada.', runTests: 'Executar todos os testes',
      testGoal: 'Objetivo: confirmar que o programa funciona no caso normal, em outro caso válido e no limite importante definido para este projeto.',
      testStep1: 'Leia cada cenário abaixo. Os valores listados serão digitados no input() exatamente nessa ordem.',
      testStep2: 'Leia a saída esperada antes de executar. Preveja quais cenários devem passar e quais podem revelar um problema.',
      testStep3: 'Selecione Executar todos os testes. O app executará uma cópia nova do mesmo código para cada cenário.',
      testStep4: 'O selo verde Aprovado significa que o resultado visível e a estrutura Python obrigatória conferiram. Precisa de ajuste mostra o que o programa realmente devolveu.',
      testWhy: 'Por que vários testes importam: um código que funciona para um exemplo preparado ainda pode falhar com outro valor válido ou com um caso limite.',
      testDone: 'Este checkpoint termina quando todos os cenários estiverem verdes. Depois use Concluir checkpoint e continuar logo abaixo.',
      inputOrder: 'Valores digitados no input(), na ordem', expectedResult: 'O que precisa aparecer na saída',
      testsNotRun: 'Os cenários ainda não foram executados com esta versão do código.', testsAllPassed: 'Todos os cenários passaram com o código atual.', testsNeedWork: 'Alguns cenários precisam de ajuste. Leia o resultado, volte para Implementar, altere uma causa e execute todos os testes novamente.', backToBuild: 'Voltar para Implementar e corrigir o código',
      refactorTitle: 'Melhore sem alterar o comportamento', refactorHelp: 'Escolha pelo menos uma melhoria, aplique-a e execute os testes novamente. A refatoração só termina quando o comportamento continua aprovado.',
      completed: 'Projeto concluído', accomplishment: 'Agora você consegue', openPhase: 'Voltar para a fase',
      needUnderstand: 'Preencha os campos de entrada, saída, regras e caso limite.', needPlan: 'Escreva pelo menos três passos claros de pseudocódigo.',
      needBuild: 'Altere o código inicial e execute sem erro.', needTests: 'Todos os testes do projeto precisam passar.', needRefactor: 'Escolha uma melhoria e execute todos os testes após a alteração final.',
      noOutput: 'O programa terminou sem imprimir uma saída.', testPassed: 'Aprovado', testFailed: 'Precisa de ajuste', nodeMissing: 'Uma ou mais estruturas, importações, funções ou o main guard obrigatórios não foram encontrados.',
    },
  })[lang], [lang])

  if (!project) {
    return <Layout showBack backTo="/" title={lang === 'pt' ? 'Projeto não encontrado' : 'Project not found'}><div className="p-4"><Alert variant="warning">{lang === 'pt' ? 'Este mini projeto não existe.' : 'This mini-project does not exist.'}</Alert></div></Layout>
  }

  const currentIndex = checkpointIndex(progress.currentCheckpoint)
  const completionPercent = Math.round((progress.completedCheckpoints.length / CHECKPOINTS.length) * 100)
  const allTestsPassed = project.tests.length > 0
    && progress.testResults.length === project.tests.length
    && progress.testResults.every(result => result.passed)
    && progress.testedCode === progress.code

  const persist = (patch: Partial<MiniProjectProgress>, sync = false) => {
    setProgress(current => {
      const next = saveLocalProjectProgress(learnerId || 'guest', { ...current, ...patch, updatedAt: new Date().toISOString() })
      if (learnerId && learnerId !== 'guest') {
        if (sync) void syncProjectProgress(learnerId, next)
        else scheduleProjectProgressSync(learnerId, next)
      }
      return next
    })
  }

  const patchUnderstanding = (key: keyof MiniProjectProgress['understanding'], value: string) => {
    persist({ understanding: { ...progress.understanding, [key]: value } })
  }

  const validateCurrent = () => {
    if (progress.currentCheckpoint === 'understand') {
      return Object.values(progress.understanding).every(value => value.trim().length >= 3) ? '' : t.needUnderstand
    }
    if (progress.currentCheckpoint === 'plan') {
      const steps = progress.pseudocode.split('\n').filter(line => line.trim().length >= 3)
      return steps.length >= 3 && progress.pseudocode.trim().length >= 30 ? '' : t.needPlan
    }
    if (progress.currentCheckpoint === 'build') {
      const codeChanged = progress.code.trim() !== starterCode.trim()
      const ranWithoutError = progress.output.trim().length > 0 && !progress.output.startsWith('ERROR:')
      return codeChanged && ranWithoutError ? '' : t.needBuild
    }
    if (progress.currentCheckpoint === 'test') return allTestsPassed ? '' : t.needTests
    if (progress.currentCheckpoint === 'refactor') {
      return progress.selectedRefactors.length > 0 && allTestsPassed ? '' : t.needRefactor
    }
    return ''
  }

  const completeCheckpoint = async () => {
    const error = validateCurrent()
    if (error) { setMessage(error); return }
    const completedCheckpoints = Array.from(new Set([...progress.completedCheckpoints, progress.currentCheckpoint]))
    const nextIndex = Math.min(currentIndex + 1, CHECKPOINTS.length - 1)
    const final = progress.currentCheckpoint === 'refactor'
    persist({
      completedCheckpoints,
      currentCheckpoint: CHECKPOINTS[nextIndex].id,
      completed: final,
    }, true)
    if (final && learnerId) {
      try {
        await markProjectDone(learnerId, project.milestonePhaseId)
        await refreshProgress()
      } catch (error) {
        console.warn('Project completed locally but phase mastery could not sync yet.', error)
      }
    }
    setMessage(final ? t.completed : t.synced)
    if (!final) {
      window.setTimeout(() => {
        setMessage('')
        scrollToTop()
      }, 250)
    }
  }

  const runBuild = async () => {
    setRunning(true)
    setMessage('')
    try {
      await preparePythonEngine()
      const result = await runCode(progress.code, project.tests[0]?.inputs || [])
      const text = result.error ? `ERROR: ${result.error}` : (result.output || t.noOutput)
      persist({ output: text, testResults: [], testedCode: '' })
    } finally {
      setRunning(false)
    }
  }

  const runTests = async () => {
    setRunning(true)
    setMessage('')
    const statuses: ProjectTestStatus[] = []
    try {
      await preparePythonEngine()
      for (const test of project.tests) {
        const result = await runCode(progress.code, test.inputs)
        const expectedPass = !result.error && test.expectedOutput.every(value => includesExpected(result.output, value))
        const analysis = result.analysis
        const nodesPass = (project.requiredNodes || []).every(node => (analysis?.nodeCounts[node] || 0) > 0)
        const importsPass = (project.requiredImports || []).every(required =>
          Boolean(analysis?.imports.some(name => name === required || name.startsWith(`${required}.`)))
        )
        const functionsPass = (project.requiredFunctions || []).every(required =>
          Boolean(analysis?.functionNames.includes(required))
        )
        const callsPass = (project.requiredCalls || []).every(required =>
          Boolean(analysis?.calls.some(name => name === required || name.endsWith(`.${required}`)))
        )
        const mainGuardPass = !project.requireMainGuard || Boolean(analysis?.hasMainGuard)
        const structurePass = nodesPass && importsPass && functionsPass && callsPass && mainGuardPass
        const passed = expectedPass && structurePass
        const details = result.error
          ? result.error
          : !structurePass
            ? t.nodeMissing
            : result.output || t.noOutput
        statuses.push({ id: test.id, passed, details })
      }
      persist({ testResults: statuses, testedCode: progress.code, output: statuses.map(status => `${status.passed ? '✓' : '✗'} ${status.id}: ${status.details}`).join('\n') }, true)
    } finally {
      setRunning(false)
    }
  }

  const openCheckpoint = (id: ProjectCheckpointId) => {
    const index = checkpointIndex(id)
    if (index > currentIndex && !progress.completedCheckpoints.includes(id)) return
    persist({ currentCheckpoint: id })
    setMessage('')
    scrollToTop()
  }

  const stageItems = CHECKPOINTS.map((checkpoint, index) => ({
    id: checkpoint.id,
    icon: checkpoint.icon,
    title: checkpoint[lang],
    description: ({
      understand: lang === 'pt' ? 'Defina o contrato do problema.' : 'Define the problem contract.',
      plan: lang === 'pt' ? 'Transforme o problema em passos.' : 'Turn the problem into steps.',
      build: lang === 'pt' ? 'Implemente uma responsabilidade por vez.' : 'Implement one responsibility at a time.',
      test: lang === 'pt' ? 'Comprove o comportamento.' : 'Prove the behavior.',
      refactor: lang === 'pt' ? 'Melhore sem quebrar.' : 'Improve without breaking behavior.',
    } as Record<ProjectCheckpointId, string>)[checkpoint.id],
    active: progress.currentCheckpoint === checkpoint.id,
    done: progress.completedCheckpoints.includes(checkpoint.id),
    available: progress.completedCheckpoints.includes(checkpoint.id) || index <= currentIndex,
  }))

  return (
    <Layout
      showBack
      backTo={`/phase/${project.milestonePhaseId}`}
      backLabel={`${t.back} ${project.milestonePhaseId}`}
      title={`${t.title} · ${project.title[lang]}`}
    >
      <div className="learning-workspace">
        <div className="learning-workspace__grid">
          <aside className="learning-workspace__aside">
            <LearningStageRail
              items={stageItems}
              currentId={progress.currentCheckpoint}
              onSelect={id => openCheckpoint(id as ProjectCheckpointId)}
              label={lang === 'pt' ? 'Ciclo profissional do projeto' : 'Professional project cycle'}
              compactLabel={t.workflow}
            />
          </aside>
          <main className="learning-reading-column learning-content-stack" data-testid="project-workspace-v25">
            <LearningHero
              eyebrow={`${t.title} · ${t.workflow}`}
              title={project.title[lang]}
              description={project.subtitle[lang]}
              icon={project.icon}
              current={currentIndex + 1}
              total={CHECKPOINTS.length}
              progress={completionPercent}
              progressLabel={lang === 'pt' ? 'Progresso do projeto' : 'Project progress'}
              secondaryLabel={`${progress.completedCheckpoints.length}/${CHECKPOINTS.length} · ≈ ${project.estimatedMinutes} min`}
              action={<Badge>{t.workflow}</Badge>}
            />

            <LearningCallout variant="professional" title={lang === 'pt' ? 'O problema real' : 'The real problem'}>
              <p className="m-0">{project.scenario[lang]}</p>
              <p className="mt-2 mb-0 text-xs">{project.professionalContext[lang]}</p>
            </LearningCallout>

        {progress.currentCheckpoint === 'understand' && <Card padding="lg">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.understandTitle}</h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.understandHelp}</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {([
              ['inputs', t.inputs, project.inputContract[lang]],
              ['output', t.output, project.outputContract[lang]],
              ['rules', t.rules, project.ruleContract[lang]],
              ['edgeCase', t.edge, project.edgeCases[lang]],
            ] as const).map(([key, label, placeholder]) => <label key={key} className="block">
              <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>{label} · {t.required}</span>
              <textarea
                rows={4}
                value={progress.understanding[key]}
                onChange={event => patchUnderstanding(key, event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl p-3 text-sm mt-1 resize-y"
                style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}
              />
            </label>)}
          </div>
        </Card>}

        {progress.currentCheckpoint === 'plan' && <Card padding="lg">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.planTitle}</h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.planHelp}</p>
          <div className="rounded-xl p-3 mt-4 text-sm" style={{ background: 'var(--c-purple-f)', color: 'var(--c-text2)', border: '1px solid var(--c-purple-dm)' }}>
            {project.requirements[lang].map((item, index) => <div key={item}>{index + 1}. {item}</div>)}
          </div>
          <label className="block mt-4">
            <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Pseudocódigo · {t.required}</span>
            <textarea
              rows={10}
              value={progress.pseudocode}
              onChange={event => persist({ pseudocode: event.target.value })}
              placeholder={lang === 'pt' ? 'RECEBER...\nGUARDAR...\nAPLICAR...\nTESTAR...\nMOSTRAR...' : 'RECEIVE...\nSTORE...\nAPPLY...\nTEST...\nSHOW...'}
              className="w-full rounded-xl p-3 text-sm mt-1 font-mono resize-y"
              style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}
            />
          </label>
        </Card>}

        {progress.currentCheckpoint === 'build' && <div className="space-y-4">
          <Card padding="md">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.buildTitle}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.buildHelp}</p>
            <div className="mt-3 text-xs" style={{ color: 'var(--c-muted)' }}>{t.suggested}</div>
            <pre className="rounded-lg p-3 mt-1 text-xs overflow-x-auto" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text2)' }}>{project.tests[0]?.inputs.join('\n') || '—'}</pre>
            <div className="mt-3 text-xs" style={{ color: 'var(--c-muted)' }}>{t.expected}</div>
            <pre className="rounded-lg p-3 mt-1 text-xs overflow-x-auto" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text2)' }}>{project.tests[0]?.expectedOutput.join('\n') || '—'}</pre>
          </Card>
          <VSCodeEditor value={progress.code} onChange={code => persist({ code, testResults: [], testedCode: '' })} filename={`${project.id}.py`} label={project.title[lang]} />
          <Button onClick={runBuild} loading={running} fullWidth>{running ? t.running : t.run}</Button>
          {progress.output && <Card padding="md"><div className="text-xs uppercase" style={{ color: 'var(--c-muted)' }}>{t.outputLabel}</div><pre className="mt-2 text-xs whitespace-pre-wrap overflow-x-auto" style={{ color: progress.output.startsWith('ERROR:') ? '#fca5a5' : 'var(--c-text2)' }}>{progress.output}</pre></Card>}
        </div>}

        {progress.currentCheckpoint === 'test' && <div className="space-y-4" data-testid="project-test-checkpoint">
          <Card padding="lg">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.testTitle}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.testHelp}</p>
            <Alert variant="info" className="mt-4">{t.testGoal}</Alert>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>
              {[t.testStep1, t.testStep2, t.testStep3, t.testStep4].map((step, index) => <li key={step} className="flex gap-3"><strong className="shrink-0" style={{ color: 'var(--c-purple)' }}>{index + 1}.</strong><span>{step}</span></li>)}
            </ol>
            <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: 'var(--c-purple-f)', color: 'var(--c-text2)', border: '1px solid var(--c-purple-dm)' }}>
              <strong style={{ color: 'var(--c-text)' }}>{t.testWhy}</strong>
              <div className="mt-2">{t.testDone}</div>
            </div>
          </Card>

          {progress.testResults.length === 0
            ? <Alert variant="info">{t.testsNotRun}</Alert>
            : allTestsPassed
              ? <Alert variant="success">{t.testsAllPassed}</Alert>
              : <Alert variant="warning">{t.testsNeedWork}</Alert>}

          {project.tests.map((test, index) => {
            const status = progress.testResults.find(result => result.id === test.id)
            return <Card key={test.id} variant={status?.passed ? 'success' : status ? 'warning' : 'subtle'} padding="md" data-testid={`project-test-scenario-${index + 1}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{lang === 'pt' ? `Cenário ${index + 1}` : `Scenario ${index + 1}`}</Badge>
                    <div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{test.title[lang]}</div>
                  </div>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{t.inputOrder}</div>
                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-lg p-3 text-xs" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text2)' }}>{test.inputs.length ? test.inputs.map((value, inputIndex) => `${inputIndex + 1}. ${value}`).join('\n') : '—'}</pre>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{t.expectedResult}</div>
                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-lg p-3 text-xs" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text2)' }}>{test.expectedOutput.length ? test.expectedOutput.join('\n') : '—'}</pre>
                </div>
                {status && <Badge variant={status.passed ? 'success' : 'warning'}>{status.passed ? t.testPassed : t.testFailed}</Badge>}
              </div>
              {status && !status.passed && <div className="mt-3 rounded-lg border border-line p-3"><div className="text-xs font-semibold" style={{ color: 'var(--c-text)' }}>{lang === 'pt' ? 'Resultado encontrado' : 'Observed result'}</div><pre className="mt-2 whitespace-pre-wrap text-xs" style={{ color: 'var(--c-text2)' }}>{status.details}</pre></div>}
            </Card>
          })}
          <Button data-testid="project-run-all-tests" onClick={runTests} loading={running} fullWidth>{t.runTests}</Button>
          {progress.testResults.length > 0 && !allTestsPassed && <Button variant="secondary" onClick={() => openCheckpoint('build')} fullWidth>← {t.backToBuild}</Button>}
        </div>}

        {progress.currentCheckpoint === 'refactor' && <div className="space-y-4">
          <Card padding="lg">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.refactorTitle}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.refactorHelp}</p>
            <div className="space-y-2 mt-4">
              {project.refactorOptions.map((option, index) => {
                const checked = progress.selectedRefactors.includes(index)
                return <label key={index} className="flex gap-3 items-start rounded-xl p-3 cursor-pointer" style={{ background: checked ? 'var(--c-purple-f)' : 'var(--c-bg)', border: '1px solid var(--c-border)' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => persist({ selectedRefactors: checked ? progress.selectedRefactors.filter(value => value !== index) : [...progress.selectedRefactors, index] })}
                    className="mt-1"
                  />
                  <span className="text-sm" style={{ color: 'var(--c-text2)' }}>{option[lang]}</span>
                </label>
              })}
            </div>
          </Card>
          <VSCodeEditor value={progress.code} onChange={code => persist({ code, testResults: [], testedCode: '' })} filename={`${project.id}.py`} label={project.title[lang]} />
          <Button onClick={runTests} loading={running} fullWidth>{t.runTests}</Button>
          {progress.completed && <Card variant="success" padding="lg">
            <div className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>🎉 {t.completed}</div>
            <div className="text-sm mt-3" style={{ color: 'var(--c-text2)' }}>{t.accomplishment}:</div>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: 'var(--c-text2)' }}>{project.accomplishment.map(item => <li key={item.en}>✓ {item[lang]}</li>)}</ul>
          </Card>}
        </div>}

        {message && <Alert variant={progress.completed ? 'success' : 'info'}>{message}</Alert>}

        <StickyLearningActions
          status={`${currentIndex + 1}/${CHECKPOINTS.length} · ${t.saved}`}
          previous={(
            <Button variant="secondary" disabled={currentIndex === 0} onClick={() => openCheckpoint(CHECKPOINTS[currentIndex - 1].id)}>
              ← {lang === 'pt' ? 'Checkpoint anterior' : 'Previous checkpoint'}
            </Button>
          )}
          next={!progress.completed
            ? <Button onClick={completeCheckpoint}>{progress.currentCheckpoint === 'refactor' ? t.finish : t.next} →</Button>
            : <Button variant="success" onClick={() => navigate(`/phase/${project.milestonePhaseId}`)}>{t.openPhase} →</Button>}
        />
        <div className="h-4" />
          </main>
        </div>
      </div>
    </Layout>
  )
}
