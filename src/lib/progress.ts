import { supabase } from './supabase'
import type { UserProgress } from '../data/types'

export async function fetchProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
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
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        phase_id: phaseId,
        exam_score: score,
        exam_passed: passed,
        exam_done: true
      },
      { onConflict: 'user_id,phase_id' }
    )
  if (error) throw error
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
  if (phaseId === 1) {
    const p = progress.find(p => p.phase_id === 1)
    if (!p) return 'active'
    if (p.exam_passed) return 'done'
    return 'active'
  }
  const prev = progress.find(p => p.phase_id === phaseId - 1)
  if (!prev?.exam_passed) return 'locked'
  const current = progress.find(p => p.phase_id === phaseId)
  if (current?.exam_passed) return 'done'
  return 'active'
}

export function getOverallProgress(progress: UserProgress[]): number {
  const passed = progress.filter(p => p.exam_passed).length
  return Math.round((passed / 10) * 100)
}
