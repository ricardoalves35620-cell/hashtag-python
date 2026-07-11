import { getSupabase } from './supabase'
import type { UserProgress } from '../data/types'
import { ALL_PHASES } from '../data/phases'

const GUEST_ID = 'guest'

function localProgressKey(userId: string) {
  return `hp_progress_v1_${userId}`
}

function loadLocalProgress(userId: string): UserProgress[] {
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

function upsertLocalProgress(userId: string, phaseId: number, patch: Partial<UserProgress>) {
  const rows = loadLocalProgress(userId)
  const index = rows.findIndex(row => row.phase_id === phaseId)
  const base: UserProgress = index >= 0 ? rows[index] : {
    user_id: userId,
    phase_id: phaseId,
    lesson_done: false,
    exercises_done: false,
    quiz_done: false,
    exam_done: false,
    exam_score: null,
    exam_passed: false,
  }
  const next = { ...base, ...patch, user_id: userId, phase_id: phaseId }
  if (index >= 0) rows[index] = next
  else rows.push(next)
  saveLocalProgress(userId, rows)
  return rows
}

function mergeProgress(remote: UserProgress[], local: UserProgress[]) {
  const byPhase = new Map<number, UserProgress>()
  for (const row of [...remote, ...local]) {
    const previous = byPhase.get(row.phase_id)
    if (!previous) byPhase.set(row.phase_id, { ...row })
    else byPhase.set(row.phase_id, {
      ...previous,
      lesson_done: previous.lesson_done || row.lesson_done,
      exercises_done: previous.exercises_done || row.exercises_done,
      quiz_done: previous.quiz_done || row.quiz_done,
      exam_done: previous.exam_done || row.exam_done,
      exam_passed: previous.exam_passed || row.exam_passed,
      exam_score: Math.max(previous.exam_score ?? 0, row.exam_score ?? 0) || null,
    })
  }
  return [...byPhase.values()]
}

export async function fetchProgress(userId: string): Promise<UserProgress[]> {
  const local = loadLocalProgress(userId)
  if (userId === GUEST_ID) return local

  const { data, error } = await getSupabase().from('user_progress').select('*').eq('user_id', userId)
  const remote = (data || []) as UserProgress[]
  const merged = mergeProgress(remote, local)
  saveLocalProgress(userId, merged)
  if (error && merged.length === 0) throw error
  return merged
}

export async function markStepDone(userId: string, phaseId: number, step: 'lesson' | 'exercises' | 'quiz') {
  const field = `${step}_done` as 'lesson_done' | 'exercises_done' | 'quiz_done'
  upsertLocalProgress(userId, phaseId, { [field]: true })
  if (userId === GUEST_ID) return
  const { error } = await getSupabase().from('user_progress').upsert(
    { user_id: userId, phase_id: phaseId, [field]: true },
    { onConflict: 'user_id,phase_id' },
  )
  if (error) throw error
}

export async function saveExamScore(userId: string, phaseId: number, score: number) {
  const passed = score >= 90
  upsertLocalProgress(userId, phaseId, { exam_score: score, exam_passed: passed, exam_done: true })
  localStorage.setItem(`hp_exam_${userId}_${phaseId}`, JSON.stringify({ score, passed, exam_done: true, saved_at: Date.now() }))
  if (userId === GUEST_ID) return passed

  const { error: updateError, data: updated } = await getSupabase()
    .from('user_progress')
    .update({ exam_score: score, exam_passed: passed, exam_done: true })
    .eq('user_id', userId)
    .eq('phase_id', phaseId)
    .select('id')

  if (!updateError && (!updated || updated.length === 0)) {
    const { error: insertError } = await getSupabase().from('user_progress').insert({ user_id: userId, phase_id: phaseId, exam_score: score, exam_passed: passed, exam_done: true })
    if (insertError) throw insertError
  } else if (updateError) throw updateError

  return passed
}


export async function migrateGuestProgress(userId: string) {
  const guest = loadLocalProgress(GUEST_ID)
  if (!guest.length) return
  const account = await fetchProgress(userId)
  const merged = mergeProgress(account, guest).map(row => ({ ...row, user_id: userId }))
  saveLocalProgress(userId, merged)
  for (const row of merged) {
    try {
      await getSupabase().from('user_progress').upsert(row, { onConflict: 'user_id,phase_id' })
    } catch { /* local migration remains available */ }
  }
}

export async function fetchFamilyProgress(groupId: string) {
  const { data, error } = await getSupabase().from('family_members').select(`
      display_name,
      user_id,
      user_progress (phase_id, lesson_done, exercises_done, quiz_done, exam_passed, exam_score)
    `).eq('group_id', groupId)
  if (error) throw error
  return data || []
}

export function getPhaseStatus(progress: UserProgress[], phaseId: number): 'locked' | 'active' | 'done' {
  const orderedIds = ALL_PHASES.map(phase => phase.id)
  const phaseIndex = orderedIds.indexOf(phaseId)
  if (phaseIndex === -1) return 'locked'
  const current = progress.find(row => row.phase_id === phaseId)
  if (current?.exam_passed) return 'done'
  if (phaseIndex === 0) return 'active'
  const previous = progress.find(row => row.phase_id === orderedIds[phaseIndex - 1])
  return previous?.exam_passed ? 'active' : 'locked'
}

export function getOverallProgress(progress: UserProgress[]): number {
  const publishedIds = new Set(ALL_PHASES.map(phase => phase.id))
  const passed = progress.filter(row => row.exam_passed && publishedIds.has(row.phase_id)).length
  return ALL_PHASES.length > 0 ? Math.round((passed / ALL_PHASES.length) * 100) : 0
}
