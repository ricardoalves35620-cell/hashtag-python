import { getSupabase } from './supabase'
import type { UserProgress } from '../data/types'
import { emitSyncState } from './syncStatus'
// Deliberately NOT ../data/phases or ../data/miniProjects. AppContext imports this
// module, so anything imported here lands in the entry chunk — and those two would
// put the entire 69-phase curriculum in front of the login screen. phaseIndex holds
// just the ids and milestone flags, and phaseIndex.test.ts keeps it honest.
import { PHASE_IDS, phaseHasMiniProject } from '../data/phaseIndex'

const GUEST_ID = 'guest'

function localProgressKey(userId: string) {
  return `hp_progress_v1_${userId}`
}

function pendingProgressKey(userId: string) {
  return `hp_progress_pending_v1_${userId}`
}

export function loadLocalProgress(userId: string): UserProgress[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const parsed = JSON.parse(localStorage.getItem(localProgressKey(userId)) || '[]')
    return Array.isArray(parsed) ? parsed as UserProgress[] : []
  } catch {
    return []
  }
}

function saveLocalProgress(userId: string, progress: UserProgress[]) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(localProgressKey(userId), JSON.stringify(progress))
}

function markPending(userId: string, phaseIds: number[]) {
  if (typeof localStorage === 'undefined' || userId === GUEST_ID) return
  const current = new Set<number>(JSON.parse(localStorage.getItem(pendingProgressKey(userId)) || '[]'))
  phaseIds.forEach(id => current.add(id))
  localStorage.setItem(pendingProgressKey(userId), JSON.stringify([...current]))
}

function clearPending(userId: string, phaseIds: number[]) {
  if (typeof localStorage === 'undefined') return
  const current = new Set<number>(JSON.parse(localStorage.getItem(pendingProgressKey(userId)) || '[]'))
  phaseIds.forEach(id => current.delete(id))
  localStorage.setItem(pendingProgressKey(userId), JSON.stringify([...current]))
}

function emptyRow(userId: string, phaseId: number): UserProgress {
  return {
    user_id: userId,
    phase_id: phaseId,
    lesson_done: false,
    exercises_done: false,
    quiz_done: false,
    exam_done: false,
    exam_score: null,
    exam_passed: false,
    project_done: false,
  }
}

function upsertLocalProgress(userId: string, phaseId: number, patch: Partial<UserProgress>) {
  const rows = loadLocalProgress(userId)
  const index = rows.findIndex(row => row.phase_id === phaseId)
  const base = index >= 0 ? rows[index] : emptyRow(userId, phaseId)
  const next: UserProgress = {
    ...base,
    ...patch,
    user_id: userId,
    phase_id: phaseId,
    updated_at: new Date().toISOString(),
  }
  if (index >= 0) rows[index] = next
  else rows.push(next)
  saveLocalProgress(userId, rows)
  markPending(userId, [phaseId])
  return rows
}

export function mergeProgress(remote: UserProgress[], local: UserProgress[]) {
  const byPhase = new Map<number, UserProgress>()
  for (const row of [...remote, ...local]) {
    const previous = byPhase.get(row.phase_id)
    if (!previous) byPhase.set(row.phase_id, { ...row })
    else {
      const bestScore = Math.max(previous.exam_score ?? 0, row.exam_score ?? 0)
      byPhase.set(row.phase_id, {
        ...previous,
        ...row,
        user_id: row.user_id || previous.user_id,
        lesson_done: previous.lesson_done || row.lesson_done,
        exercises_done: previous.exercises_done || row.exercises_done,
        quiz_done: previous.quiz_done || row.quiz_done,
        exam_done: Boolean(previous.exam_done || row.exam_done),
        exam_passed: previous.exam_passed || row.exam_passed,
        project_done: Boolean(previous.project_done || row.project_done),
        exam_score: bestScore || null,
        updated_at: [previous.updated_at, row.updated_at].filter(Boolean).sort().at(-1),
      })
    }
  }
  return [...byPhase.values()].sort((a, b) => a.phase_id - b.phase_id)
}

function sameProgress(a: UserProgress | undefined, b: UserProgress) {
  if (!a) return false
  return Boolean(a.lesson_done) === Boolean(b.lesson_done)
    && Boolean(a.exercises_done) === Boolean(b.exercises_done)
    && Boolean(a.quiz_done) === Boolean(b.quiz_done)
    && Boolean(a.exam_done) === Boolean(b.exam_done)
    && (a.exam_score ?? null) === (b.exam_score ?? null)
    && Boolean(a.exam_passed) === Boolean(b.exam_passed)
    && Boolean(a.project_done) === Boolean(b.project_done)
}

function cloudPayload(row: UserProgress, userId: string) {
  return {
    user_id: userId,
    phase_id: row.phase_id,
    lesson_done: Boolean(row.lesson_done),
    exercises_done: Boolean(row.exercises_done),
    quiz_done: Boolean(row.quiz_done),
    exam_done: Boolean(row.exam_done),
    exam_score: row.exam_score,
    exam_passed: Boolean(row.exam_passed),
    project_done: Boolean(row.project_done),
    updated_at: new Date().toISOString(),
  }
}

