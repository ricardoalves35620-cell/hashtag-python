/**
 * One synced store for everything the learner puts into the app.
 *
 * Exercises passed, checkpoint answers, predictions, change plans — all of it goes
 * through here, so nothing is ever "device-local by accident" again. Clearing site
 * data or opening the app on a phone no longer loses work.
 *
 * How it behaves:
 *   - Reads are synchronous, from a localStorage cache, because render paths need them.
 *   - Writes go to the cache immediately and to Supabase in the background.
 *   - The cloud row is the source of truth and hydrates on startup and on sign-in.
 *   - State is split per key (per phase, per feature), so two devices editing different
 *     things never clobber each other. Within one key the newest write wins.
 *   - Signed out or offline, everything still works locally and syncs on the next save.
 */

import { getSupabase } from './supabase'

const TABLE = 'learner_state'
const CACHE_PREFIX = 'hp_state_'

type Value = Record<string, unknown>

function cacheKey(learnerId: string, key: string) {
  return `${CACHE_PREFIX}${learnerId}_${key}`
}

// ── Synchronous cache ────────────────────────────────────────────────────────

export function readState<T extends Value>(learnerId: string, key: string, fallback: T): T {
  if (!learnerId || typeof localStorage === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(cacheKey(learnerId, key))
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? { ...fallback, ...parsed } as T : fallback
  } catch {
    return fallback
  }
}

function writeCache(learnerId: string, key: string, value: Value) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(cacheKey(learnerId, key), JSON.stringify(value))
  } catch {
    // Storage full or blocked. The cloud write below is still attempted.
  }
}

/** Merges a patch into the stored value, then persists locally and to the cloud. */
export function writeState<T extends Value>(learnerId: string, key: string, patch: Partial<T>): T {
  const next = { ...readState<T>(learnerId, key, {} as T), ...patch }
  writeCache(learnerId, key, next)
  notify()
  void pushToCloud(learnerId, key, next)
  return next
}

export function isSyncedStateKey(storageKey: string) {
  return storageKey.startsWith(CACHE_PREFIX)
}

// ── Cloud ────────────────────────────────────────────────────────────────────

async function currentUserId(): Promise<string | null> {
  try {
    const { data } = await getSupabase().auth.getUser()
    return data.user?.id ?? null
  } catch {
    return null
  }
}

async function pushToCloud(learnerId: string, key: string, value: Value) {
  try {
    const userId = await currentUserId()
    // Guests have no row to own; their work stays in the cache until they sign in.
    if (!userId || userId !== learnerId) return
    await getSupabase().from(TABLE).upsert(
      { user_id: userId, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,key' },
    )
  } catch {
    // Offline. The cache holds the value and the next save will carry it up.
  }
}

/**
 * Pulls every stored key for the signed-in learner into the cache. Cloud values win,
 * because a fresh device has nothing local and a returning device may be stale.
 */
export async function hydrateState(): Promise<void> {
  try {
    const userId = await currentUserId()
    if (!userId) return
    const { data, error } = await getSupabase().from(TABLE).select('key, value').eq('user_id', userId)
    if (error || !data) return
    for (const row of data) {
      if (row && typeof row.key === 'string' && row.value && typeof row.value === 'object') {
        writeCache(userId, row.key, row.value as Value)
      }
    }
    notify()
  } catch {
    // Offline or signed out — the cache is already the best available answer.
  }
}

/** Used by the reset flow: removes every synced key for this learner. */
export async function clearState(learnerId: string): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).filter(Boolean) as string[]
    keys.filter(isSyncedStateKey).forEach(key => localStorage.removeItem(key))
  }
  notify()
  try {
    const userId = await currentUserId()
    if (userId && userId === learnerId) await getSupabase().from(TABLE).delete().eq('user_id', userId)
  } catch {
    // The local copy is gone; the cloud rows clear on the next successful reset.
  }
}

// ── Change notification ──────────────────────────────────────────────────────

let version = 0
const listeners = new Set<() => void>()

function notify() {
  version += 1
  listeners.forEach(listener => listener())
}

export function subscribeState(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function getStateVersion(): number {
  return version
}

// Hydrate at startup and whenever the session changes, so signing in on a second
// device brings everything down before the learner touches anything.
if (typeof window !== 'undefined') {
  void hydrateState()
  try {
    getSupabase().auth.onAuthStateChange(() => { void hydrateState() })
  } catch {
    // Supabase not configured in this environment.
  }
}
