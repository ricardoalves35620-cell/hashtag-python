import { supabase } from './supabase'
import type { UserProgress } from '../data/types'

export async function fetchProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  const rows: UserProgress[] = (data || []) as UserProgress[]

  // Merge localStorage backup — covers cases where Supabase save failed
  const lsPrefix = `hp_exam_${userId}_`
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(lsPrefix)) continue
    const phaseId = parseInt(key.replace(lsPrefix, ''))
    if (isNaN(phaseId)) continue
    try {
      const cached = JSON.parse(localStorage.getItem(key) || '{}')
      const existing = rows.find(r => r.phase_id === phaseId)
      if (!existing) {
        rows.push({
          phase_id: phaseId, user_id: userId,
          lesson_done: false, exercises_done: false, quiz_done: false,
          exam_done: cached.exam_done || false,
          exam_score: cached.score ?? null,
          exam_passed: cached.passed || false,
        } as UserProgress)
      } else if (!existing.exam_passed && cached.passed) {
        existing.exam_passed = true
        existing.exam_score = cached.score
        existing.exam_done = true
      }
    } catch { /* ignore malformed cache */ }
  }

  if (error && rows.length === 0) throw error
  return rows
}

export async function markStepDone(userId: string, phaseId: number, step: 'lesson' | 'exercises' | 'quiz') {
  const field = `${step}_done`
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      { user_id: userId, phase_id: phaseId, [field]: true },
      { onConflict: 'user_id,phase_id' }
    )
  if (error) throw error
}

export async function saveExamScore(userId: string, phaseId: number, score: number) {
  const passed = score >= 90

  // Always save to localStorage first (instant, never fails)
  const lsKey = `hp_exam_${userId}_${phaseId}`
  localStorage.setItem(lsKey, JSON.stringify({ score, passed, exam_done: true, saved_at: Date.now() }))

  // Try UPDATE first (row might already exist from lesson/quiz)
  const { error: updateErr, data: updated } = await supabase
    .from('user_progress')
    .update({ exam_score: score, exam_passed: passed, exam_done: true })
    .eq('user_id', userId)
    .eq('phase_id', phaseId)
    .select('id')

  // If no row existed (0 rows updated), INSERT
  if (!updateErr && (!updated || updated.length === 0)) {
    const { error: insertErr } = await supabase
      .from('user_progress')
      .insert({ user_id: userId, phase_id: phaseId, exam_score: score, exam_passed: passed, exam_done: true })
    if (insertErr) throw insertErr
  } else if (updateErr) {
    throw updateErr
  }

  return passed
}

export async function fetchFamilyProgress(groupId: string) {
  const { data, error } = await supabase
    .from('family_members')
    .select(`
      display_name,
      user_id,
      user_progress (phase_id, lesson_done, exercises_done, quiz_done, exam_passed, exam_score)
    `)
    .eq('group_id', groupId)

  if (error) throw error
  return data || []
}

export function getPhaseStatus(progress: UserProgress[], phaseId: number): 'locked' | 'active' | 'done' {
  // A phase is DONE if exam_passed (score >= 90%)
  // A phase UNLOCKS the next one if exam_passed OR exam_done with score >= 70%
  // This prevents being stuck if Supabase save partially fails
  const phaseComplete = (p: UserProgress | undefined) =>
    p?.exam_passed || (p?.exam_done && (p?.exam_score ?? 0) >= 70)

  if (phaseId === 1) {
    const p = progress.find(r => r.phase_id === 1)
    if (!p) return 'active'
    if (p.exam_passed) return 'done'
    if (p.exam_done) return 'active' // attempted but not passed yet
    return 'active'
  }
  const prev = progress.find(r => r.phase_id === phaseId - 1)
  if (!phaseComplete(prev)) return 'locked'
  const current = progress.find(r => r.phase_id === phaseId)
  if (current?.exam_passed) return 'done'
  return 'active'
}

export function getOverallProgress(progress: UserProgress[]): number {
  const passed = progress.filter(p => p.exam_passed).length
  return Math.round((passed / 27) * 100)
}
