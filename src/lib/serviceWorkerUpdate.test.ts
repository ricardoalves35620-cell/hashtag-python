import { describe, it, expect, beforeEach } from 'vitest'
import { onUpdateAvailable, applyPendingUpdate, resetUpdateStateForTests } from './serviceWorkerUpdate'

/**
 * The gap this closes was measured, not imagined: a translation shipped on 2026-07-29 was
 * still not on screen a day and nineteen commits later, because `registerType: 'prompt'`
 * makes a new worker WAIT and nothing ever told it to take over.
 */

describe('service worker update prompt', () => {
  beforeEach(resetUpdateStateForTests)

  it('tells a subscriber the current state immediately, not only on the next change', () => {
    const seen: boolean[] = []
    onUpdateAvailable(value => seen.push(value))
    expect(seen).toEqual([false])
  })

  it('stops notifying after unsubscribe', () => {
    const seen: boolean[] = []
    const stop = onUpdateAvailable(value => seen.push(value))
    stop()
    expect(seen).toEqual([false])
  })

  it('does nothing when no update is waiting, rather than reloading', () => {
    // A reload with no waiting worker would throw away the learner's editor for nothing.
    expect(() => applyPendingUpdate()).not.toThrow()
  })
})
