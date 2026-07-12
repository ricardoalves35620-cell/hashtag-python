import { useNavigate } from 'react-router-dom'
import type { Phase, Lang, UserProgress } from '../data/types'
import { getPhaseStatus } from '../lib/progress'
import { inferPhaseStage, getPhaseGroup } from '../data/phaseCatalog'

interface Props {
  phase: Phase
  progress: UserProgress[]
  lang: Lang
}

export default function PhaseCard({ phase, progress, lang }: Props) {
  const navigate = useNavigate()
  const status = getPhaseStatus(progress, phase.id)

  const phaseProgress = progress.find(p => p.phase_id === phase.id)
  const stepsCompleted = [
    phaseProgress?.lesson_done,
    phaseProgress?.exercises_done,
    phaseProgress?.quiz_done,
    phaseProgress?.exam_passed
  ].filter(Boolean).length

  const group = getPhaseGroup(inferPhaseStage(phase))
  const isLocked = status === 'locked'
  const isDone = status === 'done'

  return (
    <button
      onClick={() => !isLocked && navigate(`/phase/${phase.id}`)}
      disabled={isLocked}
      className={`
        w-full text-left rounded-xl border p-4 transition-all
        ${isLocked
          ? 'bg-card border-border opacity-50 cursor-not-allowed'
          : isDone
          ? 'bg-[#0a1f0a] border-[#1a4a1a] hover:border-green-700 cursor-pointer'
          : 'bg-card border-border hover:border-purple-dim cursor-pointer active:scale-[0.99]'
        }
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
          ${isDone ? 'bg-green-900/40' : isLocked ? 'bg-[#111] ' : 'bg-purple-faint'}
        `}>
          {isDone ? '✅' : isLocked ? '🔒' : phase.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium">
              {lang === 'en' ? 'Phase' : 'Fase'} {phase.id}{group ? ` · ${group.title[lang]}` : ''}
            </span>
            {isDone && (
              <span className="text-[10px] bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">
                {lang === 'en' ? 'Complete' : 'Completo'}
              </span>
            )}
            {!isDone && !isLocked && stepsCompleted > 0 && (
              <span className="text-[10px] bg-purple-dim text-purple-light px-2 py-0.5 rounded-full">
                {lang === 'en' ? 'In Progress' : 'Em Andamento'}
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-white truncate">{phase.title[lang]}</div>
        </div>

        {!isLocked && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted flex-shrink-0">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      <div className="text-xs text-[#8888aa] mb-3 line-clamp-2">{phase.description[lang]}</div>

      {(phase.desktopRequired || phase.libraries.length > 0) && (
        <div className="flex flex-wrap gap-1 mb-3">
          {phase.desktopRequired && <span className="text-[10px] bg-amber-950/40 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">{lang === 'en' ? 'Desktop practice recommended' : 'Prática desktop recomendada'}</span>}
          {phase.libraries.map(lib => (
            <span key={lib} className="text-[10px] font-mono bg-[#0d0d1f] text-purple-light border border-[#1e1e40] px-2 py-0.5 rounded">
              {lib}
            </span>
          ))}
        </div>
      )}


      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted uppercase tracking-wide">
            {stepsCompleted}/4 {lang === 'en' ? 'steps' : 'etapas'}
          </span>
          <span className="text-[10px] text-muted">{Math.round((stepsCompleted / 4) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-[#0d0d1f] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isDone ? 'bg-green-500' : 'bg-purple-DEFAULT'}`}
            style={{ width: `${(stepsCompleted / 4) * 100}%` }}
          />
        </div>
      </div>
    </button>
  )
}
