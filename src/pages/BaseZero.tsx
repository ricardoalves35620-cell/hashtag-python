import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import GlossaryText from '../components/glossary/GlossaryText'
import GlossaryPanel from '../components/glossary/GlossaryPanel'
import { useApp } from '../contexts/AppContext'
import { BASE_ZERO_MODULES, BASE_ZERO_READINESS } from '../data/baseZero'
import {
  completeBaseZeroModule, isBaseZeroComplete, loadBaseZeroState, saveBaseZeroState,
  scoreClassification, scoreHardware, setReadinessScore, validateFileChallenge,
  validateInstallSequence, type BaseZeroModuleId, type InstallStep,
} from '../lib/baseZero'
import { markStepDone } from '../lib/progress'
import { getSkillsForPhase } from '../data/skills'

const INSTALL_LABELS: Record<InstallStep, { en: string; pt: string }> = {
  download: { en: 'Download from the official website', pt: 'Baixar do site oficial' },
  open: { en: 'Open the downloaded installer', pt: 'Abrir o instalador baixado' },
  path: { en: 'Check “Add Python to PATH”', pt: 'Marcar “Add Python to PATH”' },
  install: { en: 'Run the installation', pt: 'Executar a instalação' },
  verify: { en: 'Verify the installed version', pt: 'Verificar a versão instalada' },
}

