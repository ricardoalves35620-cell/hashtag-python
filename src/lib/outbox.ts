/**
 * Durable outbox for learner mutations.
 *
 * Every cloud write in this app was fire-and-forget: syncedStore.pushToCloud,
 * codeDrafts.saveRemoteDraft and learningSync all swallowed their failures. A
 * learner on a flaky connection lost work and was never told.
 *
 * Workbox's BackgroundSyncPlugin is the wrong tool for fixing that. It replays the
 * raw HTTP request, including the Authorization header captured at queue time. A
 * learner offline for longer than the token lifetime replays an expired JWT and
 * fails a second time — inside the service worker, where no UI can react. Worse, a
 * replay after sign-out would write using the previous learner's token.
 *
 * This queue stores the *intent* (table + row + conflict key) in IndexedDB and
 * replays it through the Supabase client, which mints a fresh token at send time
 * and refuses to send when nobody is signed in. Entries are stamped with the owner
 * so a queued write can never land on a different account.
 */

import { getSupabase } from './supabase'
import { emitSyncState } from './syncStatus'

const DB_NAME = 'hp-outbox'
const DB_VERSION = 1
const STORE = 'mutations'

/** After this many failed replays the row is dropped and the learner is told. */
const MAX_ATTEMPTS = 8

/** Fired when an entry is discarded for good, so the UI can surface real data loss. */
export const OUTBOX_DROPPED_EVENT = 'hp:outbox-dropped'

export interface OutboxEntry {
  id?: number
  table: string
  row: Record<string, unknown>
  onConflict: string
  userId: string
  queuedAt: string
  attempts: number
}

function supported(): boolean {
  return typeof indexedDB !== 'undefined'
}

export type ReplayDecision = 'replay' | 'skip' | 'drop'

/**
 * What to do with a queued entry for the currently signed-in learner.
 *
 * Exported so the safety rules can be tested without a browser: 'skip' keeps
 * another account's write queued but unsent, 'drop' discards a row the server has
 * rejected too many times rather than retrying it forever.
 */
export function classifyEntry(
  entry: Pick<OutboxEntry, 'userId' | 'attempts'>,
  currentUserId: string | null | undefined,
): ReplayDecision {
  if (!currentUserId) return 'skip'
  if (entry.userId !== currentUserId) return 'skip'
  if (entry.attempts >= MAX_ATTEMPTS) return 'drop'
  return 'replay'
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('hp-outbox blocked'))
  })
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDatabase()
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = run(db.transaction(STORE, mode).objectStore(STORE))
      request.onsuccess = () => resolve(request.result as T)
      request.onerror = () => reject(request.error)
    })
  } finally {
    db.close()
  }
}

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach(listener => listener())
}

