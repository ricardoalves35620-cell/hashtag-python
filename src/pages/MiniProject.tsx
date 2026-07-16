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
import { getMiniProjectGuide } from '../data/miniProjectGuides'
import { MiniProjectBuildGuide, MiniProjectGuidedPlan, MiniProjectImprovementGuide, MiniProjectMissionBrief, MiniProjectTestPurpose } from '../components/learning/MiniProjectGuidePanels'
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
  { id: 'understand', icon: '🎯', en: 'Understand the mission', pt: 'Entender a missão' },
  { id: 'plan', icon: '🧩', en: 'Make a recipe', pt: 'Fazer uma receita' },
  { id: 'build', icon: '🐍', en: 'Finish the code', pt: 'Montar o programa' },
  { id: 'test', icon: '🧪', en: 'Try examples', pt: 'Testar exemplos' },
  { id: 'refactor', icon: '✨', en: 'Make it clearer', pt: 'Deixar mais claro' },
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
  const guide = getMiniProjectGuide(projectId)
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
      title: 'Mini-project', back: 'Phase', workflow: '5 simple steps',
      saved: 'Step saved on this device', synced: 'Step saved', next: 'Finish this step and continue',
      finish: 'Finish project', required: 'Fill in this box', optional: 'You may leave this blank',
      understandTitle: 'Step 1: understand the mission', understandHelp: 'Do not code yet. First, read the story and make sure you know what someone will type, what the program will do, and what must appear on the screen.',
      inputs: 'What will the person type?', output: 'What must appear on the screen?', rules: 'What must the program do with the values?', edge: 'What unusual case must still work?',
      planTitle: 'Step 2: turn the mission into a recipe', planHelp: 'Pseudocode is a recipe written with normal words. Each line says one small action. It is not Python yet.',
      buildTitle: 'Step 3: finish the program', buildHelp: 'Follow the build order below. Change one TODO at a time. Then run the program with the example values. The app sends values to input() from top to bottom.',
      suggested: 'Inputs for this run', expected: 'Expected visible result for the guided run', run: 'Run with these inputs', running: 'Running', outputLabel: 'Console output', resetInputs: 'Restore suggested values', inputField: 'Input', buildDone: 'You are done here when you changed the starter code and this run finishes without a Python error.',
      testTitle: 'Step 4: try different examples', testHelp: 'The app will run the same program several times. Each scenario checks a different promise from the mission.', runTests: 'Run all tests',
      testGoal: 'Goal: see whether the same program works with easy values, different values and the trickiest case in this project.',
      testStep1: 'Read one example at a time. The numbered values will enter input() from number 1 to the last number.',
      testStep2: 'Before clicking the button, read what should appear. Try to guess whether your code will get that result.',
      testStep3: 'Click Run all examples. The app types the values for you and starts the program again for each example.',
      testStep4: 'Green means that example worked. Needs work shows what your program produced so you know what to fix.',
      testWhy: 'Why try more than one example? A program may work once by luck and still break with another value.',
      testDone: 'You are done when every example is green. Then click Finish this step and continue.',
      inputOrder: 'Values entered into input(), in order', expectedResult: 'What must appear in the output',
      testsNotRun: 'The scenarios have not been executed with this version of the code yet.', testsAllPassed: 'All scenarios passed with the current code.', testsNeedWork: 'One or more examples did not work. Read the found result, return to Finish the code, change one thing and try all examples again.', backToBuild: 'Return to Finish the code',
      refactorTitle: 'Step 5: make one small improvement', refactorHelp: 'The program already works. Do not add a new feature. Choose one small change, make it, explain it, and run every scenario again.',
      completed: 'Project completed', accomplishment: 'You can now', openPhase: 'Return to phase',
      needUnderstand: 'Complete the input, output, rules, and edge-case fields.', needPlan: 'Write at least three clear pseudocode steps.',
      needBuild: 'Change the starter code and run it without an error.', needTests: 'All project tests must pass.', needRefactor: 'Choose one improvement, change the code, explain why you changed it and make every example green again.',
      noOutput: 'The program finished without printing output.', testPassed: 'Passed', testFailed: 'Needs work', nodeMissing: 'Your code is still missing one or more Python pieces requested by the project. Check the build guide and the TODO comments.', doNow: 'What to do now', whyItMatters: 'Why this matters', finishWhen: 'How to know you are done', refactorStep1: 'Choose one improvement below.', refactorStep2: 'Apply that improvement in the editor. The code must really change.', refactorStep3: 'Write a short note explaining what you changed and why it is better.', refactorStep4: 'Run the complete verification again. Finish only when every scenario is green.', refactorNote: 'What did you improve and why?', refactorNotePlaceholder: 'I changed... This is better because...', verifyImprovement: 'Verify improvement with all tests', selectedCheck: 'Improvement selected', codeChangedCheck: 'Code changed after the verified version', noteCheck: 'Reason explained', testsCheck: 'All scenarios rerun and green', readyToFinish: 'The improvement is proven. You can complete the project.', notReadyToFinish: 'Complete every item below before finishing the project.',
    },
    pt: {
      title: 'Mini projeto', back: 'Fase', workflow: '5 passos simples',
      saved: 'Passo salvo neste aparelho', synced: 'Passo salvo', next: 'Terminar este passo e continuar',
      finish: 'Terminar projeto', required: 'Preencha esta caixa', optional: 'Você pode deixar em branco',
      understandTitle: 'Passo 1: entender a missão', understandHelp: 'Ainda não programe. Primeiro, leia a história e entenda o que a pessoa vai digitar, o que o programa fará e o que precisa aparecer na tela.',
      inputs: 'O que a pessoa vai digitar?', output: 'O que precisa aparecer na tela?', rules: 'O que o programa deve fazer com os valores?', edge: 'Qual caso diferente também precisa funcionar?',
      planTitle: 'Passo 2: transformar a missão em uma receita', planHelp: 'Pseudocódigo é uma receita escrita com palavras normais. Cada linha diz uma ação pequena. Ainda não é código Python.',
      buildTitle: 'Passo 3: terminar o programa', buildHelp: 'Siga a ordem de montagem abaixo. Resolva um TODO por vez. Depois execute com os valores do exemplo. O app envia os valores ao input() de cima para baixo.',
      suggested: 'Entradas desta execução', expected: 'Resultado visível esperado na execução guiada', run: 'Executar com estas entradas', running: 'Executando', outputLabel: 'Saída do console', resetInputs: 'Restaurar valores sugeridos', inputField: 'Entrada', buildDone: 'Você termina aqui quando altera o código inicial e esta execução termina sem erro de Python.',
      testTitle: 'Passo 4: tentar exemplos diferentes', testHelp: 'O app executará o mesmo programa várias vezes. Cada cenário confere uma promessa diferente da missão.', runTests: 'Testar todos os exemplos',
      testGoal: 'Objetivo: ver se o mesmo programa funciona com valores fáceis, valores diferentes e o caso mais difícil deste projeto.',
      testStep1: 'Leia um exemplo por vez. Os valores numerados entrarão no input() do número 1 até o último.',
      testStep2: 'Antes de clicar no botão, leia o que deve aparecer. Tente adivinhar se o seu código chegará nesse resultado.',
      testStep3: 'Clique em Testar todos os exemplos. O app digita os valores para você e começa o programa de novo em cada exemplo.',
      testStep4: 'Verde significa que o exemplo funcionou. Precisa de ajuste mostra o que o seu programa produziu para você saber o que corrigir.',
      testWhy: 'Por que tentar mais de um exemplo? Um programa pode funcionar uma vez por sorte e ainda quebrar com outro valor.',
      testDone: 'Você termina quando todos os exemplos estiverem verdes. Depois clique em Terminar este passo e continuar.',
      inputOrder: 'Valores digitados no input(), na ordem', expectedResult: 'O que precisa aparecer na saída',
      testsNotRun: 'Os cenários ainda não foram executados com esta versão do código.', testsAllPassed: 'Todos os cenários passaram com o código atual.', testsNeedWork: 'Um ou mais exemplos não funcionaram. Leia o resultado encontrado, volte para Montar o programa, mude uma coisa e teste todos os exemplos de novo.', backToBuild: 'Voltar para Montar o programa',
      refactorTitle: 'Passo 5: fazer uma pequena melhoria', refactorHelp: 'O programa já funciona. Não crie uma função nova. Escolha uma pequena mudança, faça, explique e execute todos os cenários novamente.',
      completed: 'Projeto concluído', accomplishment: 'Agora você consegue', openPhase: 'Voltar para a fase',
      needUnderstand: 'Preencha os campos de entrada, saída, regras e caso limite.', needPlan: 'Escreva pelo menos três passos claros de pseudocódigo.',
      needBuild: 'Altere o código inicial e execute sem erro.', needTests: 'Todos os testes do projeto precisam passar.', needRefactor: 'Escolha uma melhoria, mude o código, explique por que mudou e deixe todos os exemplos verdes novamente.',
      noOutput: 'O programa terminou sem imprimir uma saída.', testPassed: 'Aprovado', testFailed: 'Precisa de ajuste', nodeMissing: 'Ainda falta uma ou mais peças de Python pedidas pelo projeto. Confira o guia de montagem e os comentários TODO.', doNow: 'O que fazer agora', whyItMatters: 'Por que isso importa', finishWhen: 'Como saber que terminou', refactorStep1: 'Escolha uma melhoria abaixo.', refactorStep2: 'Aplique essa melhoria no editor. O código precisa mudar de verdade.', refactorStep3: 'Escreva uma nota curta explicando o que mudou e por que ficou melhor.', refactorStep4: 'Execute a verificação completa novamente. Só finalize quando todos os cenários estiverem verdes.', refactorNote: 'O que você melhorou e por quê?', refactorNotePlaceholder: 'Eu alterei... Isso ficou melhor porque...', verifyImprovement: 'Comprovar melhoria com todos os testes', selectedCheck: 'Melhoria escolhida', codeChangedCheck: 'Código alterado depois da versão verificada', noteCheck: 'Motivo explicado', testsCheck: 'Todos os cenários executados novamente e verdes', readyToFinish: 'A melhoria foi comprovada. Você pode concluir o projeto.', notReadyToFinish: 'Conclua todos os itens abaixo antes de finalizar o projeto.',
    },
  })[lang], [lang])

  if (!project || !guide) {
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

  const fillGuidedUnderstanding = () => {
    persist({
      understanding: {
        inputs: guide.understandAnswers.inputs[lang],
        output: guide.understandAnswers.output[lang],
        rules: guide.understandAnswers.rules[lang],
        edgeCase: guide.understandAnswers.edgeCase[lang],
      },
    })
  }

  const fillGuidedPlan = () => {
    persist({ pseudocode: guide.planSteps.map(step => step[lang]).join('\n') })
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
      understand: lang === 'pt' ? 'Descubra entrada, regra e saída.' : 'Find the input, rule and output.',
      plan: lang === 'pt' ? 'Escreva uma receita simples.' : 'Write a simple recipe.',
      build: lang === 'pt' ? 'Resolva um TODO por vez.' : 'Solve one TODO at a time.',
      test: lang === 'pt' ? 'Tente exemplos diferentes.' : 'Try different examples.',
      refactor: lang === 'pt' ? 'Faça uma mudança pequena e clara.' : 'Make one small clear change.',
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
              label={lang === 'pt' ? '5 passos do projeto' : '5 project steps'}
              compactLabel={t.workflow}
            />
          </aside>
          <main className="learning-reading-column learning-content-stack mini-project-main" data-testid="project-workspace-v25">
            <LearningHero
              eyebrow={`${t.title} · ${t.workflow}`}
              title={project.title[lang]}
              description={guide.mission[lang]}
              icon={project.icon}
              current={currentIndex + 1}
              total={CHECKPOINTS.length}
              progress={completionPercent}
              progressLabel={lang === 'pt' ? 'Progresso do projeto' : 'Project progress'}
              secondaryLabel={`${progress.completedCheckpoints.length}/${CHECKPOINTS.length} · ≈ ${project.estimatedMinutes} min`}
              action={<Badge>{t.workflow}</Badge>}
            />

            <LearningCallout variant="professional" title={lang === 'pt' ? 'Leia isto antes de digitar' : 'Read this before typing'}>
              <p className="m-0 text-sm leading-relaxed">{guide.story[lang]}</p>
              <p className="mt-3 mb-0 text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{guide.result[lang]}</p>
            </LearningCallout>

        {progress.currentCheckpoint === 'understand' && <Card padding="lg">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.understandTitle}</h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.understandHelp}</p>
          <MiniProjectMissionBrief guide={guide} lang={lang} onUseAnswers={fillGuidedUnderstanding} />
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {([
              ['inputs', t.inputs, guide.understandAnswers.inputs[lang]],
              ['output', t.output, guide.understandAnswers.output[lang]],
              ['rules', t.rules, guide.understandAnswers.rules[lang]],
              ['edgeCase', t.edge, guide.understandAnswers.edgeCase[lang]],
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
          <MiniProjectGuidedPlan guide={guide} lang={lang} onUsePlan={fillGuidedPlan} />
          <label className="block mt-4">
            <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Pseudocódigo · {t.required}</span>
            <textarea
              rows={10}
              value={progress.pseudocode}
              onChange={event => persist({ pseudocode: event.target.value })}
              placeholder={guide.planSteps.map(step => step[lang]).join('\n')}
              className="w-full rounded-xl p-3 text-sm mt-1 font-mono resize-y"
              style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}
            />
          </label>
        </Card>}

        {progress.currentCheckpoint === 'build' && <div className="space-y-4">
          <Card padding="lg" className="mini-project-instructions">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.buildTitle}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.buildHelp}</p>
            <MiniProjectBuildGuide guide={guide} lang={lang} />
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
                  <MiniProjectTestPurpose guide={guide} testId={test.id} lang={lang} />
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

            <MiniProjectImprovementGuide
              guide={guide}
              lang={lang}
              selectedIndex={progress.selectedRefactors[0]}
              onSelect={index => persist({ selectedRefactors: [index], testResults: [], testedCode: '' })}
            />

            <label className="block mt-4">
              <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>{t.refactorNote} · {t.required}</span>
              <textarea
                rows={4}
                value={progress.refactorNote}
                onChange={event => persist({ refactorNote: event.target.value })}
                placeholder={guide.improveNoteExample[lang]}
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
              ← {lang === 'pt' ? 'Passo anterior' : 'Previous step'}
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
