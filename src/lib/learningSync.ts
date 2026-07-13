import { getSupabase } from './supabase'
import type { LearningState } from './learningEngine'
import { emitSyncState } from './syncStatus'

export async function fetchRemoteLearningState(userId: string): Promise<LearningState | null> {
  try {
    const { data, error } = await getSupabase().from('learning_states').select('state').eq('user_id', userId).maybeSingle()
    if (error || !data?.state) return null
    return data.state as LearningState
  } catch {
    return null
  }
}

let syncTimer: ReturnType<typeof setTimeout> | null = null

export function scheduleLearningStateSync(userId: string, state: LearningState) {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      emitSyncState('pending', 'Learning history saved locally while offline')
      return
    }
    emitSyncState('syncing')
    try {
      const { error } = await getSupabase().from('learning_states').upsert(
        { user_id: userId, state, updated_at: new Date(state.updatedAt).toISOString() },
        { onConflict: 'user_id' },
      )
      if (error) throw error
      emitSyncState('synced')
    } catch {
      emitSyncState('pending', 'Learning history is waiting to sync')
    }
  }, 800)
}

export function chooseNewestLearningState(local: LearningState, remote: LearningState | null) {
  if (!remote || remote.version !== 1) return local
  return remote.updatedAt > local.updatedAt ? remote : local
}
