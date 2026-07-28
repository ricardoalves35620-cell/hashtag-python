import { describe, expect, it } from 'vitest'
import { classifyEntry, flushOutbox, pendingCount, pendingRowValues } from './outbox'

const entry = (userId: string, attempts = 0) => ({ userId, attempts })

describe('outbox replay safety', () => {
  it('replays a queued write for the learner who made it', () => {
    expect(classifyEntry(entry('learner-a'), 'learner-a')).toBe('replay')
  })

  it('never replays one account\'s write onto another account', () => {
    // The reason this queue stores intent rather than raw HTTP requests: a
    // BackgroundSync replay would carry the original Authorization header and could
    // write the previous learner's work into whoever signed in next.
    expect(classifyEntry(entry('learner-a'), 'learner-b')).toBe('skip')
  })

  it('holds everything while signed out instead of guessing an owner', () => {
    expect(classifyEntry(entry('learner-a'), null)).toBe('skip')
    expect(classifyEntry(entry('learner-a'), undefined)).toBe('skip')
    expect(classifyEntry(entry('learner-a'), '')).toBe('skip')
  })

  it('keeps retrying across a long outage before giving up', () => {
    for (let attempts = 0; attempts < 8; attempts += 1) {
      expect(classifyEntry(entry('learner-a', attempts), 'learner-a')).toBe('replay')
    }
  })

  it('drops a permanently rejected row rather than retrying it forever', () => {
    // An RLS violation or a deleted phase can never succeed; without this the queue
    // would be poisoned and every later write would sit behind it.
    expect(classifyEntry(entry('learner-a', 8), 'learner-a')).toBe('drop')
    expect(classifyEntry(entry('learner-a', 99), 'learner-a')).toBe('drop')
  })
})

describe('outbox without IndexedDB', () => {
  it('degrades quietly when storage is unavailable', async () => {
    // Private browsing, a blocked origin, or this Node test environment. Callers use
    // the outbox from inside catch blocks, so it must never throw.
    await expect(pendingCount()).resolves.toBe(0)
    await expect(flushOutbox()).resolves.toEqual({ sent: 0, failed: 0, dropped: 0 })
  })

  it('reports no queued keys rather than blocking hydration', async () => {
    // hydrateState skips any key this returns. Returning a spurious key would
    // freeze a device on stale data, so the failure mode must be "empty set".
    await expect(pendingRowValues('learner_state', 'key', 'learner-a')).resolves.toEqual(new Set())
    await expect(pendingRowValues('learner_state', 'key', null)).resolves.toEqual(new Set())
  })
})