export default function BaseZero() {
  const { lang, learnerId, refreshProgress, recordLearningAttempt } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const checkOnly = searchParams.get('mode') === 'check'
  const [state, setState] = useState(() => loadBaseZeroState(learnerId || 'guest'))
  const [active, setActive] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showAlternate, setShowAlternate] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [readinessAnswers, setReadinessAnswers] = useState<Record<number, number>>({})
  const [readinessResult, setReadinessResult] = useState<number | null>(null)

  const module = BASE_ZERO_MODULES[active]
  const completed = state.completed.includes(module.id)
  const allComplete = isBaseZeroComplete(state)
  const t = {
    en: {
      title: 'Base Zero · Digital foundations', intro: 'No assumptions. Learn the computer skills required to study Python independently.',
      progress: 'modules complete', understood: 'I understood — practice', otherWay: "I didn't understand",
      completeModule: 'Validate and complete module', completed: 'Module completed', next: 'Next module',
      finish: 'Finish Base Zero and start Python', visualizer: 'Open the visual Python lab',
      readinessTitle: 'Quick computer-readiness check', readinessText: 'Answer five questions. A score of 80% lets you skip the simulations; lower scores create a personalized starting point.',
      submitCheck: 'Check my readiness', skipReady: 'Ready — continue to Python exercises', needsBase: 'Start the guided Base Zero modules',
    },
    pt: {
      title: 'Base Zero · Fundamentos digitais', intro: 'Sem presumir conhecimento. Aprenda as habilidades de computador necessárias para estudar Python com autonomia.',
      progress: 'módulos concluídos', understood: 'Entendi — praticar', otherWay: 'Não entendi',
      completeModule: 'Validar e concluir módulo', completed: 'Módulo concluído', next: 'Próximo módulo',
      finish: 'Concluir Base Zero e começar Python', visualizer: 'Abrir laboratório visual de Python',
      readinessTitle: 'Teste rápido de preparo digital', readinessText: 'Responda cinco questões. Com 80%, você pode pular os simuladores; abaixo disso, o app indica o ponto de partida.',
      submitCheck: 'Verificar meu preparo', skipReady: 'Pronto — continuar para exercícios de Python', needsBase: 'Começar os módulos guiados da Base Zero',
    },
  }[lang]

  const persist = (next: typeof state) => {
    setState(next)
    saveBaseZeroState(learnerId || 'guest', next)
  }

  const completeModule = (moduleId: BaseZeroModuleId) => {
    const next = completeBaseZeroModule(state, moduleId)
    persist(next)
    recordLearningAttempt({ phaseId: 0, activity: 'exercise', itemId: `base-zero-${moduleId}`, skillIds: getSkillsForPhase(0), score: 100, passed: true })
    setFeedback(t.completed)
  }

  const finish = async () => {
    if (!learnerId || !allComplete) return
    setFinishing(true)
    try {
      await markStepDone(learnerId, 0, 'lesson')
      await refreshProgress()
      navigate('/phase/0/exercises')
    } finally {
      setFinishing(false)
    }
  }

  const submitReadiness = async () => {
    if (Object.keys(readinessAnswers).length !== BASE_ZERO_READINESS.length) return
    const correct = BASE_ZERO_READINESS.filter((question, index) => readinessAnswers[index] === question.correct).length
    const score = Math.round((correct / BASE_ZERO_READINESS.length) * 100)
    setReadinessResult(score)
    persist(setReadinessScore(state, score))
    recordLearningAttempt({ phaseId: 0, activity: 'diagnostic', itemId: 'digital-readiness', skillIds: getSkillsForPhase(0), score, passed: score >= 80 })
    if (score >= 80 && learnerId) {
      await markStepDone(learnerId, 0, 'lesson')
      await refreshProgress()
    }
  }

  if (checkOnly && readinessResult === null) {
    return (
      <Layout showBack backTo="/onboarding" title={t.readinessTitle} hideNav>
        <div className="p-4 space-y-4">
          <div className="rounded-xl p-4" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--c-text)' }}>{t.readinessTitle}</h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.readinessText}</p>
          </div>
          {BASE_ZERO_READINESS.map((question, index) => (
            <div key={index} className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
              <div className="text-sm font-medium mb-3" style={{ color: 'var(--c-text)' }}>{index + 1}. {question.question[lang]}</div>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <button key={option} onClick={() => setReadinessAnswers(previous => ({ ...previous, [index]: optionIndex }))} className="w-full text-left rounded-lg px-3 py-2.5 text-sm" style={{ background: readinessAnswers[index] === optionIndex ? 'var(--c-purple-dm)' : 'var(--c-bg)', color: readinessAnswers[index] === optionIndex ? 'var(--c-purple-l)' : 'var(--c-text2)', border: '1px solid var(--c-border)' }}>{option}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={submitReadiness} disabled={Object.keys(readinessAnswers).length !== BASE_ZERO_READINESS.length} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'var(--c-purple)' }}>{t.submitCheck}</button>
        </div>
      </Layout>
    )
  }

  if (checkOnly && readinessResult !== null) {
    const passed = readinessResult >= 80
    return (
      <Layout hideNav>
        <div className="p-6 min-h-[80dvh] flex items-center justify-center">
          <div className="w-full rounded-2xl p-6 text-center" style={{ background: 'var(--c-card)', border: `1px solid ${passed ? '#15803d' : '#7c5a13'}` }}>
            <div className="text-5xl mb-3">{passed ? '✅' : '🧭'}</div>
            <div className="text-4xl font-mono font-semibold" style={{ color: passed ? '#4ade80' : '#f8d477' }}>{readinessResult}%</div>
            <p className="text-sm mt-3 mb-5" style={{ color: 'var(--c-text2)' }}>{passed ? (lang === 'en' ? 'You demonstrated the digital foundations required to begin.' : 'Você demonstrou a base digital necessária para começar.') : (lang === 'en' ? 'The simulations will prevent small computer gaps from becoming Python problems.' : 'Os simuladores evitarão que pequenas lacunas de computador virem problemas em Python.')}</p>
            <button onClick={() => passed ? navigate('/phase/0/exercises') : navigate('/base-zero')} className="w-full rounded-xl py-3 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{passed ? t.skipReady : t.needsBase}</button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showBack backTo="/phase/0" title={t.title}>
      <div className="p-4 space-y-4">
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(145deg, var(--c-purple-f), var(--c-card))', border: '1px solid var(--c-purple-dm)' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-purple-l)' }}>Base Zero</div>
              <h1 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{t.title}</h1>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.intro}</p>
            </div>
            <GlossaryPanel lang={lang} />
          </div>
          <div className="mt-4 text-xs" style={{ color: 'var(--c-muted)' }}>{state.completed.length}/{BASE_ZERO_MODULES.length} {t.progress}</div>
          <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: 'var(--c-bg)' }}><div className="h-full rounded-full" style={{ width: `${(state.completed.length / BASE_ZERO_MODULES.length) * 100}%`, background: 'var(--c-purple)' }} /></div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {BASE_ZERO_MODULES.map((item, index) => (
            <button key={item.id} onClick={() => { setActive(index); setFeedback(''); setShowAlternate(false) }} className="rounded-xl px-3 py-2 text-xs flex-shrink-0" style={{ background: active === index ? 'var(--c-purple-dm)' : 'var(--c-card)', color: active === index ? 'var(--c-purple-l)' : 'var(--c-muted)', border: '1px solid var(--c-border)' }}>{state.completed.includes(item.id) ? '✅' : item.icon} {index + 1}</button>
          ))}
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="text-3xl mb-2">{module.icon}</div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{module.title[lang]}</h2>
          <div className="text-xs mt-1 mb-4" style={{ color: 'var(--c-purple-l)' }}>🎯 {module.goal[lang]}</div>
          <GlossaryText text={module.explanation[lang]} lang={lang} className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }} />
          <button onClick={() => setShowAlternate(value => !value)} className="text-xs rounded-lg px-3 py-2 mt-3" style={{ background: 'var(--c-bg)', color: 'var(--c-purple-l)', border: '1px solid var(--c-border)' }}>🤔 {t.otherWay}</button>
          {showAlternate && <div className="rounded-xl p-3 mt-2 text-sm" style={{ background: 'var(--c-purple-f)', color: 'var(--c-text2)', border: '1px solid var(--c-purple-dm)' }}><GlossaryText text={module.alternate[lang]} lang={lang} /></div>}
        </div>

        <ModuleChallenge moduleId={module.id} lang={lang} completed={completed} onComplete={() => completeModule(module.id)} setFeedback={setFeedback} />
        {feedback && <div className="rounded-xl p-3 text-sm" style={{ background: completed ? '#052e16' : 'var(--c-purple-f)', color: completed ? '#86efac' : 'var(--c-purple-l)', border: `1px solid ${completed ? '#15803d' : 'var(--c-purple-dm)'}` }}>{feedback}</div>}

        {completed && active < BASE_ZERO_MODULES.length - 1 && <button onClick={() => { setActive(value => value + 1); setFeedback(''); setShowAlternate(false) }} className="w-full rounded-xl py-3 text-sm font-semibold" style={{ background: 'var(--c-card)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}>{t.next} →</button>}

        <button onClick={() => navigate('/visualizer')} className="w-full rounded-xl p-4 text-left" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)', color: 'var(--c-purple-l)' }}>🧩 {t.visualizer} →</button>

        {allComplete && <button onClick={finish} disabled={finishing} className="w-full rounded-xl py-4 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{finishing ? '...' : t.finish} →</button>}
      </div>
    </Layout>
  )
}

function ModuleChallenge({ moduleId, lang, completed, onComplete, setFeedback }: { moduleId: BaseZeroModuleId; lang: 'en' | 'pt'; completed: boolean; onComplete: () => void; setFeedback: (message: string) => void }) {
  const [folder, setFolder] = useState('')
  const [file, setFile] = useState('')
  const [sequence, setSequence] = useState<InstallStep[]>([])
  const [classification, setClassification] = useState<Record<string, 'local' | 'cloud'>>({})
  const [terminalAnswer, setTerminalAnswer] = useState('')
  const [hardware, setHardware] = useState<Record<string, string>>({})
  const installChoices = useMemo(() => (Object.keys(INSTALL_LABELS) as InstallStep[]).sort(() => 0.5 - Math.random()), [])

  const success = (message: string) => { setFeedback(`✅ ${message}`); onComplete() }
  const fail = (message: string) => setFeedback(`🔎 ${message}`)

  if (completed) return <div className="rounded-xl p-4 text-sm" style={{ background: '#052e16', color: '#86efac', border: '1px solid #15803d' }}>✅ {lang === 'en' ? 'This practice was validated. You can repeat it anytime.' : 'Esta prática foi validada. Você pode repeti-la quando quiser.'}</div>

  if (moduleId === 'files') return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}>
      <div className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>🗂️ {lang === 'en' ? 'Explorer simulator' : 'Simulador do Explorador'}</div>
      <p className="text-xs" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? 'Create the folder ProjetosPython and a Python file named meu_primeiro.py.' : 'Crie a pasta ProjetosPython e um arquivo Python chamado meu_primeiro.py.'}</p>
      <input value={folder} onChange={event => setFolder(event.target.value)} placeholder={lang === 'en' ? 'Folder name' : 'Nome da pasta'} className="w-full rounded-lg px-3 py-2.5 text-sm" style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }} />
      <input value={file} onChange={event => setFile(event.target.value)} placeholder={lang === 'en' ? 'File name with extension' : 'Nome do arquivo com extensão'} className="w-full rounded-lg px-3 py-2.5 text-sm" style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }} />
      <button onClick={() => validateFileChallenge(folder, file) ? success(lang === 'en' ? 'Correct folder, filename and extension.' : 'Pasta, nome e extensão corretos.') : fail(lang === 'en' ? 'Check the folder spelling and remember the .py extension.' : 'Confira o nome da pasta e lembre da extensão .py.')} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{lang === 'en' ? 'Validate' : 'Validar'}</button>
    </div>
  )

  if (moduleId === 'downloads') return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}>
      <div className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>🧱 {lang === 'en' ? 'Put the installation steps in order' : 'Coloque a instalação na ordem'}</div>
      <div className="text-xs" style={{ color: 'var(--c-muted)' }}>{sequence.length ? sequence.map((step, index) => `${index + 1}. ${INSTALL_LABELS[step][lang]}`).join(' → ') : (lang === 'en' ? 'Click the first step.' : 'Clique na primeira etapa.')}</div>
      <div className="grid gap-2">
        {installChoices.map(step => <button key={step} disabled={sequence.includes(step)} onClick={() => setSequence(previous => [...previous, step])} className="text-left rounded-lg px-3 py-2 text-sm disabled:opacity-30" style={{ background: 'var(--c-bg)', color: 'var(--c-text2)', border: '1px solid var(--c-border)' }}>{INSTALL_LABELS[step][lang]}</button>)}
      </div>
      <div className="flex gap-2"><button onClick={() => setSequence([])} className="flex-1 rounded-lg py-2.5 text-sm" style={{ background: 'var(--c-bg)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>{lang === 'en' ? 'Reset' : 'Recomeçar'}</button><button onClick={() => validateInstallSequence(sequence) ? success(lang === 'en' ? 'Safe installation sequence understood.' : 'Sequência segura de instalação compreendida.') : fail(lang === 'en' ? 'The order is not safe yet. Download before opening and verify last.' : 'A ordem ainda não está segura. Baixe antes de abrir e verifique por último.')} className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{lang === 'en' ? 'Validate' : 'Validar'}</button></div>
    </div>
  )

  if (moduleId === 'local-cloud') {
    const items = [
      ['downloads-folder', { en: 'A file in Downloads', pt: 'Um arquivo em Downloads' }], ['google-drive', { en: 'A file only on Google Drive', pt: 'Um arquivo apenas no Google Drive' }],
      ['desktop-file', { en: 'A file on the Desktop', pt: 'Um arquivo na Área de Trabalho' }], ['onedrive-web', { en: 'OneDrive opened in a browser', pt: 'OneDrive aberto no navegador' }],
    ] as const
    return <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}><div className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>☁️ {lang === 'en' ? 'Classify where each item lives' : 'Classifique onde cada item está'}</div>{items.map(([id, label]) => <div key={id} className="rounded-lg p-3" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}><div className="text-sm mb-2" style={{ color: 'var(--c-text2)' }}>{label[lang]}</div><div className="flex gap-2">{(['local', 'cloud'] as const).map(choice => <button key={choice} onClick={() => setClassification(previous => ({ ...previous, [id]: choice }))} className="flex-1 rounded-lg py-2 text-xs" style={{ background: classification[id] === choice ? 'var(--c-purple-dm)' : 'var(--c-card)', color: classification[id] === choice ? 'var(--c-purple-l)' : 'var(--c-muted)', border: '1px solid var(--c-border)' }}>{choice === 'local' ? (lang === 'en' ? '💻 Local' : '💻 Local') : (lang === 'en' ? '☁️ Cloud' : '☁️ Nuvem')}</button>)}</div></div>)}<button onClick={() => scoreClassification(classification) === 100 ? success(lang === 'en' ? 'You can distinguish local and cloud storage.' : 'Você distingue armazenamento local e nuvem.') : fail(lang === 'en' ? `You got ${scoreClassification(classification)}%. Review what requires the internet.` : `Você acertou ${scoreClassification(classification)}%. Revise o que depende da internet.`)} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{lang === 'en' ? 'Validate' : 'Validar'}</button></div>
  }

  if (moduleId === 'terminal') return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}>
      <div className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>⌨️ {lang === 'en' ? 'Terminal simulator' : 'Simulador de terminal'}</div>
      <div className="rounded-lg p-3 font-mono text-sm" style={{ background: '#050510', color: '#a7f3d0' }}>PS C:\Projetos&gt; <span style={{ color: '#fff' }}>{terminalAnswer}</span></div>
      <p className="text-xs" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? 'Type the command that asks Python for its installed version.' : 'Digite o comando que pede ao Python a versão instalada.'}</p>
      <input value={terminalAnswer} onChange={event => setTerminalAnswer(event.target.value)} placeholder="python --version" className="w-full rounded-lg px-3 py-2.5 font-mono text-sm" style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }} />
      <button onClick={() => terminalAnswer.trim().toLowerCase() === 'python --version' ? success(lang === 'en' ? 'Correct. This command only reads version information.' : 'Correto. Este comando apenas lê a versão.') : fail(lang === 'en' ? 'Use: python, one space, then --version.' : 'Use: python, um espaço e depois --version.')} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{lang === 'en' ? 'Run safely' : 'Executar com segurança'}</button>
    </div>
  )

  const rows = [
    ['calculate', { en: 'Executes general instructions', pt: 'Executa instruções gerais' }], ['temporary', { en: 'Temporary workspace for open apps', pt: 'Espaço temporário para apps abertos' }],
    ['permanent', { en: 'Keeps files after shutdown', pt: 'Mantém arquivos depois de desligar' }], ['parallel', { en: 'Many parallel calculations for AI', pt: 'Muitos cálculos paralelos para IA' }],
  ] as const
  return <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}><div className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>🧠 {lang === 'en' ? 'Match the computer resource' : 'Associe o recurso do computador'}</div>{rows.map(([id, label]) => <label key={id} className="block rounded-lg p-3" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}><div className="text-xs mb-2" style={{ color: 'var(--c-text2)' }}>{label[lang]}</div><select value={hardware[id] || ''} onChange={event => setHardware(previous => ({ ...previous, [id]: event.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--c-card)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}><option value="">—</option><option value="cpu">CPU</option><option value="ram">RAM</option><option value="storage">SSD / Storage</option><option value="gpu">GPU</option></select></label>)}<button onClick={() => scoreHardware(hardware) === 100 ? success(lang === 'en' ? 'You understand the four core resources.' : 'Você entendeu os quatro recursos principais.') : fail(lang === 'en' ? `You got ${scoreHardware(hardware)}%. Think worker, workbench, warehouse and team.` : `Você acertou ${scoreHardware(hardware)}%. Pense em trabalhador, bancada, depósito e equipe.`)} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)' }}>{lang === 'en' ? 'Validate' : 'Validar'}</button></div>
}
