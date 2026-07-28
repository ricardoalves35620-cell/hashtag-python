import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushLocalDrafts, loadLocalDraft, saveLocalDraft, scheduleLocalDraft } from './codeDrafts'

/**
 * The editor called saveLocalDraft on every keystroke, and each call is a
 * synchronous JSON.stringify plus localStorage.setItem. On a long file that was the
 * dominant per-character cost and the cause of the IME/emoji stutter.
 *
 * The debounce must not weaken the guarantee it exists to provide: a queued draft
 * has to be readable immediately and must survive the tab going away.
 */

const store = new Map<string, string>()

beforeEach(() => {
  store.clear()
  vi.useFakeTimers()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v) },
    removeItem: (k: string) => { store.delete(k) },
  })
})

afterEach(() => {
  flushLocalDrafts()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const draft = (code: string) => ({ code, inputs: '', updatedAt: '2026-07-28T00:00:00.000Z' })

describe('local draft buffering', () => {
  it('does not touch storage on every keystroke', () => {
    scheduleLocalDraft('learner', 1, 'ex-1', draft('a'))
    scheduleLocalDraft('learner', 1, 'ex-1', draft('ab'))
    scheduleLocalDraft('learner', 1, 'ex-1', draft('abc'))
    expect(store.size, 'writes should be coalesced, not one per character').toBe(0)
  })

  it('reads back a queued draft before it reaches storage', () => {
    // Switching exercises reads the draft straight away. If the buffer were
    // invisible to reads, the learner would see stale code.
    scheduleLocalDraft('learner', 1, 'ex-1', draft('typed but not yet written'))
    expect(loadLocalDraft('learner', 1, 'ex-1')?.code).toBe('typed but not yet written')
  })

  it('writes once the burst settles, keeping only the latest value', () => {
    scheduleLocalDraft('learner', 1, 'ex-1', draft('first'))
    scheduleLocalDraft('learner', 1, 'ex-1', draft('final'))
    vi.advanceTimersByTime(300)
    expect(store.size).toBe(1)
    expect(loadLocalDraft('learner', 1, 'ex-1')?.code).toBe('final')
  })

  it('flushes on demand for a tab that is going away', () => {
    scheduleLocalDraft('learner', 1, 'ex-1', draft('unsaved'))
    flushLocalDrafts()
    expect(store.size).toBe(1)
    expect(JSON.parse(store.get([...store.keys()][0]) as string).code).toBe('unsaved')
  })

  it('keeps drafts for different exercises separate', () => {
    scheduleLocalDraft('learner', 1, 'ex-1', draft('one'))
    scheduleLocalDraft('learner', 2, 'ex-2', draft('two'))
    flushLocalDrafts()
    expect(loadLocalDraft('learner', 1, 'ex-1')?.code).toBe('one')
    expect(loadLocalDraft('learner', 2, 'ex-2')?.code).toBe('two')
  })

  it('lets an immediate save supersede a queued one', () => {
    // The settled-edit path still writes synchronously; a stale buffered value must
    // not overwrite it afterwards.
    scheduleLocalDraft('learner', 1, 'ex-1', draft('stale'))
    saveLocalDraft('learner', 1, 'ex-1', draft('authoritative'))
    vi.advanceTimersByTime(300)
    expect(loadLocalDraft('learner', 1, 'ex-1')?.code).toBe('authoritative')
  })

  it('survives storage refusing the write', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw new Error('QuotaExceededError') },
      removeItem: () => {},
    })
    scheduleLocalDraft('learner', 1, 'ex-1', draft('x'))
    expect(() => flushLocalDrafts()).not.toThrow()
  })
})
