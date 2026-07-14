import { getSupabase } from './supabase'
import { mergeLearningStates, type LearningState } from './learningEngine'
import { emitSyncState } from './syncStatus'

export async function fetchRemoteLearningState(userId: string): Promise<LearningState | null> {
  try {
    const { data, error } = await getSupabase()
      .from('learning_states')
      .select('state')
      .eq('user_id', userId)
      .maybeSingle()
    if (error || !data?.state) return null
    return data.state as LearningState
  } catch {
    return null
  }
}

/**
 * Learning history is append-only evidence. Two devices must therefore be
 * merged, never chosen as mutually exclusive snapshots. Attempts are deduped
 * by id and each skill keeps the latest practice evidence.
 */
export function reconcileLearningStates(local: LearningState, remote: LearningState | null) {
  return remote?.version === 1 ? mergeLearningStates(local, remote) : local
}

export async function syncLearningStateNow(userId: string, local: LearningState): Promise<LearningState> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    emitSyncState('pending', 'Learning history saved locally while offline')
    return local
  }

  emitSyncState('syncing')
  try {
    const remote = await fetchRemoteLearningState(userId)
    const merged = reconcileLearningStates(local, remote)
    const { error } = await getSupabase().from('learning_states').upsert(
      {
        user_id: userId,
        state: merged,
        updated_at: new Date(merged.updatedAt).toISOString(),
      },
      { onConflict: 'user_id' },
    )
    if (error) throw error
    emitSyncState('synced')
    return merged
  } catch (error) {
    emitSyncState('pending', 'Learning history is waiting to sync')
    throw error
  }
}

const syncTimers = new Map<string, ReturnType<typeof setTimeout>>()
const pendingStates = new Map<string, LearningState>()

export function scheduleLearningStateSync(userId: string, state: LearningState) {
  const pending = pendingStates.get(userId)
  pendingStates.set(userId, pending ? mergeLearningStates(pending, state) : state)

  const previousTimer = syncTimers.get(userId)
  if (previousTimer) clearTimeout(previousTimer)

  syncTimers.set(userId, setTimeout(async () => {
    syncTimers.delete(userId)
    const latest = pendingStates.get(userId)
    pendingStates.delete(userId)
    if (!latest) return
    try {
      const merged = await syncLearningStateNow(userId, latest)
      window.dispatchEvent(new CustomEvent('hp:learning-state-synced', { detail: merged }))
    } catch {
      pendingStates.set(userId, latest)
    }
  }, 650))
}

/** Backward-compatible name used by existing tests and imports. */
export function chooseNewestLearningState(local: LearningState, remote: LearningState | null) {
  return reconcileLearningStates(local, remote)
}
