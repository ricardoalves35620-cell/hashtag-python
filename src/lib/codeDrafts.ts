import { getSupabase } from './supabase'
import { emitSyncState } from './syncStatus'
import { enqueueMutation } from './outbox'

export interface CodeDraft {
  code: string
  inputs: string
  updatedAt: string
}

const PREFIX = 'hp_code_draft_v1'

function key(learnerId: string, phaseId: number, exerciseId: string) {
  return `${PREFIX}:${learnerId}:${phaseId}:${exerciseId}`
}

/**
 * Local drafts are written on a short debounce.
 *
 * The editor called saveLocalDraft on EVERY keystroke, and each call is a
 * synchronous JSON.stringify plus localStorage.setItem — both main-thread and both
 * blocking. On a long file on a mid-range phone that is the dominant cost per
 * character typed, and it is what made emoji/IME composition stutter.
 *
 * Coalescing to one write per 250 ms keeps the safety net (the whole point of a
 * local draft) while taking the work off the hot path. Pending writes are flushed
 * when the tab goes away, so nothing is lost.
 */
const LOCAL_DEBOUNCE_MS = 250
const pendingLocal = new Map<string, CodeDraft>()
let localTimer: ReturnType<typeof setTimeout> | null = null

export function loadLocalDraft(learnerId: string, phaseId: number, exerciseId: string): CodeDraft | null {
  const storageKey = key(learnerId, phaseId, exerciseId)
  // A draft still waiting to be written is newer than whatever is on disk.
  const pending = pendingLocal.get(storageKey)
  if (pending) return pending
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) as CodeDraft : null
  } catch {
    return null
  }
}

/** Writes every pending draft immediately. Safe to call at any time. */
export function flushLocalDrafts() {
  if (localTimer) {
    clearTimeout(localTimer)
    localTimer = null
  }
  if (!pendingLocal.size) return
  for (const [storageKey, draft] of pendingLocal) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft))
    } catch {
      // Quota or private mode. The value stays in memory for this session.
    }
  }
  pendingLocal.clear()
}

/** Queues a local draft write, coalescing bursts of keystrokes into one. */
export function scheduleLocalDraft(learnerId: string, phaseId: number, exerciseId: string, draft: CodeDraft) {
  pendingLocal.set(key(learnerId, phaseId, exerciseId), draft)
  if (localTimer) return
  localTimer = setTimeout(flushLocalDrafts, LOCAL_DEBOUNCE_MS)
}

export function saveLocalDraft(learnerId: string, phaseId: number, exerciseId: string, draft: CodeDraft) {
  pendingLocal.delete(key(learnerId, phaseId, exerciseId))
  try {
    localStorage.setItem(key(learnerId, phaseId, exerciseId), JSON.stringify(draft))
  } catch {
    // Quota or private mode.
  }
}

// A backgrounded tab may never run another timer, so drain before it goes.
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushLocalDrafts)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushLocalDrafts()
  })
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

const DRAFT_CONFLICT = 'user_id,phase_id,exercise_id'

export async function saveRemoteDraft(userId: string, phaseId: number, exerciseId: string, draft: CodeDraft): Promise<boolean> {
  const row = {
    user_id: userId,
    phase_id: phaseId,
    exercise_id: exerciseId,
    code: draft.code,
    input_values: draft.inputs,
    updated_at: draft.updatedAt,
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    await enqueueMutation({ table: 'code_drafts', row, onConflict: DRAFT_CONFLICT, userId })
    return false
  }

  emitSyncState('syncing')
  try {
    const { error } = await getSupabase().from('code_drafts').upsert(row, { onConflict: DRAFT_CONFLICT })
    if (error) throw error
    emitSyncState('synced')
    return true
  } catch {
    // This branch used to emit a status message promising a retry that no code
    // performed — only a further keystroke re-armed the save. The queue makes the
    // promise true.
    await enqueueMutation({ table: 'code_drafts', row, onConflict: DRAFT_CONFLICT, userId })
    return false
  }
}

export function chooseNewestDraft(local: CodeDraft | null, remote: CodeDraft | null): CodeDraft | null {
  if (!local) return remote
  if (!remote) return local
  return new Date(remote.updatedAt).getTime() > new Date(local.updatedAt).getTime() ? remote : local
}
