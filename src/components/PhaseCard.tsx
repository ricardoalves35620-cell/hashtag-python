import { useNavigate } from 'react-router-dom'
import type { Phase, Lang, UserProgress } from '../data/types'
import { getPhaseStatus } from '../lib/progress'
import { phaseHasMiniProject } from '../data/phaseIndex'
import { inferPhaseStage, getPhaseGroup } from '../data/phaseCatalog'
import { Badge, Progress } from './ui'

interface Props { phase: Phase; progress: UserProgress[]; lang: Lang }

export default function PhaseCard({ phase, progress, lang }: Props) {
  const navigate = useNavigate()
  const status = getPhaseStatus(progress, phase.id)
  const phaseProgress = progress.find(p => p.phase_id === phase.id)
  const stepsCompleted = [phaseProgress?.lesson_done, phaseProgress?.exercises_done, phaseProgress?.quiz_done, phaseProgress?.exam_passed].filter(Boolean).length
  const group = getPhaseGroup(inferPhaseStage(phase))
  const isLocked = status === 'locked'
  const isDone = status === 'done'
  // Deliberately from phaseIndex, not MINI_PROJECTS: importing the project data here
  // would pull the whole ~84 KB definitions chunk into the Home screen's load. The
  // index is pinned to the real data by phaseIndex.test.ts.
  const hasMiniProject = phaseHasMiniProject(phase.id)
  const miniProjectDone = Boolean(phaseProgress?.project_done)

  return (
    <button
      type="button"
      onClick={() => !isLocked && navigate(`/phase/${phase.id}`)}
      disabled={isLocked}
      className={`hp-phase-card ${isDone ? 'hp-phase-card--done' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`hp-phase-card__icon ${isDone ? 'hp-phase-card__icon--done' : ''}`} aria-hidden="true">
          {isDone ? '✓' : isLocked ? '🔒' : phase.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-caption font-semibold text-ink-muted">{lang === 'en' ? 'Phase' : 'Fase'} {phase.id}{group ? ` · ${group.title[lang]}` : ''}</span>
            {isDone && <Badge variant="success">{lang === 'en' ? 'Complete' : 'Completo'}</Badge>}
            {!isDone && !isLocked && stepsCompleted > 0 && <Badge variant="primary">{lang === 'en' ? 'In progress' : 'Em andamento'}</Badge>}
          </div>
          <div className="truncate text-sm font-bold text-ink">{phase.title[lang]}</div>
        </div>
        {!isLocked && <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 text-ink-muted" aria-hidden="true"><path d="m7 4 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
      </div>

      <p className="mt-3 mb-0 line-clamp-2 text-xs text-ink-secondary">{phase.description[lang]}</p>
      {(phase.desktopRequired || phase.libraries.length > 0 || hasMiniProject) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {/* The mini-project is a bonus: it never counts in the 4 steps below and
              never blocks the next phase (see getPhaseStatus). The badge only makes
              its existence visible before entering the phase. */}
          {hasMiniProject && (
            <Badge variant={miniProjectDone ? 'success' : 'primary'}>
              {miniProjectDone
                ? (lang === 'en' ? '✓ Mini-project done' : '✓ Mini-projeto concluído')
                : (lang === 'en' ? '🚀 Bonus mini-project' : '🚀 Mini-projeto bônus')}
            </Badge>
          )}
          {phase.desktopRequired && <Badge variant="warning">{lang === 'en' ? 'Desktop recommended' : 'Desktop recomendado'}</Badge>}
          {phase.libraries.map(lib => <Badge key={lib} variant="neutral" mono>{lib}</Badge>)}
        </div>
      )}
      <div className="mt-4"><Progress value={stepsCompleted} max={4} label={`${stepsCompleted}/4 ${lang === 'en' ? 'steps' : 'etapas'}`} showValue tone={isDone ? 'success' : 'primary'} size="sm" /></div>
    </button>
  )
}
