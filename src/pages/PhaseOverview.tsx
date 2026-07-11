import { useParams, useNavigate } from 'react-router-dom'
import { scrollToTop } from '../lib/scroll'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { getPhaseStatus } from '../lib/progress'

export default function PhaseOverview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, progress, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))

  useEffect(() => { scrollToTop() }, [])

  // Refresh progress when page gains focus — catches updates from other devices
  useEffect(() => {
    const refresh = () => refreshProgress()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [refreshProgress])

  if (!phase) return <div className="p-4 text-muted">Phase not found</div>

  const phaseProgress = progress.find(p => p.phase_id === phase.id)
  const status = getPhaseStatus(progress, phase.id)

  const steps = [
    {
      id: 'lesson',
      icon: '📚',
      label: { en: 'Lesson', pt: 'Aula' },
      desc: { en: 'Content + video examples', pt: 'Conteúdo + exemplos em vídeo' },
      done: !!phaseProgress?.lesson_done,
      active: true,
      path: `/phase/${phase.id}/lesson`
    },
    {
      id: 'exercises',
      icon: '🏋️',
      label: { en: 'Exercises', pt: 'Exercícios' },
      desc: { en: 'Guided practice tasks', pt: 'Tarefas práticas guiadas' },
      done: !!phaseProgress?.exercises_done,
      active: !!phaseProgress?.lesson_done,
      path: `/phase/${phase.id}/exercises`
    },
    {
      id: 'quiz',
      icon: '🧠',
      label: { en: 'Mini-test', pt: 'Mini-teste' },
      desc: { en: 'Quick knowledge check — no grade', pt: 'Verificação rápida — sem nota' },
      done: !!phaseProgress?.quiz_done,
      active: !!phaseProgress?.exercises_done,
      path: `/phase/${phase.id}/quiz`
    },
    {
      id: 'exam',
      icon: '🎯',
      label: { en: 'Final Exam', pt: 'Exame Final' },
      desc: { en: 'Write code — needs 90% to pass', pt: 'Escreva código — precisa de 90% para passar' },
      done: !!phaseProgress?.exam_passed,
      active: !!phaseProgress?.quiz_done,
      path: `/phase/${phase.id}/exam`,
      score: phaseProgress?.exam_score
    }
  ]

  const stepsCompleted = steps.filter(s => s.done).length

  return (
    <Layout
      showBack
      backTo="/home"
      backLabel={lang === 'en' ? 'Home' : 'Início'}
      title={`${lang === 'en' ? 'Phase' : 'Fase'} ${phase.id}`}
    >
      <div className="p-4 space-y-4">
        {/* Phase header */}
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">{phase.icon}</div>
            <div>
              <div className="text-xs text-muted mb-0.5">{lang === 'en' ? 'Phase' : 'Fase'} {phase.id}</div>
              <h1 className="text-lg font-medium text-white">{phase.title[lang]}</h1>
            </div>
          </div>
          <div className="text-sm text-[#8888aa] mb-3">{phase.description[lang]}</div>

          {phase.libraries.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {phase.libraries.map(lib => (
                <span key={lib} className="text-xs font-mono bg-[#0a0a18] text-purple-light border border-[#1e1e40] px-2 py-0.5 rounded">
                  pip install {lib}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted">
              <span>{stepsCompleted}/4 {lang === 'en' ? 'steps' : 'etapas'}</span>
              <span>{Math.round((stepsCompleted / 4) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-[#0a0a18] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${stepsCompleted === 4 ? 'bg-green-500' : 'bg-purple-DEFAULT'}`}
                style={{ width: `${(stepsCompleted / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => step.active && navigate(step.path)}
              disabled={!step.active && !step.done}
              className={`
                w-full text-left rounded-xl border p-4 flex items-center gap-3 transition-all
                ${step.done
                  ? 'bg-[#0a1a0a] border-[#1a4a1a] hover:border-green-700 cursor-pointer'
                  : step.active
                  ? 'bg-card border-border hover:border-purple-dim cursor-pointer active:scale-[0.99]'
                  : 'bg-card border-border opacity-40 cursor-not-allowed'
                }
              `}
            >
              {/* Step indicator */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                ${step.done ? 'bg-green-900/40' : step.active ? 'bg-purple-faint' : 'bg-[#0a0a18]'}
              `}>
                {step.done ? '✅' : !step.active ? '🔒' : step.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{step.label[lang]}</span>
                  {step.done && step.score !== undefined && step.score !== null && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${step.score >= 90 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {step.score}%
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted mt-0.5">{step.desc[lang]}</div>
              </div>

              {(step.active || step.done) && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted flex-shrink-0">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {status === 'done' && (
          <div className="bg-[#0a1f0a] border border-[#1a4a1a] rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-green-400 font-medium text-sm">
              {lang === 'en' ? 'Phase complete! Well done.' : 'Fase completa! Parabéns.'}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
