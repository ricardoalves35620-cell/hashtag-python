import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import PhaseCard from '../components/PhaseCard'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { loadFTProgress } from '../lib/fasttrackProgress'
import { getDueSkillStates, getLearningSummary, getWeakestSkillStates } from '../lib/learningEngine'
import { getSkill } from '../data/skills'
import { PHASE_GROUPS, inferPhaseStage, phasesForGroup } from '../data/phaseCatalog'
import type { PhaseStage } from '../data/types'
import { getPhaseStatus } from '../lib/progress'
import { PROJECT_PHASE_BY_ID } from '../data/progressionCatalog'

export default function Home() {
  const { lang, displayName, progress, user, isGuest, learnerId, refreshProgress, learningState, refreshLearningState } = useApp()
  const navigate = useNavigate()
  const [ftDone, setFtDone] = useState<number[]>([])
  const availableGroups = useMemo(() => PHASE_GROUPS.filter(group => phasesForGroup(ALL_PHASES, group.id).length > 0), [])
  const [selectedGroup, setSelectedGroup] = useState<PhaseStage>(() => {
    const saved = localStorage.getItem('hp_phase_group') as PhaseStage | null
    return saved && PHASE_GROUPS.some(group => group.id === saved) ? saved : 'base'
  })

  const activeGroup = availableGroups.find(group => group.id === selectedGroup) || availableGroups[0]
  const visiblePhases = activeGroup ? phasesForGroup(ALL_PHASES, activeGroup.id) : []
  const corePhases = ALL_PHASES.filter(phase => (phase.track || 'core') === 'core')
  const corePassed = progress.filter(row => row.exam_passed && corePhases.some(phase => phase.id === row.phase_id)).length
  const coreOverall = corePhases.length ? Math.round((corePassed / corePhases.length) * 100) : 0
  const groupPassed = progress.filter(row => row.exam_passed && visiblePhases.some(phase => phase.id === row.phase_id)).length
  const groupOverall = visiblePhases.length ? Math.round((groupPassed / visiblePhases.length) * 100) : 0
  const learningSummary = getLearningSummary(learningState)
  const dueReviews = getDueSkillStates(learningState)
  const weakestSkills = getWeakestSkillStates(learningState, 3)
  const currentPhase = corePhases.find(phase => getPhaseStatus(progress, phase.id) === 'active') || corePhases[corePhases.length - 1]
  const currentPhaseProgress = progress.find(row => row.phase_id === currentPhase?.id)
  const currentProjectId = Object.entries(PROJECT_PHASE_BY_ID).find(([, phaseId]) => phaseId === currentPhase?.id)?.[0]
  const continuePath = !currentPhase ? '/roadmap'
    : currentPhase.id === 0 && !currentPhaseProgress?.lesson_done ? '/base-zero'
    : !currentPhaseProgress?.lesson_done ? `/phase/${currentPhase.id}/lesson`
    : !currentPhaseProgress?.exercises_done ? `/phase/${currentPhase.id}/exercises`
    : !currentPhaseProgress?.quiz_done ? `/phase/${currentPhase.id}/quiz`
    : !currentPhaseProgress?.exam_passed ? `/phase/${currentPhase.id}/exam`
    : currentProjectId && !currentPhaseProgress?.project_done ? `/mini-project/${currentProjectId}`
    : `/phase/${currentPhase.id}`

  useEffect(() => {
    if (learnerId) loadFTProgress(learnerId).then(setFtDone)
  }, [learnerId])

  useEffect(() => {
    const refresh = () => {
      if (!learnerId) return
      loadFTProgress(learnerId).then(setFtDone)
      refreshProgress()
      refreshLearningState()
    }
    const handleVisibility = () => document.visibilityState === 'visible' && refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [learnerId, refreshProgress, refreshLearningState])

  useEffect(() => {
    if (!learnerId) return
    if (localStorage.getItem('hp_onboarding_done')) return
    if (user?.user_metadata?.onboarding_done) {
      localStorage.setItem('hp_onboarding_done', user.user_metadata.track || 'course')
      return
    }
    navigate('/onboarding', { replace: true })
  }, [learnerId, user, navigate])

  useEffect(() => {
    if (activeGroup) localStorage.setItem('hp_phase_group', activeGroup.id)
  }, [activeGroup])

  const ftCompleted = ftDone.length === 7
  const t = {
    en: {
      greeting: 'Welcome back', coreProgress: 'Complete Python path', complete: 'complete',
      learningTitle: 'Your learning today', reviewDue: dueReviews.length ? `${dueReviews.length} review${dueReviews.length === 1 ? '' : 's'} due` : 'Practice your weakest skills',
      diagnostic: 'Take the initial diagnostic', mastery: 'Average skill mastery', gaps: 'Priority gaps', seeProgress: 'Open learning dashboard',
      ftTitle: '⚡ 7-day quick plan', ftSub: ftCompleted ? '7/7 days complete ✓' : ftDone.length > 0 ? `Day ${ftDone.length + 1} of 7 up next` : '7 days · 20 min/day · Orientation only', ftBtn: ftCompleted ? 'Review' : ftDone.length > 0 ? 'Continue' : 'Start',
      zeroTitle: 'Base Zero · Computer essentials', zeroText: 'Interactive practice with files, downloads, cloud, terminal and hardware.', zeroBtn: 'Open Base Zero', visualBtn: 'Visual Python lab', guest: 'Visitor mode · progress is stored on this device',
      roadmap: 'Open complete roadmap', lab: 'Open practical lab', phaseWord: 'phases', stageProgress: 'Module progress', courseModules: 'Course modules',
      continueEyebrow: 'Recommended next step', continueAction: 'Continue learning', explore: 'Explore other tools and paths',
      pathSummary: `${corePhases.length} required phases + ${ALL_PHASES.length - corePhases.length} optional AI phases`, progressLink: 'See my progress',
    },
    pt: {
      greeting: 'Bem-vindo de volta', coreProgress: 'Formação completa em Python', complete: 'concluído',
      learningTitle: 'Seu aprendizado hoje', reviewDue: dueReviews.length ? `${dueReviews.length} revis${dueReviews.length === 1 ? 'ão pendente' : 'ões pendentes'}` : 'Praticar habilidades mais fracas',
      diagnostic: 'Fazer o diagnóstico inicial', mastery: 'Domínio médio das habilidades', gaps: 'Lacunas prioritárias', seeProgress: 'Abrir painel de aprendizagem',
      ftTitle: '⚡ Plano rápido de 7 dias', ftSub: ftCompleted ? '7/7 dias completos ✓' : ftDone.length > 0 ? `Dia ${ftDone.length + 1} de 7 a seguir` : '7 dias · 20 min/dia · Apenas orientação', ftBtn: ftCompleted ? 'Revisar' : ftDone.length > 0 ? 'Continuar' : 'Começar',
      zeroTitle: 'Base Zero · Essenciais do computador', zeroText: 'Prática interativa com arquivos, downloads, nuvem, terminal e hardware.', zeroBtn: 'Abrir Base Zero', visualBtn: 'Laboratório visual de Python', guest: 'Modo visitante · progresso salvo neste aparelho',
      roadmap: 'Abrir mapa completo', lab: 'Abrir laboratório prático', phaseWord: 'fases', stageProgress: 'Progresso do módulo', courseModules: 'Módulos do curso',
      continueEyebrow: 'Próxima etapa recomendada', continueAction: 'Continuar aprendendo', explore: 'Explorar outras ferramentas e caminhos',
      pathSummary: `${corePhases.length} fases obrigatórias + ${ALL_PHASES.length - corePhases.length} fases opcionais de IA`, progressLink: 'Ver meu progresso',
    },
  }[lang]

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div>
          <div className="text-sm" style={{ color: 'var(--c-muted)' }}>{t.greeting} 👋</div>
          <h1 className="text-xl font-medium" style={{ color: 'var(--c-text)' }}>{displayName}</h1>
          {isGuest && <div className="text-sm mt-1" style={{ color: '#f8d477' }}>{t.guest}</div>}
        </div>

        <section className="rounded-2xl p-5" style={{ background: 'linear-gradient(145deg, var(--c-purple-f), var(--c-card))', border: '1px solid var(--c-purple-dm)' }}>
          <div className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--c-purple-l)' }}>{t.continueEyebrow}</div>
          <h2 className="text-xl font-semibold mt-2 mb-0" style={{ color: 'var(--c-text)' }}>
            {currentPhase ? `${currentPhase.icon} ${lang === 'pt' ? 'Fase' : 'Phase'} ${currentPhase.id}: ${currentPhase.title[lang]}` : t.coreProgress}
          </h2>
          {currentPhase && <p className="text-base mt-2 mb-0 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{currentPhase.description[lang]}</p>}
          <button onClick={() => navigate(continuePath)} className="w-full rounded-xl py-3.5 px-4 mt-5 text-base font-semibold text-white" style={{ background: 'var(--c-purple)', border: 0 }}>{t.continueAction} →</button>
          <div className="flex items-center justify-between gap-3 mt-4 text-sm" style={{ color: 'var(--c-muted)' }}>
            <span>{corePassed}/{corePhases.length} · {coreOverall}% {t.complete}</span>
            <button onClick={() => navigate('/progress')} className="font-medium" style={{ color: 'var(--c-purple-l)', background: 'none', border: 0 }}>{t.progressLink}</button>
          </div>
          <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: 'var(--c-bg)' }}><div className="h-full rounded-full" style={{ width: `${coreOverall}%`, background: 'var(--c-purple)' }} /></div>
          <p className="text-sm mt-3 mb-0" style={{ color: 'var(--c-muted)' }}>{t.pathSummary}</p>
        </section>

        <details className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <summary className="cursor-pointer text-base font-semibold" style={{ color: 'var(--c-text)' }}>{t.explore}</summary>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <button onClick={() => navigate('/roadmap')} className="rounded-xl p-4 text-left text-base" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}>🗺️ {t.roadmap}</button>
            <button onClick={() => navigate('/base-zero')} className="rounded-xl p-4 text-left text-base" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}>🌱 {t.zeroBtn}</button>
            <button onClick={() => navigate('/visualizer')} className="rounded-xl p-4 text-left text-base" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}>🧩 {t.visualBtn}</button>
            <button onClick={() => navigate(learningState.diagnosticCompletedAt ? '/review' : '/diagnostic')} className="rounded-xl p-4 text-left text-base" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}>🧠 {learningState.diagnosticCompletedAt ? t.reviewDue : t.diagnostic}</button>
            <button onClick={() => navigate('/fasttrack')} className="rounded-xl p-4 text-left" style={{ background: '#1a1040', border: '1px solid var(--c-purple)' }}><span className="block text-base font-semibold" style={{ color: 'var(--c-purple-l)' }}>{t.ftTitle}</span><span className="block text-sm mt-1" style={{ color: 'var(--c-purple-l)', opacity: 0.8 }}>{t.ftSub}</span></button>
            <button onClick={() => navigate('/progress')} className="rounded-xl p-4 text-left" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}><span className="block text-base font-semibold" style={{ color: 'var(--c-text)' }}>📈 {t.learningTitle}</span><span className="block text-sm mt-1" style={{ color: 'var(--c-muted)' }}>{t.mastery}: {learningSummary.averageMastery}%</span></button>
          </div>
          {weakestSkills.length > 0 && <div className="mt-4"><div className="text-sm font-medium mb-2" style={{ color: 'var(--c-muted)' }}>{t.gaps}</div><div className="flex flex-wrap gap-2">{weakestSkills.map(state => { const skill = getSkill(state.skillId); return skill ? <span key={state.skillId} className="text-sm px-2 py-1 rounded-full" style={{ background: 'var(--c-bg)', color: 'var(--c-text2)' }}>{skill.title[lang]} · {state.mastery}%</span> : null })}</div></div>}
        </details>

        <section>
          <div className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.courseModules}</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {availableGroups.map(group => (
              <button key={group.id} onClick={() => setSelectedGroup(group.id)} className="rounded-xl p-3 text-left flex-shrink-0" style={{ width: 180, background: group.id === activeGroup?.id ? 'var(--c-purple-dm)' : 'var(--c-card)', border: `1px solid ${group.id === activeGroup?.id ? 'var(--c-purple)' : 'var(--c-border)'}` }}>
                <div className="text-lg">{group.icon}</div><div className="text-base font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{group.title[lang]}</div><div className="text-sm mt-1" style={{ color: 'var(--c-muted)' }}>{phasesForGroup(ALL_PHASES, group.id).length} {t.phaseWord}</div>
              </button>
            ))}
          </div>
        </section>

        {activeGroup && (
          <section className="rounded-xl p-4" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}>
            <div className="flex items-start justify-between gap-3"><div><div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{activeGroup.icon} {activeGroup.title[lang]}</div><div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{activeGroup.subtitle[lang]}</div></div>{activeGroup.labPath && <button onClick={() => navigate(activeGroup.labPath!)} className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--c-purple-l)', background: 'none', border: 'none' }}>{t.lab} →</button>}</div>
            <div className="flex justify-between text-xs mt-4" style={{ color: 'var(--c-muted)' }}><span>{t.stageProgress}</span><span>{groupPassed}/{visiblePhases.length} · {groupOverall}%</span></div>
            <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: 'var(--c-bg)' }}><div className="h-full" style={{ width: `${groupOverall}%`, background: 'var(--c-purple)' }} /></div>
          </section>
        )}

        <div className="space-y-3">
          {visiblePhases.map(phase => <PhaseCard key={phase.id} phase={phase} progress={progress} lang={lang} />)}
        </div>
        <div className="h-4" />
      </div>
    </Layout>
  )
}
