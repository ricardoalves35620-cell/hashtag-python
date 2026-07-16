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
  { id: 'refactor', icon: '✨', en: 'Improve & prove', pt: 'Melhorar e comprovar' },
]

function checkpointIndex(id: ProjectCheckpointId) {
  return CHECKPOINTS.findIndex(item => item.id === id)
}

function includesExpected(output: string, expected: string) {
  return normalizeAssessmentText(output).includes(normalizeAssessmentText(expected))
}

function extractInputPrompts(code: string) {
  return [...code.matchAll(/input\(\s*[\"']([^\"']*)[\"']/g)]
    .map(match => match[1].replace(/:\s*$/, '').trim())
    .filter(Boolean)
}

function buildInputLabel(prompts: string[], index: number, lang: 'en' | 'pt') {
  if (prompts[index]) return prompts[index]
  if (prompts.length > 0) {
    const repeated = prompts[prompts.length - 1]
    const repetition = index - prompts.length + 2
    return `${repeated} ${repetition}`
  }
  return `${lang === 'pt' ? 'Entrada' : 'Input'} ${index + 1}`
}

export default function MiniProject() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const { lang, learnerId, refreshProgress } = useApp()
  const project = getMiniProject(projectId)
  const starterCode = project?.starterCode[lang] || ''
  const initialInputs = project?.tests[0]?.inputs || []
  const [progress, setProgress] = useState<MiniProjectProgress>(() => project
    ? loadLocalProjectProgress(learnerId || 'guest', project.id, starterCode, initialInputs)
    : createMiniProjectProgress(projectId, starterCode, initialInputs))
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('')
  const hydrationToken = useRef(0)

  useEffect(() => {
    if (!project || !learnerId) return
    const token = ++hydrationToken.current
    const local = loadLocalProjectProgress(learnerId, project.id, starterCode, initialInputs)
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
  }, [initialInputs, learnerId, project, starterCode])

  useEffect(() => { scrollToTop() }, [projectId])

  const t = useMemo(() => ({
    en: {
      title: 'Block mini-project', back: 'Phase', workflow: 'Professional workflow',
      saved: 'Saved on this device', synced: 'Checkpoint saved', next: 'Complete checkpoint and continue',
      finish: 'Complete project', required: 'Required project artifact', optional: 'Optional note',
      understandTitle: 'Define the contract before coding', understandHelp: 'These fields are part of the project plan, not a personal journal. A developer must be able to state what enters, what leaves, and which rule is being implemented.',
      inputs: 'What enters the program?', output: 'What must the program produce?', rules: 'Which rules transform input into output?', edge: 'Which edge case will you test?',
      planTitle: 'Write the solution as ordered steps', planHelp: 'Do not write Python yet. Your pseudocode should be precise enough that each line can later become a small piece of code.',
      buildTitle: 'Implement one responsibility at a time', buildHelp: 'Edit the code, then run it with the real input fields below. The app sends those values to input() in the displayed order. This checkpoint only proves that the program runs; behavior is verified next.',
      suggested: 'Inputs for this run', expected: 'Expected visible result for the guided run', run: 'Run with these inputs', running: 'Running', outputLabel: 'Console output', resetInputs: 'Restore suggested values', inputField: 'Input', buildDone: 'You are done here when you changed the starter code and this run finishes without a Python error.',
      testTitle: 'Prove behavior with multiple tests', testHelp: 'A single example is not proof. Here you will run the same program with different inputs and compare every result with the expected output.', runTests: 'Run all tests',
      testGoal: 'Goal: confirm that your program works in the normal case, in a different valid case and at the important limit defined for this project.',
      testStep1: 'Review each scenario below. The listed values will be entered into input() in exactly that order.',
      testStep2: 'Read the expected output before running. Predict which scenarios should pass and which may reveal a problem.',
      testStep3: 'Select Run all tests on this page. You do not need to type the values manually: the app sends each listed value to input() in order and starts a fresh copy of the code for every scenario.',
      testStep4: 'A green Passed badge means the visible result and required Python structure matched. Needs work shows what the program actually returned.',
      testWhy: 'Why multiple tests matter: code that works for one prepared example may still fail with another valid value or a boundary case.',
      testDone: 'This checkpoint is complete when every scenario is green. Then use Complete checkpoint and continue below.',
      inputOrder: 'Values entered into input(), in order', expectedResult: 'What must appear in the output',
      testsNotRun: 'The scenarios have not been executed with this version of the code yet.', testsAllPassed: 'All scenarios passed with the current code.', testsNeedWork: 'Some scenarios need adjustment. Read the result, return to Implement, change one cause and run all tests again.', backToBuild: 'Return to Implement and fix the code',
      refactorTitle: 'Make one improvement and prove it is safe', refactorHelp: 'This is not another coding puzzle. Choose one concrete improvement, change the code, explain why the change helps, and rerun every scenario. A checkbox records your plan; it is not proof by itself.',
      completed: 'Project completed', accomplishment: 'You can now', openPhase: 'Return to phase',
      needUnderstand: 'Complete the input, output, rules, and edge-case fields.', needPlan: 'Write at least three clear pseudocode steps.',
      needBuild: 'Change the starter code and run it without an error.', needTests: 'All project tests must pass.', needRefactor: 'Choose an improvement, actually change the verified code, explain the reason in at least 20 characters, and rerun all tests successfully.',
      noOutput: 'The program finished without printing output.', testPassed: 'Passed', testFailed: 'Needs work', nodeMissing: 'One or more required Python structures, imports, functions or the main guard were not found.', doNow: 'What to do now', whyItMatters: 'Why this matters', finishWhen: 'How to know you are done', refactorStep1: 'Choose one improvement below.', refactorStep2: 'Apply that improvement in the editor. The code must really change.', refactorStep3: 'Write a short note explaining what you changed and why it is better.', refactorStep4: 'Run the complete verification again. Finish only when every scenario is green.', refactorNote: 'What did you improve and why?', refactorNotePlaceholder: 'I changed... This is better because...', verifyImprovement: 'Verify improvement with all tests', selectedCheck: 'Improvement selected', codeChangedCheck: 'Code changed after the verified version', noteCheck: 'Reason explained', testsCheck: 'All scenarios rerun and green', readyToFinish: 'The improvement is proven. You can complete the project.', notReadyToFinish: 'Complete every item below before finishing the project.',
    },
    pt: {
      title: 'Mini projeto do bloco', back: 'Fase', workflow: 'Fluxo profissional',
      saved: 'Salvo neste aparelho', synced: 'Checkpoint salvo', next: 'Concluir checkpoint e continuar',
      finish: 'Concluir projeto', required: 'Artefato obrigatório do projeto', optional: 'Anotação opcional',
      understandTitle: 'Defina o contrato antes de programar', understandHelp: 'Esses campos fazem parte do planejamento do projeto, não são diário pessoal. Um desenvolvedor precisa declarar o que entra, o que sai e qual regra será implementada.',
      inputs: 'O que entra no programa?', output: 'O que o programa precisa produzir?', rules: 'Quais regras transformam entrada em saída?', edge: 'Qual caso limite você vai testar?',
      planTitle: 'Escreva a solução como passos ordenados', planHelp: 'Ainda não escreva Python. O pseudocódigo deve ser preciso o bastante para que cada linha depois vire uma pequena parte do código.',
      buildTitle: 'Implemente uma responsabilidade por vez', buildHelp: 'Edite o código e depois execute usando os campos reais abaixo. O app envia esses valores ao input() na ordem mostrada. Este checkpoint comprova apenas que o programa executa; o comportamento será verificado no próximo.',
      suggested: 'Entradas desta execução', expected: 'Resultado visível esperado na execução guiada', run: 'Executar com estas entradas', running: 'Executando', outputLabel: 'Saída do console', resetInputs: 'Restaurar valores sugeridos', inputField: 'Entrada', buildDone: 'Você termina aqui quando altera o código inicial e esta execução termina sem erro de Python.',
      testTitle: 'Comprove o comportamento com vários testes', testHelp: 'Um único exemplo não é prova. Aqui você executará o mesmo programa com entradas diferentes e comparará cada resultado com a saída esperada.', runTests: 'Executar todos os testes',
      testGoal: 'Objetivo: confirmar que o programa funciona no caso normal, em outro caso válido e no limite importante definido para este projeto.',
      testStep1: 'Leia cada cenário abaixo. Os valores listados serão digitados no input() exatamente nessa ordem.',
      testStep2: 'Leia a saída esperada antes de executar. Preveja quais cenários devem passar e quais podem revelar um problema.',
      testStep3: 'Selecione Executar todos os testes nesta página. Você não precisa digitar os valores manualmente: o app envia cada valor listado ao input() na ordem e inicia uma cópia nova do código para cada cenário.',
      testStep4: 'O selo verde Aprovado significa que o resultado visível e a estrutura Python obrigatória conferiram. Precisa de ajuste mostra o que o programa realmente devolveu.',
      testWhy: 'Por que vários testes importam: um código que funciona para um exemplo preparado ainda pode falhar com outro valor válido ou com um caso limite.',
      testDone: 'Este checkpoint termina quando todos os cenários estiverem verdes. Depois use Concluir checkpoint e continuar logo abaixo.',
      inputOrder: 'Valores digitados no input(), na ordem', expectedResult: 'O que precisa aparecer na saída',
      testsNotRun: 'Os cenários ainda não foram executados com esta versão do código.', testsAllPassed: 'Todos os cenários passaram com o código atual.', testsNeedWork: 'Alguns cenários precisam de ajuste. Leia o resultado, volte para Implementar, altere uma causa e execute todos os testes novamente.', backToBuild: 'Voltar para Implementar e corrigir o código',
      refactorTitle: 'Faça uma melhoria e comprove que ela é segura', refactorHelp: 'Isto não é outro desafio de código. Escolha uma melhoria concreta, altere o código, explique por que a mudança ajuda e execute todos os cenários novamente. Marcar uma caixa registra seu plano; sozinho, isso não é prova.',
      completed: 'Projeto concluído', accomplishment: 'Agora você consegue', openPhase: 'Voltar para a fase',
      needUnderstand: 'Preencha os campos de entrada, saída, regras e caso limite.', needPlan: 'Escreva pelo menos três passos claros de pseudocódigo.',
      needBuild: 'Altere o código inicial e execute sem erro.', needTests: 'Todos os testes do projeto precisam passar.', needRefactor: 'Escolha uma melhoria, altere de verdade o código verificado, explique o motivo com pelo menos 20 caracteres e execute todos os testes com sucesso.',
      noOutput: 'O programa terminou sem imprimir uma saída.', testPassed: 'Aprovado', testFailed: 'Precisa de ajuste', nodeMissing: 'Uma ou mais estruturas, importações, funções ou o main guard obrigatórios não foram encontrados.', doNow: 'O que fazer agora', whyItMatters: 'Por que isso importa', finishWhen: 'Como saber que terminou', refactorStep1: 'Escolha uma melhoria abaixo.', refactorStep2: 'Aplique essa melhoria no editor. O código precisa mudar de verdade.', refactorStep3: 'Escreva uma nota curta explicando o que mudou e por que ficou melhor.', refactorStep4: 'Execute a verificação completa novamente. Só finalize quando todos os cenários estiverem verdes.', refactorNote: 'O que você melhorou e por quê?', refactorNotePlaceholder: 'Eu alterei... Isso ficou melhor porque...', verifyImprovement: 'Comprovar melhoria com todos os testes', selectedCheck: 'Melhoria escolhida', codeChangedCheck: 'Código alterado depois da versão verificada', noteCheck: 'Motivo explicado', testsCheck: 'Todos os cenários executados novamente e verdes', readyToFinish: 'A melhoria foi comprovada. Você pode concluir o projeto.', notReadyToFinish: 'Conclua todos os itens abaixo antes de finalizar o projeto.',
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
  const inputPrompts = extractInputPrompts(starterCode)
  const refactorSelected = progress.selectedRefactors.length > 0
  const refactorCodeChanged = progress.refactorBaselineCode.trim().length > 0
    && progress.code.trim() !== progress.refactorBaselineCode.trim()
  const refactorNoteComplete = progress.refactorNote.trim().length >= 20
  const refactorTestsPassed = refactorCodeChanged && allTestsPassed
  const refactorReady = refactorSelected && refactorCodeChanged && refactorNoteComplete && refactorTestsPassed

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
      return refactorReady ? '' : t.needRefactor
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
      ...(progress.currentCheckpoint === 'test'
        ? { refactorBaselineCode: progress.code, refactorNote: '', selectedRefactors: [] }
        : {}),
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
      const result = await runCode(progress.code, progress.buildInputs)
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
      refactor: lang === 'pt' ? 'Altere, explique e teste novamente.' : 'Change, explain, and test again.',
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
      <div className="learning-workspace mini-project-workspace">
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
          <main className="learning-reading-column learning-content-stack mini-project-main" data-testid="project-workspace-v25">
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
          <Card padding="lg" className="mini-project-instructions">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.buildTitle}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.buildHelp}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{t.suggested}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => persist({ buildInputs: [...initialInputs], output: '' })}
              >
                {t.resetInputs}
              </Button>
            </div>
            <div className="mini-project-input-grid mt-2" data-testid="project-build-inputs">
              {progress.buildInputs.length > 0
                ? progress.buildInputs.map((value, index) => (
                  <label key={`${project.id}-input-${index}`} className="mini-project-input-field">
                    <span>{buildInputLabel(inputPrompts, index, lang)}</span>
                    <input
                      value={value}
                      onChange={event => {
                        const buildInputs = [...progress.buildInputs]
                        buildInputs[index] = event.target.value
                        persist({ buildInputs, output: '' })
                      }}
                      inputMode="text"
                    />
                  </label>
                ))
                : <div className="text-sm" style={{ color: 'var(--c-muted)' }}>{lang === 'pt' ? 'Este programa não pede entradas pelo teclado.' : 'This program does not request keyboard input.'}</div>}
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{t.expected}</div>
            <pre className="rounded-lg p-3 mt-1 text-xs overflow-x-auto whitespace-pre-wrap" style={{ background: 'var(--c-code-bg)', color: 'var(--c-text2)' }}>{project.tests[0]?.expectedOutput.join('\n') || '—'}</pre>
            <Alert variant="info" className="mt-4">{t.buildDone}</Alert>
          </Card>
          <VSCodeEditor value={progress.code} onChange={code => persist({ code, testResults: [], testedCode: '', output: '' })} filename={`${project.id}.py`} label={project.title[lang]} />
          <Button data-testid="project-run-build" onClick={runBuild} loading={running} fullWidth>{running ? t.running : t.run}</Button>
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

          <Button data-testid="project-run-all-tests" onClick={runTests} loading={running} fullWidth>{t.runTests}</Button>

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
          {progress.testResults.length > 0 && !allTestsPassed && <Button variant="secondary" onClick={() => openCheckpoint('build')} fullWidth>← {t.backToBuild}</Button>}
        </div>}

        {progress.currentCheckpoint === 'refactor' && <div className="space-y-4" data-testid="project-improve-checkpoint">
          <Card padding="lg" className="mini-project-instructions">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.refactorTitle}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.refactorHelp}</p>

            <div className="mini-project-final-step mt-4">
              <section>
                <h3>{t.doNow}</h3>
                <ol>
                  {[t.refactorStep1, t.refactorStep2, t.refactorStep3, t.refactorStep4].map((step, index) => <li key={step}><strong>{index + 1}</strong><span>{step}</span></li>)}
                </ol>
              </section>
              <section>
                <h3>{t.whyItMatters}</h3>
                <p>{project.refactorGoal[lang]}</p>
              </section>
              <section>
                <h3>{t.finishWhen}</h3>
                <p>{project.refactorEvidence[lang]}</p>
              </section>
            </div>

            <div className="space-y-2 mt-4">
              {project.refactorOptions.map((option, index) => {
                const checked = progress.selectedRefactors.includes(index)
                return <label key={index} className="flex gap-3 items-start rounded-xl p-3 cursor-pointer" style={{ background: checked ? 'var(--c-purple-f)' : 'var(--c-bg)', border: '1px solid var(--c-border)' }}>
                  <input
                    type="radio"
                    name="project-improvement"
                    checked={checked}
                    onChange={() => persist({ selectedRefactors: [index], testResults: [], testedCode: '' })}
                    className="mt-1"
                  />
                  <span className="text-sm" style={{ color: 'var(--c-text2)' }}>{option[lang]}</span>
                </label>
              })}
            </div>

            <label className="block mt-4">
              <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>{t.refactorNote} · {t.required}</span>
              <textarea
                rows={4}
                value={progress.refactorNote}
                onChange={event => persist({ refactorNote: event.target.value })}
                placeholder={t.refactorNotePlaceholder}
                data-testid="project-refactor-note"
                className="w-full rounded-xl p-3 text-sm mt-1 resize-y"
                style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}
              />
            </label>
          </Card>

          <Card padding="md" variant={refactorReady ? 'success' : 'subtle'}>
            <div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{refactorReady ? t.readyToFinish : t.notReadyToFinish}</div>
            <div className="mini-project-proof-grid mt-3">
              {[
                [refactorSelected, t.selectedCheck],
                [refactorCodeChanged, t.codeChangedCheck],
                [refactorNoteComplete, t.noteCheck],
                [refactorTestsPassed, t.testsCheck],
              ].map(([done, label]) => <div key={String(label)} className={done ? 'is-done' : ''}><span aria-hidden="true">{done ? '✓' : '○'}</span><span>{label}</span></div>)}
            </div>
          </Card>

          <VSCodeEditor value={progress.code} onChange={code => persist({ code, testResults: [], testedCode: '' })} filename={`${project.id}.py`} label={project.title[lang]} />
          <Button data-testid="project-verify-improvement" onClick={runTests} loading={running} fullWidth>{t.verifyImprovement}</Button>

          {progress.testResults.length > 0 && (allTestsPassed
            ? <Alert variant="success">{t.testsAllPassed}</Alert>
            : <Alert variant="warning">{t.testsNeedWork}</Alert>)}

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
