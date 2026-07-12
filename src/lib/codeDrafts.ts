import { getSupabase } from './supabase'

export interface CodeDraft {
  code: string
  inputs: string
  updatedAt: string
}

const PREFIX = 'hp_code_draft_v1'

function key(learnerId: string, phaseId: number, exerciseId: string) {
  return `${PREFIX}:${learnerId}:${phaseId}:${exerciseId}`
}

export function loadLocalDraft(learnerId: string, phaseId: number, exerciseId: string): CodeDraft | null {
  try {
    const raw = localStorage.getItem(key(learnerId, phaseId, exerciseId))
    return raw ? JSON.parse(raw) as CodeDraft : null
  } catch {
    return null
  }
}

export function saveLocalDraft(learnerId: string, phaseId: number, exerciseId: string, draft: CodeDraft) {
  localStorage.setItem(key(learnerId, phaseId, exerciseId), JSON.stringify(draft))
}

export function clearLocalDraft(learnerId: string, phaseId: number, exerciseId: string) {
  localStorage.removeItem(key(learnerId, phaseId, exerciseId))
}

export async function fetchRemoteDraft(userId: string, phaseId: number, exerciseId: string): Promise<CodeDraft | null> {
  try {
    const { data, error } = await getSupabase()
      .from('code_drafts')
      .select('code,input_values,updated_at')
      .eq('user_id', userId)
      .eq('phase_id', phaseId)
      .eq('exercise_id', exerciseId)
      .maybeSingle()
    if (error || !data) return null
    return { code: data.code || '', inputs: data.input_values || '', updatedAt: data.updated_at }
  } catch {
    return null
  }
}

export async function saveRemoteDraft(userId: string, phaseId: number, exerciseId: string, draft: CodeDraft) {
  try {
    await getSupabase().from('code_drafts').upsert({
      user_id: userId,
      phase_id: phaseId,
      exercise_id: exerciseId,
      code: draft.code,
      input_values: draft.inputs,
      updated_at: draft.updatedAt,
    }, { onConflict: 'user_id,phase_id,exercise_id' })
  } catch {
    // Local draft remains the source of truth while offline or before SQL setup.
  }
}

export function chooseNewestDraft(local: CodeDraft | null, remote: CodeDraft | null): CodeDraft | null {
  if (!local) return remote
  if (!remote) return local
  return new Date(remote.updatedAt).getTime() > new Date(local.updatedAt).getTime() ? remote : local
}
