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
import { enqueueMutation, pendingRowValues } from './outbox'

const TABLE = 'learner_state'
const CACHE_PREFIX = 'hp_state_'
const STAMP_PREFIX = 'hp_state_at_'

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

/**
 * When a key was last written on this device.
 *
 * Deliberately a sidecar key rather than a field inside the value: callers iterate
 * over the stored object (LearningPreferences renders a toggle per key, and
 * loadCompletedExercises filters its entries), so an extra property would leak
 * into the UI and into learner data.
 */
function stampKey(learnerId: string, key: string) {
  return `${STAMP_PREFIX}${learnerId}_${key}`
}

/**
 * Whether a remote row may overwrite the local cache.
 *
 * Exported so the rule can be tested directly: it is the difference between
 * "reconnecting syncs your work" and "reconnecting destroys your work".
 */
export function shouldTakeRemoteValue(localStamp: number, remoteStamp: number): boolean {
  // No local stamp: nothing was written on this device since the upgrade, so the
  // server copy is the best available answer.
  if (!localStamp) return true
  return remoteStamp >= localStamp
}

function readStamp(learnerId: string, key: string): number {
  if (typeof localStorage === 'undefined') return 0
  const value = Number(localStorage.getItem(stampKey(learnerId, key)))
  return Number.isFinite(value) && value > 0 ? value : 0
}

function writeStamp(learnerId: string, key: string, at: number) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(stampKey(learnerId, key), String(at))
  } catch {
    // Storage blocked; hydrate falls back to letting the cloud win, which is the
    // previous behaviour.
  }
}

/** Merges a patch into the stored value, then persists locally and to the cloud. */
export function writeState<T extends Value>(learnerId: string, key: string, patch: Partial<T>): T {
  const next = { ...readState<T>(learnerId, key, {} as T), ...patch }
  writeCache(learnerId, key, next)
  writeStamp(learnerId, key, Date.now())
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
  const userId = await currentUserId()
  // Guests have no row to own; their work stays in the cache until they sign in.
  if (!userId || userId !== learnerId) return

  const row = { user_id: userId, key, value, updated_at: new Date().toISOString() }
  try {
    const { error } = await getSupabase().from(TABLE).upsert(row, { onConflict: 'user_id,key' })
    if (error) throw error
  } catch {
    // Offline or rejected. The old comment claimed "the next save will carry it up",
    // but nothing re-sent it — closing the tab lost the write. Queue the intent so a
    // reconnect actually replays it.
    await enqueueMutation({ table: TABLE, row, onConflict: 'user_id,key', userId })
  }
}

/**
 * Pulls every stored key for the signed-in learner into the cache.
 *
 * Cloud values used to win unconditionally, and this runs at module import and on
 * every onAuthStateChange — including the roughly hourly token refresh. That meant
 * a learner who worked offline could have unsynced work destroyed by an older
 * server row. Newest write wins now, which is the rule codeDrafts.chooseNewestDraft
 * already used; the two modules simply disagreed.
 */
export async function hydrateState(): Promise<void> {
  try {
    const userId = await currentUserId()
    if (!userId) return
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('key, value, updated_at, server_updated_at')
      .eq('user_id', userId)
    if (error || !data) return

    // Anything still queued is local work that has not reached the server yet, so
    // no server row may replace it — regardless of what the clocks say.
    const queued = await pendingRowValues(TABLE, 'key', userId)

    for (const row of data) {
      if (!row || typeof row.key !== 'string' || !row.value || typeof row.value !== 'object') continue
      if (queued.has(row.key)) continue

      const localStamp = readStamp(userId, row.key)
      // server_updated_at is trigger-maintained, so it cannot be skewed by a device
      // with a wrong clock. Fall back to updated_at where the migration has not run.
      const remoteStamp = Date.parse(String(row.server_updated_at ?? row.updated_at ?? '')) || 0
      if (!shouldTakeRemoteValue(localStamp, remoteStamp)) continue

      writeCache(userId, row.key, row.value as Value)
      if (remoteStamp) writeStamp(userId, row.key, remoteStamp)
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
