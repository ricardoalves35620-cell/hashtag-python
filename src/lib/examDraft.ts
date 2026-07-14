import { getSupabase } from './supabase'
import { emitSyncState } from './syncStatus'

const LS_PREFIX = 'hp_exam_draft_'

interface StoredExamDraft {
  code: string
  updatedAt: string
}

function lsKey(userId: string, phaseId: number) {
  return `${LS_PREFIX}${userId}_${phaseId}`
}

function readLocalDraft(userId: string, phaseId: number): StoredExamDraft | null {
  const raw = localStorage.getItem(lsKey(userId, phaseId))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<StoredExamDraft>
    if (typeof parsed.code === 'string') {
      return { code: parsed.code, updatedAt: parsed.updatedAt || new Date(0).toISOString() }
    }
  } catch {
    // Older versions stored the code as a plain string.
  }
  return { code: raw, updatedAt: new Date(0).toISOString() }
}

function writeLocalDraft(userId: string, phaseId: number, draft: StoredExamDraft) {
  localStorage.setItem(lsKey(userId, phaseId), JSON.stringify(draft))
}

export async function loadExamDraft(userId: string, phaseId: number, fallback: string): Promise<string> {
  const local = readLocalDraft(userId, phaseId)
  if (userId === 'guest') return local?.code || fallback

  try {
    const { data, error } = await getSupabase()
      .from('exam_drafts')
      .select('code, updated_at')
      .eq('user_id', userId)
      .eq('phase_id', phaseId)
      .maybeSingle()

    if (error) throw error
    const remote = data?.code
      ? { code: data.code as string, updatedAt: data.updated_at as string }
      : null
    const localTime = Date.parse(local?.updatedAt || '') || 0
    const remoteTime = Date.parse(remote?.updatedAt || '') || 0
    const chosen = remote && remoteTime > localTime ? remote : local

    if (chosen) writeLocalDraft(userId, phaseId, chosen)
    if (local && (!remote || localTime > remoteTime)) saveExamDraft(userId, phaseId, local.code, local.updatedAt)
    return chosen?.code || fallback
  } catch {
    return local?.code || fallback
  }
}

const saveTimers = new Map<string, ReturnType<typeof setTimeout>>()

export function saveExamDraft(userId: string, phaseId: number, code: string, timestamp = new Date().toISOString()) {
  const draft = { code, updatedAt: timestamp }
  writeLocalDraft(userId, phaseId, draft)
  if (userId === 'guest') return

  const key = `${userId}:${phaseId}`
  const existing = saveTimers.get(key)
  if (existing) clearTimeout(existing)
  saveTimers.set(key, setTimeout(async () => {
    saveTimers.delete(key)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      emitSyncState('pending', 'Exam draft saved locally while offline')
      return
    }
    emitSyncState('syncing')
    try {
      const { error } = await getSupabase()
        .from('exam_drafts')
        .upsert(
          { user_id: userId, phase_id: phaseId, code, updated_at: timestamp },
          { onConflict: 'user_id,phase_id' },
        )
      if (error) throw error
      emitSyncState('synced')
    } catch {
      emitSyncState('pending', 'Exam draft is waiting to sync')
    }
  }, 900))
}

export async function clearExamDraft(userId: string, phaseId: number) {
  localStorage.removeItem(lsKey(userId, phaseId))
  if (userId === 'guest') return
  try {
    await getSupabase().from('exam_drafts').delete().eq('user_id', userId).eq('phase_id', phaseId)
  } catch { /* non-critical */ }
}
