/**
 * Which exercises the learner has already got right, synced across devices.
 *
 * Phase progress is only written once EVERY exercise in a phase passes, so without
 * this a learner who finishes two of three and reloads loses both. Storage goes
 * through the shared synced store, so a pass survives a reload, a cleared cache,
 * and moving to another device.
 */

import { readState, writeState } from './syncedStore'

const key = (phaseId: number) => `exercises_done:${phaseId}`

export function loadCompletedExercises(learnerId: string, phaseId: number): Record<string, boolean> {
  const stored = readState<Record<string, boolean>>(learnerId, key(phaseId), {})
  // Only ever restore positives: a stored `false` must never mask a fresh pass.
  return Object.fromEntries(Object.entries(stored).filter(([, value]) => value === true).map(([id]) => [id, true]))
}

export function saveCompletedExercise(learnerId: string, phaseId: number, exerciseId: string) {
  if (!learnerId) return
  if (loadCompletedExercises(learnerId, phaseId)[exerciseId]) return
  writeState<Record<string, boolean>>(learnerId, key(phaseId), { [exerciseId]: true })
}

/** Predictions and change plans the learner typed, kept so they can be revisited and edited. */
const notesKey = (phaseId: number) => `exercise_notes:${phaseId}`

export interface ExerciseNote { prediction?: string; plan?: string }

export function loadExerciseNotes(learnerId: string, phaseId: number): Record<string, ExerciseNote> {
  return readState<Record<string, ExerciseNote>>(learnerId, notesKey(phaseId), {})
}

export function saveExerciseNote(learnerId: string, phaseId: number, exerciseId: string, patch: ExerciseNote) {
  if (!learnerId) return
  const current = loadExerciseNotes(learnerId, phaseId)
  writeState<Record<string, ExerciseNote>>(learnerId, notesKey(phaseId), {
    [exerciseId]: { ...current[exerciseId], ...patch },
  })
}
