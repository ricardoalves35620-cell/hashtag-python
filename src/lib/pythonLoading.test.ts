import { afterEach, describe, expect, it, vi } from 'vitest'
import { canWarmPythonAutomatically, getPythonLoadProgress, isPythonReady, subscribePythonLoadProgress } from './pyodide'

/**
 * The Python runtime is roughly 12 MB, fetched the first time anyone runs code.
 *
 * Two obligations pull against each other: a learner should not sit through a
 * silent multi-minute wait after pressing Run, and nobody's mobile data should be
 * spent 12 MB at a time without being asked. Warming ahead of time solves the
 * first; these guards keep it from violating the second.
 */

afterEach(() => { vi.unstubAllGlobals() })

const withConnection = (connection: unknown) => {
  vi.stubGlobal('navigator', connection === undefined ? {} : { connection })
}

describe('when it is polite to pre-download the runtime', () => {
  it('warms on an ordinary connection', () => {
    withConnection({ saveData: false, effectiveType: '4g' })
    expect(canWarmPythonAutomatically()).toBe(true)
  })

  it('never warms when the learner asked to save data', () => {
    // Data Saver is an explicit request. Spending 12 MB against it is not ours to do.
    withConnection({ saveData: true, effectiveType: '4g' })
    expect(canWarmPythonAutomatically()).toBe(false)
  })

  it('never warms on 2G', () => {
    withConnection({ saveData: false, effectiveType: '2g' })
    expect(canWarmPythonAutomatically()).toBe(false)
    withConnection({ saveData: false, effectiveType: 'slow-2g' })
    expect(canWarmPythonAutomatically()).toBe(false)
  })

  it('warms when the browser reports nothing, rather than never warming', () => {
    // Safari does not implement navigator.connection. Treating "unknown" as
    // "do not preload" would disable this for every iPhone learner.
    withConnection(undefined)
    expect(canWarmPythonAutomatically()).toBe(true)
  })

  it('does not warm where there is no navigator at all', () => {
    vi.stubGlobal('navigator', undefined)
    expect(canWarmPythonAutomatically()).toBe(false)
  })
})

describe('load progress reporting', () => {
  it('starts idle so no progress UI is shown before anything happens', () => {
    expect(getPythonLoadProgress().stage).toBe('idle')
    expect(isPythonReady()).toBe(false)
  })

  it('hands out a working unsubscribe', () => {
    const seen: unknown[] = []
    const stop = subscribePythonLoadProgress(p => seen.push(p))
    expect(typeof stop).toBe('function')
    stop()
    // Unsubscribing must not throw or leave a dangling listener; the progress panel
    // mounts and unmounts on every exercise change.
    expect(() => stop()).not.toThrow()
  })
})
