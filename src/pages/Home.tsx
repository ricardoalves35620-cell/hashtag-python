import Layout from '../components/Layout'
import PhaseCard from '../components/PhaseCard'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { getOverallProgress } from '../lib/progress'

export default function Home() {
  const { lang, displayName, progress } = useApp()
  const overall = getOverallProgress(progress)

  const t = {
    en: { greeting: 'Welcome back', progress: 'Overall Progress', phases: 'Course Phases', phasesCompleted: 'phases complete', remaining: 'remaining' },
    pt: { greeting: 'Bem-vindo de volta', progress: 'Progresso Geral', phases: 'Fases do Curso', phasesCompleted: 'fases completas', remaining: 'restantes' }
  }[lang]

  const passed = progress.filter(p => p.exam_passed).length

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Welcome */}
        <div className="flex items-center gap-3">
          <div>
            <div className="text-xs text-muted">{t.greeting} 👋</div>
            <h1 className="text-xl font-medium text-white">{displayName}</h1>
          </div>
        </div>

        {/* Progress card */}
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-muted font-medium uppercase tracking-wide">{t.progress}</span>
            <span className="text-xs bg-purple-dim text-purple-light px-2 py-0.5 rounded-full">
              {passed} / 10 {t.phasesCompleted}
            </span>
          </div>
          <div className="h-2 bg-[#0a0a18] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-purple-DEFAULT rounded-full transition-all duration-700"
              style={{ width: `${overall}%` }}
            />
          </div>
          <div className="text-xs text-muted">{overall}% complete · {10 - passed} {t.remaining}</div>
        </div>

        {/* Phases */}
        <div>
          <h2 className="text-xs text-muted font-medium uppercase tracking-wide mb-3">{t.phases}</h2>
          <div className="space-y-3">
            {ALL_PHASES.map(phase => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                progress={progress}
                lang={lang}
              />
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </Layout>
  )
}