/** Lets a component re-render when the queue depth changes. */
export function subscribeOutbox(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/**
 * Queues a write that could not reach the server. Safe to call from any catch
 * block: it never throws, because a failure to queue must not break the caller's
 * already-degraded path.
 */
export async function enqueueMutation(
  entry: Omit<OutboxEntry, 'id' | 'queuedAt' | 'attempts'>,
): Promise<void> {
  if (!supported() || !entry.userId) return
  try {
    await withStore('readwrite', store =>
      store.add({ ...entry, queuedAt: new Date().toISOString(), attempts: 0 }),
    )
    const pending = await pendingCount()
    emitSyncState('pending', `${pending} change${pending === 1 ? '' : 's'} waiting to sync`)
    notify()
  } catch {
    // IndexedDB blocked (private mode, quota, or an older schema). The synchronous
    // local cache still holds the value, so the learner sees their work.
  }
}

export async function pendingCount(): Promise<number> {
  if (!supported()) return 0
  try {
    return await withStore<number>('readonly', store => store.count())
  } catch {
    return 0
  }
}

/**
 * Which row identifiers for `table` still have an unsent write queued.
 *
 * hydrateState() uses this so a server row can never overwrite local work that is
 * merely waiting to upload. Timestamps alone cannot decide this: a device whose
 * clock runs slow would compare its own fresh write as older than the stale server
 * row and discard it — the exact data loss this whole change set exists to stop.
 */
export async function pendingRowValues(
  table: string,
  field: string,
  userId: string | null | undefined,
): Promise<Set<string>> {
  const pending = new Set<string>()
  if (!supported() || !userId) return pending
  try {
    const entries = await withStore<OutboxEntry[]>('readonly', store => store.getAll())
    for (const entry of entries) {
      if (entry.table !== table || entry.userId !== userId) continue
      const value = entry.row?.[field]
      if (typeof value === 'string') pending.add(value)
    }
  } catch {
    // Unreadable queue: fall back to the timestamp comparison alone.
  }
  return pending
}

export async function clearOutbox(): Promise<void> {
  if (!supported()) return
  try {
    await withStore('readwrite', store => store.clear())
    notify()
  } catch {
    // Nothing to clear.
  }
}

/**
 * Replays every queued write belonging to the signed-in learner.
 *
 * Serial, not parallel: these are upserts against a small number of rows, and
 * concurrent replays of the same key would race each other.
 */
export async function flushOutbox(): Promise<{ sent: number; failed: number; dropped: number }> {
  const idle = { sent: 0, failed: 0, dropped: 0 }
  if (!supported()) return idle
  if (typeof navigator !== 'undefined' && !navigator.onLine) return idle

  let entries: OutboxEntry[] = []
  try {
    entries = await withStore<OutboxEntry[]>('readonly', store => store.getAll())
  } catch {
    return idle
  }
  if (!entries.length) return idle

  let userId: string | undefined
  try {
    const { data } = await getSupabase().auth.getSession()
    userId = data.session?.user?.id
  } catch {
    return idle
  }
  // Signed out: hold everything. Replaying now would either fail or, if the
  // client later signs in as someone else, write to the wrong account.
  if (!userId) return { sent: 0, failed: entries.length, dropped: 0 }

  emitSyncState('syncing')
  let sent = 0
  let failed = 0
  let dropped = 0

  for (const entry of entries) {
    if (entry.id === undefined) continue

    const decision = classifyEntry(entry, userId)
    // 'skip' keeps another account's write queued but unsent.
    if (decision === 'skip') continue

    if (decision === 'drop') {
      await withStore('readwrite', store => store.delete(entry.id as number))
      dropped += 1
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(OUTBOX_DROPPED_EVENT, { detail: entry }))
      }
      continue
    }

    let rejected = false
    try {
      const { error } = await getSupabase()
        .from(entry.table)
        .upsert(entry.row, { onConflict: entry.onConflict })
      rejected = Boolean(error)
    } catch {
      rejected = true
    }

    if (rejected) {
      failed += 1
      await withStore('readwrite', store => store.put({ ...entry, attempts: entry.attempts + 1 }))
      continue
    }

    await withStore('readwrite', store => store.delete(entry.id as number))
    sent += 1
  }

  if (failed || dropped) {
    emitSyncState('pending', `${failed + dropped} change(s) still pending`)
  } else if (sent) {
    emitSyncState('synced')
  }
  notify()
  return { sent, failed, dropped }
}

/**
 * Drains on reconnect, on window focus and when the tab returns to the
 * foreground. Returns an unsubscribe function.
 */
export function installOutboxDrain(): () => void {
  if (typeof window === 'undefined') return () => {}

  let running = false
  const drain = () => {
    if (running || !navigator.onLine) return
    running = true
    void flushOutbox().finally(() => { running = false })
  }
  const drainOnVisible = () => {
    if (document.visibilityState === 'visible') drain()
  }

  window.addEventListener('online', drain)
  window.addEventListener('focus', drain)
  document.addEventListener('visibilitychange', drainOnVisible)
  drain()

  return () => {
    window.removeEventListener('online', drain)
    window.removeEventListener('focus', drain)
    document.removeEventListener('visibilitychange', drainOnVisible)
  }
}
