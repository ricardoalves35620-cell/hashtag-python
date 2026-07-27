import type { UserProgress } from '../data/types'
import { PHASE_IDS } from '../data/progressionCatalog'
import { getPhaseStatus } from './progress'

export type LearningStep = 'overview' | 'lesson' | 'exercises' | 'quiz' | 'exam' | 'project'

export function canAccessLearningStep(step: LearningStep, phaseId: number, progress: UserProgress[]) {
  if (!Number.isInteger(phaseId) || !PHASE_IDS.includes(phaseId)) return false
  if (getPhaseStatus(progress, phaseId) === 'locked') return false

  const phaseProgress = progress.find(row => row.phase_id === phaseId)
  if (step === 'overview' || step === 'lesson') return true
  if (step === 'exercises') return Boolean(phaseProgress?.lesson_done)
  if (step === 'quiz') return Boolean(phaseProgress?.exercises_done)
  if (step === 'exam') return Boolean(phaseProgress?.quiz_done)
  return Boolean(phaseProgress?.exam_passed)
}
