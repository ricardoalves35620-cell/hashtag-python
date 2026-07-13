import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Progress } from '../components/ui/Progress'
import LearningCallout from '../components/learning/LearningCallout'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { getPhaseStatus } from '../lib/progress'
import { inferPhaseStage, getPhaseGroup } from '../data/phaseCatalog'
import { getMiniProjectForPhase } from '../data/miniProjects'
import { fetchRemoteProjectProgress, loadLocalProjectProgress, mergeProjectProgress, saveLocalProjectProgress } from '../lib/projectProgress'
import { scrollToTop } from '../lib/scroll'

interface PhaseStep {
  id: string
  icon: string
  label: { en: string; pt: string }
  desc: { en: string; pt: string }
  done: boolean
  active: boolean
  path: string
  score?: number | null
}

export default function PhaseOverview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, learnerId, progress, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))
  const project = phase ? getMiniProjectForPhase(phase.id) : undefined
  const [projectDone, setProjectDone] = useState(false)

  useEffect(() => { scrollToTop() }, [])

  useEffect(() => {
    if (!project || !learnerId) { setProjectDone(false); return }
    const starterCode = project.starterCode[lang]
    const local = loadLocalProjectProgress(learnerId, project.id, starterCode)
    setProjectDone(local.completed)
    void fetchRemoteProjectProgress(learnerId, project.id).then(remote => {
      const merged = mergeProjectProgress(local, remote)
      saveLocalProjectProgress(learnerId, merged)
      setProjectDone(merged.completed)
    })
    const update = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId?: string; completed?: boolean }>).detail
      if (detail?.projectId === project.id) setProjectDone(Boolean(detail.completed))
    }
    window.addEventListener('hp:project-progress', update)
    return () => window.removeEventListener('hp:project-progress', update)
  }, [project, learnerId, lang])

  useEffect(() => {
    const refresh = () => refreshProgress()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [refreshProgress])

  if (!phase) return <div className="p-4 text-muted">Phase not found</div>

  const group = getPhaseGroup(inferPhaseStage(phase))
  const phaseProgress = progress.find(p => p.phase_id === phase.id)
  const status = getPhaseStatus(progress, phase.id)
  const effectiveProjectDone = projectDone || Boolean(phaseProgress?.project_done)

  const steps: PhaseStep[] = [
    {
      id: 'lesson', icon: '📚',
      label: { en: 'Learning journey', pt: 'Jornada de aprendizagem' },
      desc: { en: 'Understand the problem, build the logic, translate to Python, debug and transfer.', pt: 'Entenda o problema, construa a lógica, traduza para Python, depure e transfira.' },
      done: Boolean(phaseProgress?.lesson_done), active: true,
      path: phase.id === 0 ? '/base-zero' : `/phase/${phase.id}/lesson`,
    },
    {
      id: 'exercises', icon: '🏋️',
      label: { en: 'Deliberate practice', pt: 'Prática deliberada' },
      desc: { en: 'Predict, modify, write, test and explain instead of only running ready-made code.', pt: 'Preveja, modifique, escreva, teste e explique, em vez de apenas executar código pronto.' },
      done: Boolean(phaseProgress?.exercises_done), active: Boolean(phaseProgress?.lesson_done),
      path: `/phase/${phase.id}/exercises`,
    },
    {
      id: 'quiz', icon: '🧠',
      label: { en: 'Knowledge check', pt: 'Verificação de conhecimento' },
      desc: { en: 'Reveal misunderstandings before the final assessment.', pt: 'Revele mal-entendidos antes da avaliação final.' },
      done: Boolean(phaseProgress?.quiz_done), active: Boolean(phaseProgress?.exercises_done),
      path: `/phase/${phase.id}/quiz`,
    },
    {
      id: 'exam', icon: '🎯',
      label: { en: 'Competency assessment', pt: 'Avaliação de competência' },
      desc: { en: 'Build a working solution and reach at least 90%.', pt: 'Construa uma solução funcional e alcance pelo menos 90%.' },
      done: Boolean(phaseProgress?.exam_passed), active: Boolean(phaseProgress?.quiz_done),
      path: `/phase/${phase.id}/exam`, score: phaseProgress?.exam_score,
    },
    ...(project ? [{
      id: 'mini-project', icon: '🧰',
      label: { en: 'Professional mini-project', pt: 'Mini projeto profissional' },
      desc: { en: 'Understand → plan → implement → test → refactor.', pt: 'Entender → planejar → implementar → testar → refatorar.' },
      done: effectiveProjectDone, active: Boolean(phaseProgress?.exam_passed),
      path: `/mini-project/${project.id}`, score: null,
    }] : []),
  ]

  const stepsCompleted = steps.filter(step => step.done).length
  const progressPercent = Math.round((stepsCompleted / steps.length) * 100)
  const phaseMastered = status === 'done' && (!project || effectiveProjectDone)
  const currentStepIndex = Math.max(0, steps.findIndex(step => !step.done && step.active))
  const currentStep = phaseMastered ? steps[steps.length - 1] : steps[currentStepIndex]

  const t = {
    en: {
      home: 'Home', phase: 'Phase', mastery: 'Topic mastery', complete: 'complete',
      continue: phaseMastered ? 'Review this topic' : 'Continue learning', current: 'Your next action',
      map: 'Learning path', currentBadge: 'Current', locked: 'Complete the previous step first',
      mastered: 'Topic mastered', masteredText: 'You completed the learning journey, practice and assessment evidence for this topic.',
      projectPending: 'The assessment passed. The topic is not mastered yet.',
      projectPendingText: 'Complete the mini-project to prove that you can plan, build, test and improve a solution.',
      hours: 'estimated study', desktop: 'Desktop practice recommended', lab: 'Open practical lab',
      evidence: 'Progress here measures evidence of learning—not clicks.',
    },
    pt: {
      home: 'Início', phase: 'Fase', mastery: 'Domínio do tópico', complete: 'concluído',
      continue: phaseMastered ? 'Revisar este tópico' : 'Continuar aprendendo', current: 'Sua próxima ação',
      map: 'Caminho de aprendizagem', currentBadge: 'Atual', locked: 'Conclua a etapa anterior primeiro',
      mastered: 'Tópico dominado', masteredText: 'Você concluiu a jornada, a prática e as evidências de avaliação deste tópico.',
      projectPending: 'A avaliação passou. O tópico ainda não foi dominado.',
      projectPendingText: 'Conclua o mini projeto para provar que consegue planejar, construir, testar e melhorar uma solução.',
      hours: 'de estudo estimado', desktop: 'Prática desktop recomendada', lab: 'Abrir laboratório prático',
      evidence: 'O progresso aqui mede evidências de aprendizagem — não cliques.',
    },
  }[lang]

  const openStep = (step: PhaseStep) => {
    if (!step.active && !step.done) return
    scrollToTop()
    navigate(step.path)
  }

  return (
    <Layout showBack backTo="/" backLabel={t.home} title={`${t.phase} ${phase.id}`}>
      <div className="learning-workspace">
        <div className="learning-reading-column learning-content-stack" data-testid="phase-learning-path-v25">
          <header className="learning-hero">
            <div className="learning-hero__eyebrow">{t.phase} {phase.id}{group ? ` · ${group.title[lang]}` : ''}</div>
            <div className="learning-hero__content">
              <div className="learning-hero__icon" aria-hidden="true">{phase.icon}</div>
              <div className="learning-hero__copy">
                <h1 className="learning-hero__title">{phase.title[lang]}</h1>
                <p className="learning-hero__description">{phase.description[lang]}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {phase.estimatedHours && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--c-bg)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>≈ {phase.estimatedHours}h {t.hours}</span>}
              {phase.desktopRequired && <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--c-warning-bg)', color: 'var(--c-warning-text)', border: '1px solid var(--c-warning-border)' }}>{t.desktop}</span>}
              {phase.labPath && <button onClick={() => navigate(phase.labPath!)} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--c-purple-f)', color: 'var(--c-purple-l)', border: '1px solid var(--c-purple-dm)' }}>{t.lab} →</button>}
            </div>

            {phase.libraries.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{phase.libraries.map(lib => <code key={lib} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--c-code-bg)', color: 'var(--c-purple-l)', border: '1px solid var(--c-border)' }}>pip install {lib}</code>)}</div>}

            <div className="learning-hero__progress-copy"><span>{t.mastery}</span><strong>{progressPercent}%</strong></div>
            <Progress value={progressPercent} className="learning-hero__progress" />
            <div className="learning-hero__secondary">{stepsCompleted}/{steps.length} · {progressPercent}% {t.complete}</div>
          </header>

          {!phaseMastered && currentStep && (
            <section className="learning-content-card">
              <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--c-purple-l)' }}>{t.current}</div>
              <div className="flex items-start gap-3 mt-3">
                <div className="text-3xl" aria-hidden="true">{currentStep.icon}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold m-0">{currentStep.label[lang]}</h2>
                  <p className="text-sm mt-1 mb-0 leading-relaxed">{currentStep.desc[lang]}</p>
                </div>
              </div>
              <button onClick={() => openStep(currentStep)} className="w-full rounded-xl py-3 px-4 mt-4 text-sm font-semibold text-white" style={{ background: 'var(--c-purple)', border: 0 }}>{t.continue} →</button>
            </section>
          )}

          <LearningCallout variant="remember" title={t.mastery}>{t.evidence}</LearningCallout>

          <section>
            <div className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: 'var(--c-muted)' }}>{t.map}</div>
            <div className="phase-path">
              {steps.map((step, index) => {
                const isCurrent = !phaseMastered && step.id === currentStep?.id
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => openStep(step)}
                    disabled={!step.active && !step.done}
                    className={`phase-path__step${step.done ? ' is-done' : ''}${isCurrent ? ' is-current' : ''}`}
                    title={!step.active && !step.done ? t.locked : step.label[lang]}
                  >
                    <span className="phase-path__marker" aria-hidden="true">{step.done ? '✓' : !step.active ? '🔒' : step.icon}</span>
                    <span className="phase-path__copy">
                      <span className="phase-path__title">
                        {index + 1}. {step.label[lang]}
                        {isCurrent && <span className="phase-path__badge">{t.currentBadge}</span>}
                        {step.done && step.score !== undefined && step.score !== null && <span className="phase-path__badge">{step.score}%</span>}
                      </span>
                      <span className="phase-path__description">{step.desc[lang]}</span>
                    </span>
                    {(step.active || step.done) && <span aria-hidden="true">→</span>}
                  </button>
                )
              })}
            </div>
          </section>

          {phaseProgress?.exam_passed && project && !effectiveProjectDone && <LearningCallout variant="professional" title={t.projectPending}>{t.projectPendingText}</LearningCallout>}

          {phaseMastered && (
            <section className="learning-content-card text-center" style={{ borderColor: 'var(--c-success-border)', background: 'var(--c-success-bg)' }}>
              <div className="text-3xl mb-2" aria-hidden="true">🎉</div>
              <h2 className="text-lg font-semibold">{t.mastered}</h2>
              <p className="text-sm mb-0">{t.masteredText}</p>
              <button onClick={() => openStep(steps[0])} className="rounded-xl py-3 px-4 mt-4 text-sm font-semibold" style={{ background: 'var(--c-card)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}>{t.continue}</button>
            </section>
          )}
        </div>
      </div>
    </Layout>
  )
}