/**
 * Reconciles local and cloud progress using monotonic rules: completed steps never
 * become incomplete and the best exam score always wins. This makes retries safe.
 */
export async function syncProgressToCloud(userId: string): Promise<UserProgress[]> {
  const local = loadLocalProgress(userId)
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    emitSyncState('pending', 'Progress saved locally while offline')
    return local
  }
  emitSyncState('syncing')
  if (userId === GUEST_ID) return local

  const { data, error } = await getSupabase()
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    markPending(userId, local.map(row => row.phase_id))
    emitSyncState('error', 'Could not reach the progress service')
    throw error
  }

  const remote = (data || []) as UserProgress[]
  const merged = mergeProgress(remote, local).map(row => ({ ...row, user_id: userId }))
  saveLocalProgress(userId, merged)

  const remoteByPhase = new Map(remote.map(row => [row.phase_id, row]))
  const changed = merged.filter(row => !sameProgress(remoteByPhase.get(row.phase_id), row))

  if (changed.length) {
    const { error: syncError } = await getSupabase()
      .from('user_progress')
      .upsert(changed.map(row => cloudPayload(row, userId)), { onConflict: 'user_id,phase_id' })
    if (syncError) {
      markPending(userId, changed.map(row => row.phase_id))
      throw syncError
    }
    clearPending(userId, changed.map(row => row.phase_id))
  }

  emitSyncState('synced')
  return merged
}

export async function fetchProgress(userId: string): Promise<UserProgress[]> {
  const local = loadLocalProgress(userId)
  if (userId === GUEST_ID) return local

  try {
    return await syncProgressToCloud(userId)
  } catch (error) {
    if (local.length) return local
    throw error
  }
}

export async function markStepDone(userId: string, phaseId: number, step: 'lesson' | 'exercises' | 'quiz') {
  const field = `${step}_done` as 'lesson_done' | 'exercises_done' | 'quiz_done'
  upsertLocalProgress(userId, phaseId, { [field]: true })
  if (userId === GUEST_ID) return
  await syncProgressToCloud(userId)
}

export async function markProjectDone(userId: string, phaseId: number) {
  upsertLocalProgress(userId, phaseId, { project_done: true })
  if (userId === GUEST_ID) return
  await syncProgressToCloud(userId)
}

export async function saveExamScore(userId: string, phaseId: number, score: number) {
  const passed = score >= 90
  const current = loadLocalProgress(userId).find(row => row.phase_id === phaseId)
  const bestScore = Math.max(current?.exam_score ?? 0, score)
  const everPassed = Boolean(current?.exam_passed || passed)

  upsertLocalProgress(userId, phaseId, {
    exam_score: bestScore,
    exam_passed: everPassed,
    exam_done: true,
  })
  localStorage.setItem(`hp_exam_${userId}_${phaseId}`, JSON.stringify({
    score: bestScore,
    passed: everPassed,
    exam_done: true,
    saved_at: Date.now(),
  }))

  if (userId !== GUEST_ID) await syncProgressToCloud(userId)
  return everPassed
}

export async function migrateGuestProgress(userId: string) {
  const guest = loadLocalProgress(GUEST_ID)
  if (!guest.length) return
  const account = await fetchProgress(userId)
  const merged = mergeProgress(account, guest).map(row => ({ ...row, user_id: userId }))
  saveLocalProgress(userId, merged)
  markPending(userId, merged.map(row => row.phase_id))
  try { await syncProgressToCloud(userId) } catch { /* retry on focus/next refresh */ }
}

export async function fetchFamilyProgress(groupId: string) {
  const { data, error } = await getSupabase().from('family_members').select(`
      display_name,
      user_id,
      user_progress (phase_id, lesson_done, exercises_done, quiz_done, exam_done, exam_passed, exam_score)
    `).eq('group_id', groupId)
  if (error) throw error
  return data || []
}

export function getPhaseStatus(progress: UserProgress[], phaseId: number): 'locked' | 'active' | 'done' {
  const orderedIds = PHASE_IDS
  const phaseIndex = orderedIds.indexOf(phaseId)
  if (phaseIndex === -1) return 'locked'

  const current = progress.find(row => row.phase_id === phaseId)
  const currentHasProject = phaseHasMiniProject(phaseId)
  const currentMastered = Boolean(current?.exam_passed && (!currentHasProject || current.project_done))
  if (currentMastered) return 'done'

  if (phaseIndex === 0) return 'active'
  const previousPhaseId = orderedIds[phaseIndex - 1]
  const previous = progress.find(row => row.phase_id === previousPhaseId)
  // A mini-project is OPTIONAL. Passing the exam is what unlocks the next phase;
  // requiring the project as well left a learner who skipped it stuck behind a lock
  // they were never told about. The project still counts towards mastering a phase.
  return previous?.exam_passed ? 'active' : 'locked'
}

export function getOverallProgress(progress: UserProgress[]): number {
  // Optional work must not hold the number down: a learner who skips every
  // mini-project can still reach 100%.
  const mastered = PHASE_IDS.filter(phaseId => {
    const row = progress.find(item => item.phase_id === phaseId)
    return Boolean(row?.exam_passed)
  }).length
  return PHASE_IDS.length > 0 ? Math.round((mastered / PHASE_IDS.length) * 100) : 0
}
