import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import PhaseCard from '../components/PhaseCard'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { loadFTProgress } from '../lib/fasttrackProgress'
import { getOverallProgress } from '../lib/progress'
import { getDueSkillStates, getLearningSummary, getWeakestSkillStates } from '../lib/learningEngine'
import { getSkill } from '../data/skills'

export default function Home() {
  const { lang, displayName, progress, user, refreshProgress, learningState, refreshLearningState } = useApp()
  const navigate = useNavigate()
  const totalPhases = ALL_PHASES.length
  const overall = getOverallProgress(progress)
  const passed = progress.filter(item => item.exam_passed && ALL_PHASES.some(phase => phase.id === item.phase_id)).length
  const [ftDone, setFtDone] = useState<number[]>([])
  const learningSummary = getLearningSummary(learningState)
  const dueReviews = getDueSkillStates(learningState)
  const weakestSkills = getWeakestSkillStates(learningState, 3)

  useEffect(() => {
    if (user) loadFTProgress(user.id).then(setFtDone)
  }, [user])

  useEffect(() => {
    const refresh = () => {
      if (!user) return
      loadFTProgress(user.id).then(setFtDone)
      refreshProgress()
      refreshLearningState()
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [user, refreshProgress, refreshLearningState])

  const ftCompleted = ftDone.length === 7

  const t = {
    en: {
      greeting: 'Welcome back', progress: 'Available foundation progress', phases: 'Foundation phases',
      phasesCompleted: 'phases complete', remaining: 'remaining',
      foundationTitle: 'Current module: Python foundation',
      foundationText: 'These phases build the base. Professional and advanced Python continue in the complete roadmap.',
      roadmap: 'See the complete learning roadmap',
      learningTitle: 'Your learning today', reviewDue: dueReviews.length ? `${dueReviews.length} review${dueReviews.length === 1 ? '' : 's'} due` : 'Practice your weakest skills',
      diagnostic: 'Take the initial diagnostic', mastery: 'Average skill mastery', gaps: 'Priority gaps', seeProgress: 'Open learning dashboard',
      ftTitle: '⚡ FastTrack',
      ftSub: ftCompleted ? '7/7 days complete ✓' : ftDone.length > 0 ? `Day ${ftDone.length + 1} of 7 up next` : '7 days · 20 min/day · Orientation only',
      ftBtn: ftCompleted ? 'Review' : ftDone.length > 0 ? 'Continue' : 'Start'
    },
    pt: {
      greeting: 'Bem-vindo de volta', progress: 'Progresso da base disponível', phases: 'Fases da base',
      phasesCompleted: 'fases completas', remaining: 'restantes',
      foundationTitle: 'Módulo atual: fundamentos de Python',
      foundationText: 'Estas fases constroem a base. Python profissional e avançado continuam no mapa completo.',
      roadmap: 'Ver o mapa completo de aprendizagem',
      learningTitle: 'Seu aprendizado hoje', reviewDue: dueReviews.length ? `${dueReviews.length} revis${dueReviews.length === 1 ? 'ão pendente' : 'ões pendentes'}` : 'Praticar habilidades mais fracas',
      diagnostic: 'Fazer o diagnóstico inicial', mastery: 'Domínio médio das habilidades', gaps: 'Lacunas prioritárias', seeProgress: 'Abrir painel de aprendizagem',
      ftTitle: '⚡ FastTrack',
      ftSub: ftCompleted ? '7/7 dias completos ✓' : ftDone.length > 0 ? `Dia ${ftDone.length + 1} de 7 a seguir` : '7 dias · 20 min/dia · Apenas orientação',
      ftBtn: ftCompleted ? 'Revisar' : ftDone.length > 0 ? 'Continuar' : 'Começar'
    }
  }[lang]

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div>
          <div className="text-xs" style={{ color: 'var(--c-muted)' }}>{t.greeting} 👋</div>
          <h1 className="text-xl font-medium" style={{ color: 'var(--c-text)' }}>{displayName}</h1>
        </div>

        <button
          onClick={() => navigate('/roadmap')}
          className="w-full text-left rounded-xl p-4"
          style={{ background: 'linear-gradient(145deg, var(--c-purple-f), var(--c-card))', border: '1px solid var(--c-purple-dm)', minHeight: 'auto' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{t.foundationTitle}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.foundationText}</div>
              <div className="text-xs font-medium mt-3" style={{ color: 'var(--c-purple-l)' }}>{t.roadmap} →</div>
            </div>
            <span className="text-2xl">🗺️</span>
          </div>
        </button>

        <div className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>🧠 {t.learningTitle}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>{t.mastery}: {learningSummary.averageMastery}%</div>
            </div>
            <button onClick={() => navigate('/progress')} className="text-xs font-medium" style={{ color: 'var(--c-purple-l)', background: 'none', border: 'none' }}>{t.seeProgress} →</button>
          </div>
          {!learningState.diagnosticCompletedAt ? (
            <button onClick={() => navigate('/diagnostic')} className="w-full rounded-lg py-2.5 text-sm font-medium text-white" style={{ background: 'var(--c-purple)' }}>{t.diagnostic}</button>
          ) : (
            <>
              <button onClick={() => navigate('/review')} className="w-full rounded-lg py-2.5 text-sm font-medium" style={{ background: 'var(--c-purple-f)', color: 'var(--c-purple-l)', border: '1px solid var(--c-purple-dm)' }}>{t.reviewDue} →</button>
              {weakestSkills.length > 0 && (
                <div className="mt-3">
                  <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--c-muted)' }}>{t.gaps}</div>
                  <div className="flex flex-wrap gap-2">
                    {weakestSkills.map(state => {
                      const skill = getSkill(state.skillId)
                      return skill ? <span key={state.skillId} className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--c-bg)', color: 'var(--c-text2)' }}>{skill.title[lang]} · {state.mastery}%</span> : null
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => navigate('/fasttrack')}
          className="w-full text-left rounded-xl p-4 transition-all"
          style={{ background: '#1a1040', border: '1px solid var(--c-purple)', display: 'block', minHeight: 'auto' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--c-purple-l)' }}>{t.ftTitle}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--c-purple-l)', opacity: 0.65 }}>{t.ftSub}</div>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-lg font-medium text-white flex-shrink-0" style={{ background: 'var(--c-purple)' }}>{t.ftBtn}</span>
          </div>
          {!ftCompleted && (
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="h-full rounded-full" style={{ width: `${(ftDone.length / 7) * 100}%`, background: 'var(--c-purple-l)' }} />
            </div>
          )}
        </button>

        <div className="rounded-xl p-4" style={{ background: 'var(--c-code-bg)', border: '0.5px solid var(--c-border)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{t.progress}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--c-purple-dm)', color: 'var(--c-purple-l)' }}>
              {passed}/{totalPhases} {t.phasesCompleted}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${overall}%`, background: 'var(--c-purple)' }} />
          </div>
          <div className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>{overall}% · {Math.max(totalPhases - passed, 0)} {t.remaining}</div>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{t.phases}</h2>
          <div className="space-y-3">
            {ALL_PHASES.map(phase => <PhaseCard key={phase.id} phase={phase} progress={progress} lang={lang} />)}
          </div>
        </div>
        <div className="h-4" />
      </div>
    </Layout>
  )
}
