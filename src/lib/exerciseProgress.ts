/**
 * Which exercises the learner has already got right.
 *
 * Phase progress is only written once EVERY exercise in a phase passes, so a learner
 * who finishes two of three and then reloads — or who is interrupted by a deploy —
 * loses the ones they had already earned and starts again at exercise 1.
 *
 * This keeps that per-exercise state, scoped to the learner and the phase. It is
 * written synchronously to localStorage so it survives a reload, an offline session
 * and a flight. Cloud sync can be layered on later using the same shape.
 */

const KEY_PREFIX = 'hp_exercise_done_'

function key(learnerId: string, phaseId: number) {
  return `${KEY_PREFIX}${learnerId}_${phaseId}`
}

export function loadCompletedExercises(learnerId: string, phaseId: number): Record<string, boolean> {
  if (!learnerId || typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(key(learnerId, phaseId))
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    // Only ever restore positives: a stored `false` must never mask a fresh pass.
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value === true).map(([id]) => [id, true]),
    )
  } catch {
    return {}
  }
}

export function saveCompletedExercise(learnerId: string, phaseId: number, exerciseId: string) {
  if (!learnerId || typeof localStorage === 'undefined') return
  try {
    const current = loadCompletedExercises(learnerId, phaseId)
    if (current[exerciseId]) return
    current[exerciseId] = true
    localStorage.setItem(key(learnerId, phaseId), JSON.stringify(current))
  } catch {
    // Storage full or blocked. The exercise still counts for this session.
  }
}

/** Used by the reset flow so starting over really does clear earned exercises. */
export function isExerciseProgressKey(storageKey: string) {
  return storageKey.startsWith(KEY_PREFIX)
}
