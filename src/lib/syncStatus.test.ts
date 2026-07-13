import { describe, expect, it } from 'vitest'
import { formatLastSync, getStoredLastSync } from './syncStatus'

describe('sync status', () => {
  it('returns no stored sync time outside a browser', () => {
    expect(getStoredLastSync()).toBeNull()
  })

  it('formats a missing timestamp clearly in both languages', () => {
    expect(formatLastSync(null, 'pt')).toBe('Ainda não sincronizado')
    expect(formatLastSync(null, 'en')).toBe('Not synced yet')
  })
})
