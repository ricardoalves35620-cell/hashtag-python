import { describe, expect, it } from 'vitest'
import { shouldTakeRemoteValue } from './syncedStore'

/**
 * hydrateState() runs at module import and on every onAuthStateChange — including
 * the roughly hourly token refresh. It used to overwrite the local cache
 * unconditionally ("cloud values win"), so a learner who worked offline could have
 * that work destroyed by an older server row the moment they reconnected.
 */
describe('hydrate conflict resolution', () => {
  const OLDER = 1_000
  const NEWER = 2_000

  it('protects work written on this device after the server copy', () => {
    expect(shouldTakeRemoteValue(NEWER, OLDER)).toBe(false)
  })

  it('accepts a server copy that is newer than anything local', () => {
    expect(shouldTakeRemoteValue(OLDER, NEWER)).toBe(true)
  })

  it('takes the server copy on a device that has never written', () => {
    // A fresh install, or a learner signing in on a second device, must hydrate.
    expect(shouldTakeRemoteValue(0, NEWER)).toBe(true)
    expect(shouldTakeRemoteValue(0, 0)).toBe(true)
  })

  it('prefers the server on an exact tie so two devices converge', () => {
    expect(shouldTakeRemoteValue(NEWER, NEWER)).toBe(true)
  })

  it('still hydrates when the server row carries no usable timestamp', () => {
    // Date.parse failures arrive here as 0. Pre-upgrade rows have no stamp locally
    // either, so the server remains the best available answer.
    expect(shouldTakeRemoteValue(0, 0)).toBe(true)
    expect(shouldTakeRemoteValue(NEWER, 0)).toBe(false)
  })
})
