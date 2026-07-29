import { describe, expect, it } from 'vitest'
import { formatLastSync, getStoredLastSync, type SyncSnapshot, withConnectivity } from './syncStatus'

describe('sync status', () => {
  it('returns no stored sync time outside a browser', () => {
    expect(getStoredLastSync()).toBeNull()
  })

  it('formats a missing timestamp clearly in both languages', () => {
    expect(formatLastSync(null, 'pt')).toBe('Ainda não sincronizado')
    expect(formatLastSync(null, 'en')).toBe('Not synced yet')
  })
})

/**
 * On a plane, "Aguardando sincronização" and "Offline" are not the same message. The
 * first reads like a transient state that will pass; the second explains everything the
 * learner is seeing. The outbox emits 'pending' when a write cannot leave the device —
 * accurate about the write, wrong about the cause — so offline was never surfaced.
 */
describe('connectivity outranks whatever the last write concluded', () => {
  const snapshot = (state: SyncSnapshot['state']): SyncSnapshot => ({ state, lastSyncedAt: null })
  const setOnline = (value: boolean) => {
    Object.defineProperty(globalThis.navigator, 'onLine', { value, configurable: true })
  }

  it('reports offline as offline, not as waiting to sync', () => {
    setOnline(false)
    expect(withConnectivity(snapshot('pending'), 'pt').state).toBe('offline')
    expect(withConnectivity(snapshot('syncing'), 'en').state).toBe('offline')
    expect(withConnectivity(snapshot('synced'), 'en').state).toBe('offline')
  })

  it('explains itself in the learner language', () => {
    setOnline(false)
    expect(withConnectivity(snapshot('pending'), 'pt').message).toContain('Sem conexão')
    expect(withConnectivity(snapshot('pending'), 'en').message).toContain('Offline')
  })

  it('leaves every state alone when there is a connection', () => {
    setOnline(true)
    for (const state of ['pending', 'syncing', 'synced', 'error'] as const) {
      expect(withConnectivity(snapshot(state), 'en').state).toBe(state)
    }
  })
})
