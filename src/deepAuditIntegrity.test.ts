import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('deep overnight auditor integrity', () => {
  const spec = readFileSync('tests/audit/app.audit.spec.ts', 'utf8')
  const autopilot = readFileSync('audit/autopilot.ts', 'utf8')
  const runner = readFileSync('run-auditor.ps1', 'utf8')

  it('continues the phase journey after individual step failures', () => {
    expect(spec).toContain('safeStep')
    expect(spec).toContain('exercise editor, errors, draft and layout')
    expect(spec).toContain('shuffled quiz with correct answers')
    expect(spec).toContain('exam execution and pedagogical feedback')
    expect(spec).toContain('runExerciseAndWait')
    expect(spec).toContain('findExactQuizOption')
  })

  it('keeps per-cycle status and estimates remaining runtime', () => {
    expect(autopilot).toContain('HP_AUDIT_CYCLE')
    expect(autopilot).toContain('HP_AUDIT_LIVE_STATUS')
    expect(autopilot).toContain('estimated ${etaMinutes} min remaining')
  })

  it('defaults to a multi-pass overnight run and keeps Windows awake', () => {
    expect(runner).toContain('DefaultValue 414')
    expect(runner).toContain('SetThreadExecutionState')
    expect(runner).toContain('hashtag-python-audit-report.zip')
  })
})
