import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Alert, Badge, Button, Card, Progress } from '../components/ui'
import { useApp } from '../contexts/AppContext'
import { getMiniProject, type MiniProject } from '../data/miniProjects'
import { getPhaseStatus } from '../lib/progress'
import {
  createMiniProjectProgress,
  fetchRemoteProjectProgress,
  loadLocalProjectProgress,
  mergeProjectProgress,
  saveLocalProjectProgress,
  type MiniProjectProgress,
} from '../lib/projectProgress'

import {
  PORTFOLIO_PROJECT_IDS,
  buildCompletePortfolio,
  buildPortfolioReadme,
  safePortfolioFilename,
} from '../lib/portfolio'

export default function Portfolio() {
  const navigate = useNavigate()
  const { lang, learnerId, progress } = useApp()
  const projects = useMemo(
    () => PORTFOLIO_PROJECT_IDS.map(id => getMiniProject(id)).filter((project): project is MiniProject => Boolean(project)),
    [],
  )

  const [projectProgress, setProjectProgress] = useState<Record<string, MiniProjectProgress>>(() =>
    Object.fromEntries(projects.map(project => [
      project.id,
      loadLocalProjectProgress(learnerId || 'guest', project.id, project.starterCode[lang]),
    ])),
  )

  useEffect(() => {
    const ownerId = learnerId || 'guest'
    let active = true
    const localByProject = Object.fromEntries(projects.map(project => [
      project.id,
      loadLocalProjectProgress(ownerId, project.id, project.starterCode[lang]),
    ])) as Record<string, MiniProjectProgress>

    setProjectProgress(localByProject)

    if (learnerId && learnerId !== 'guest') {
      for (const project of projects) {
        const local = localByProject[project.id]
        void fetchRemoteProjectProgress(learnerId, project.id).then(remote => {
          if (!active) return
          const merged = mergeProjectProgress(local, remote)
          saveLocalProjectProgress(learnerId, merged)
          setProjectProgress(current => ({ ...current, [project.id]: merged }))
        })
      }
    }

    const update = (event: Event) => {
      const detail = (event as CustomEvent<MiniProjectProgress>).detail
      if (!detail?.projectId) return
      setProjectProgress(current => ({ ...current, [detail.projectId]: detail }))
    }

    window.addEventListener('hp:project-progress', update)
    return () => {
      active = false
      window.removeEventListener('hp:project-progress', update)
    }
  }, [lang, learnerId, projects])

  const t = useMemo(() => ({
    en: {
      title: 'Python portfolio', eyebrow: 'Sprint 10 · Evidence of ability',
      heading: 'Turn learning into work you can explain',
      intro: 'A portfolio is not a collection of copied code. Each artifact must show the problem, your plan, your implementation, the tests and the improvements you chose.',
      locked: 'Locked by normal progression', lockedText: 'Continue through the course normally. This project will appear when its milestone becomes active.',
      assessmentPending: 'Complete the milestone assessment to open this project.',
      continuePhase: 'Continue milestone', open: 'Open project', export: 'Export portfolio README',
      complete: 'Portfolio artifact ready', inProgress: 'Project in progress', notStarted: 'Not started yet',
      evidence: 'Evidence included', next: 'Future artifacts remain hidden until you reach their normal course milestone.',
      privacy: 'The exported README is created on this device. Review it before publishing because it contains your code and written planning.',
      foundation: 'Foundation integrator', professional: 'Professional Python integrator', engineering: 'Advanced Python and engineering integrator', dataMl: 'Data and Machine Learning integrator', neural: 'Neural networks and Transformers integrator', finalAi: 'Final local AI capstone',
      portfolioProgress: 'Portfolio completion', artifactsReady: 'artifacts ready', exportAll: 'Export complete portfolio', exportAllHelp: 'The combined export unlocks after all six artifacts are complete.', collectionReady: 'Complete portfolio ready',
      unavailable: 'Project definition missing.', milestone: 'Milestone phase',
    },
    pt: {
      title: 'Portfólio Python', eyebrow: 'Sprint 10 · Evidência de capacidade',
      heading: 'Transforme aprendizado em trabalho que você consegue explicar',
      intro: 'Portfólio não é uma coleção de código copiado. Cada artefato precisa mostrar o problema, seu plano, sua implementação, os testes e as melhorias que você escolheu.',
      locked: 'Bloqueado pela progressão normal', lockedText: 'Continue pelo curso normalmente. Este projeto aparecerá quando o marco correspondente ficar ativo.',
      assessmentPending: 'Conclua a avaliação do marco para abrir este projeto.',
      continuePhase: 'Continuar marco', open: 'Abrir projeto', export: 'Exportar README do portfólio',
      complete: 'Artefato de portfólio pronto', inProgress: 'Projeto em andamento', notStarted: 'Ainda não iniciado',
      evidence: 'Evidências incluídas', next: 'Artefatos futuros permanecem ocultos até você alcançar o marco normal do curso.',
      privacy: 'O README é criado neste aparelho. Revise antes de publicar, pois ele contém seu código e o planejamento que você escreveu.',
      foundation: 'Projeto integrador dos fundamentos', professional: 'Projeto integrador de Python profissional', engineering: 'Projeto integrador de Python avançado e engenharia', dataMl: 'Projeto integrador de Dados e Machine Learning', neural: 'Projeto integrador de redes neurais e Transformers', finalAi: 'Capstone final de IA local',
      portfolioProgress: 'Conclusão do portfólio', artifactsReady: 'artefatos prontos', exportAll: 'Exportar portfólio completo', exportAllHelp: 'A exportação combinada será liberada quando os seis artefatos estiverem concluídos.', collectionReady: 'Portfólio completo pronto',
      unavailable: 'Definição do projeto ausente.', milestone: 'Fase de marco',
    },
  })[lang], [lang])

  if (!projects.length) {
    return <Layout showBack backTo="/career" title={t.title}><div className="page-shell"><Alert variant="warning">{t.unavailable}</Alert></div></Layout>
  }

  const exportReadme = (project: MiniProject, state: MiniProjectProgress) => {
    const content = buildPortfolioReadme(project, state, lang)
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${safePortfolioFilename(project.title[lang])}-README.md`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const completedEntries = projects
    .map(project => {
      const state = projectProgress[project.id]
        || createMiniProjectProgress(project.id, project.starterCode[lang])
      const phaseProgress = progress.find(row => row.phase_id === project.milestonePhaseId)
      return {
        project,
        progress: {
          ...state,
          completed: Boolean(state.completed || phaseProgress?.project_done),
        } satisfies MiniProjectProgress,
      }
    })
    .filter(entry => entry.progress.completed)

  const portfolioPercent = Math.round((completedEntries.length / projects.length) * 100)
  const completePortfolioReady = completedEntries.length === projects.length

  const exportCompletePortfolio = () => {
    if (!completePortfolioReady) return
    const content = buildCompletePortfolio(completedEntries, lang)
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = lang === 'pt' ? 'portfolio-completo-hashtag-python.md' : 'complete-hashtag-python-portfolio.md'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const visibleProjects = projects.filter(project => {
    if (project.milestonePhaseId === 27) return true
    return getPhaseStatus(progress, project.milestonePhaseId) !== 'locked'
      || Boolean(progress.find(row => row.phase_id === project.milestonePhaseId)?.project_done)
  })

  return (
    <Layout showBack backTo="/career" title={t.title}>
      <div className="page-shell space-y-4" data-testid="portfolio-sprint-10-7">
        <Card padding="lg">
          <Badge variant="primary">{t.eyebrow}</Badge>
          <h1 className="mt-3 text-h2 font-semibold text-ink">{t.heading}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-secondary">{t.intro}</p>
          <div className="mt-5 space-y-2" data-testid="portfolio-completion">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-ink">{t.portfolioProgress}</span>
              <span className="text-ink-secondary">{completedEntries.length}/{projects.length} {t.artifactsReady}</span>
            </div>
            <Progress value={portfolioPercent} label={`${portfolioPercent}%`} />
            {completePortfolioReady ? (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Badge variant="success">{t.collectionReady}</Badge>
                <Button onClick={exportCompletePortfolio}>{t.exportAll}</Button>
              </div>
            ) : (
              <p className="m-0 text-xs text-muted">{t.exportAllHelp}</p>
            )}
          </div>
        </Card>

        {visibleProjects.map(project => {
          const phaseProgress = progress.find(row => row.phase_id === project.milestonePhaseId)
          const phaseStatus = getPhaseStatus(progress, project.milestonePhaseId)
          const examPassed = Boolean(phaseProgress?.exam_passed)
          const state = projectProgress[project.id]
            || createMiniProjectProgress(project.id, project.starterCode[lang])
          const completed = Boolean(state.completed || phaseProgress?.project_done)
          const percent = completed ? 100 : Math.round((state.completedCheckpoints.length / 5) * 100)
          const statusLabel = completed ? t.complete : state.completedCheckpoints.length ? t.inProgress : t.notStarted
          const canOpenPhase = phaseStatus !== 'locked'
          const stageLabel = project.milestonePhaseId === 27
            ? t.foundation
            : project.milestonePhaseId === 39
              ? t.professional
              : project.milestonePhaseId === 53
                ? t.engineering
                : project.milestonePhaseId === 60
                  ? t.dataMl
                  : project.milestonePhaseId === 64
                    ? t.neural
                    : t.finalAi

          return (
            <Card key={project.id} padding="lg" className="space-y-4" data-project-id={project.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary">{stageLabel}</div>
                  <h2 className="mt-1 text-title font-semibold text-ink">{project.icon} {project.title[lang]}</h2>
                  <p className="mt-1 text-sm leading-6 text-ink-secondary">{project.subtitle[lang]}</p>
                  <p className="mt-2 text-xs text-muted">{t.milestone}: {project.milestonePhaseId}</p>
                </div>
                <Badge variant={completed ? 'success' : examPassed ? 'warning' : 'neutral'}>
                  {examPassed ? statusLabel : t.locked}
                </Badge>
              </div>

              <Progress value={examPassed ? percent : 0} label={examPassed ? `${percent}%` : '0%'} />

              {!examPassed ? (
                <Alert variant="info">{canOpenPhase ? t.assessmentPending : t.lockedText}</Alert>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-line bg-canvas p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted">{t.evidence}</div>
                    <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                      {project.accomplishment.map(item => (
                        <li key={item.en} className="flex gap-2"><span className="text-success">✓</span><span>{item[lang]}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-line bg-canvas p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted">README</div>
                    <p className="mt-2 text-sm leading-6 text-ink-secondary">{t.privacy}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {!examPassed && canOpenPhase && (
                  <Button onClick={() => navigate(`/phase/${project.milestonePhaseId}`)}>{t.continuePhase}</Button>
                )}
                {examPassed && (
                  <Button onClick={() => navigate(`/mini-project/${project.id}`)}>{t.open}</Button>
                )}
                {completed && (
                  <Button variant="secondary" onClick={() => exportReadme(project, state)}>{t.export}</Button>
                )}
              </div>
            </Card>
          )
        })}

        <Card padding="md">
          <p className="m-0 text-sm leading-6 text-ink-secondary">🔒 {t.next}</p>
        </Card>
      </div>
    </Layout>
  )
}
