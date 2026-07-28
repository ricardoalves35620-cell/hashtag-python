/**
 * The curriculum's shape, without the curriculum.
 *
 * progress.ts needs two things only: the ordered list of phase ids, and whether a
 * phase has a mini-project. It used to get them from ALL_PHASES and MINI_PROJECTS,
 * which meant AppContext -> progress.ts -> data/phases dragged ~900 KB of lesson
 * content and ~95 KB of project definitions into the entry chunk. Every learner
 * downloaded the whole 69-phase curriculum before the login screen could render.
 *
 * These constants are deliberately literal. phaseIndex.test.ts asserts they match
 * the real data, so drift fails CI rather than shipping a silently wrong lock state.
 */

/** Every phase id, in curriculum order. Order defines the unlock chain. */
export const PHASE_IDS: readonly number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68,
]

/** Phases that close with a mini-project. The project is optional for unlocking. */
export const MILESTONE_PROJECT_PHASE_IDS: readonly number[] = [4, 7, 12, 27, 39, 53, 60, 64, 68]

const milestoneLookup = new Set(MILESTONE_PROJECT_PHASE_IDS)

export function phaseHasMiniProject(phaseId: number): boolean {
  return milestoneLookup.has(phaseId)
}

export function phaseCount(): number {
  return PHASE_IDS.length
}
