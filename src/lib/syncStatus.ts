export type SyncState = 'offline' | 'syncing' | 'synced' | 'pending' | 'error'

export interface SyncSnapshot {
  state: SyncState
  lastSyncedAt: number | null
  message?: string
}

export const SYNC_EVENT = 'hp-sync-status'
const LAST_SYNC_KEY = 'hp_last_sync_at'

export function getStoredLastSync(): number | null {
  if (typeof localStorage === 'undefined') return null
  const value = Number(localStorage.getItem(LAST_SYNC_KEY))
  return Number.isFinite(value) && value > 0 ? value : null
}

export function emitSyncState(state: SyncState, message?: string) {
  if (typeof window === 'undefined') return
  let lastSyncedAt = getStoredLastSync()
  if (state === 'synced') {
    lastSyncedAt = Date.now()
    localStorage.setItem(LAST_SYNC_KEY, String(lastSyncedAt))
  }
  window.dispatchEvent(new CustomEvent<SyncSnapshot>(SYNC_EVENT, {
    detail: { state, lastSyncedAt, message },
  }))
}

export function initialSyncState(): SyncSnapshot {
  const online = typeof navigator === 'undefined' ? true : navigator.onLine
  return {
    state: online ? 'synced' : 'offline',
    lastSyncedAt: getStoredLastSync(),
  }
}

export function formatLastSync(timestamp: number | null, lang: 'en' | 'pt') {
  if (!timestamp) return lang === 'pt' ? 'Ainda não sincronizado' : 'Not synced yet'
  return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-CA', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}
