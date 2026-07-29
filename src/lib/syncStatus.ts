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

/**
 * A device with no connection is offline, whatever the last write attempt concluded.
 *
 * The outbox emits 'pending' when a write cannot leave the device, which is accurate
 * about the write and wrong about the cause. Offline, the chip read "Aguardando
 * sincronização" — a normal-looking transient state — so nothing ever told the learner
 * their connection was gone. On a plane that is the single fact they need.
 *
 * Applied where the snapshot is READ rather than where it is set, so no future call
 * site can route around it.
 */
export function withConnectivity(snapshot: SyncSnapshot, lang: 'en' | 'pt'): SyncSnapshot {
  const online = typeof navigator === 'undefined' ? true : navigator.onLine
  if (online || snapshot.state === 'offline') return snapshot
  return {
    ...snapshot,
    state: 'offline',
    message: lang === 'pt'
      ? 'Sem conexão. Alterações salvas neste aparelho.'
      : 'Offline. Changes are saved on this device.',
  }
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
