import { describe, it, expect } from 'vitest'
import { planRecovery } from './appUpdate'

/**
 * Instrument note (rule 2): the failing states below were first produced for real in
 * the 2026-07-30 Playwright reproduction — the infinite reload loop and the swallowed
 * error were observed in a browser before this policy was written to prevent them.
 */
describe('stale-build recovery policy', () => {
  it('reloads on the first chunk failure of a build', () => {
    expect(planRecovery({ online: true, currentSha: 'abc123', recoveredSha: null })).toBe('reload')
  })

  it('surfaces the error instead of looping when this build already spent its reload', () => {
    // The reload landed on the SAME build: it fetched nothing new, so a second
    // reload would produce the 2026-07-30 loop (crash screen flashing every ~600ms).
    expect(planRecovery({ online: true, currentSha: 'abc123', recoveredSha: 'abc123' })).toBe('surface')
  })

  it('re-arms by itself when the next deploy changes the build sha', () => {
    // No `load` listener may clear the flag — that listener was the loop. A new build
    // has a new sha, which un-matches the recorded one with no clearing at all.
    expect(planRecovery({ online: true, currentSha: 'def456', recoveredSha: 'abc123' })).toBe('reload')
  })

  it('never reloads offline — the same import would just fail again', () => {
    expect(planRecovery({ online: false, currentSha: 'def456', recoveredSha: null })).toBe('surface')
  })
})
