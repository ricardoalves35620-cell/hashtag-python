import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('adaptive overnight auditor integrity', () => {
  const spec = readFileSync('tests/audit/app.audit.spec.ts', 'utf8')
  const autopilot = readFileSync('audit/autopilot.ts', 'utf8')
  const plan = readFileSync('audit/audit-plan.ts', 'utf8')
  const runner = readFileSync('run-auditor.ps1', 'utf8')
  const version = readFileSync('audit/auditor-version.txt', 'utf8').trim()

  it('tests the real learning journey with adaptive depth', () => {
    expect(spec).toContain('safeStep')
    expect(spec).toContain('completeLessonJourney')
    expect(spec).toContain("getByTestId('lesson-next')")
    expect(spec).toContain('prepareExerciseThinking')
    expect(spec).toContain("getByTestId('exercise-prediction')")
    expect(spec).toContain('auditDepth')
    expect(spec).toContain('diagnosticVariant')
  })

  it('uses a smart interleaved plan and confirms new errors automatically', () => {
    expect(version).toBe('8.5.0')
    expect(plan).toContain('SMART_SENTINEL_PHASES')
    expect(plan).toContain('interleave')
    expect(plan).toContain("coreLogicalEnvironments = new Set([0, 4, 5])")
    expect(autopilot).toContain('buildAuditPlan')
    expect(autopilot).toContain('queueConfirmation')
    expect(autopilot).toContain("reason: 'confirm-new-issue'")
    expect(autopilot).toContain('HP_AUDIT_STORAGE_STATE')
    expect(autopilot).toContain('state.inFlight')
  })

  it('runs static content analysis once and supports fast Windows night modes', () => {
    expect(autopilot.match(/audit\/content-audit\.ts/g)?.length).toBe(1)
    expect(runner).toContain('[ValidateSet("Smart", "Full", "Smoke")]')
    expect(runner).toContain('default { 3 }')
    expect(runner).toContain('SetThreadExecutionState')
    expect(runner).toContain('hashtag-python-audit-report-slim.zip')
    expect(runner).toContain('create-slim-report.mjs')
    expect(runner).toContain('chromium-*')
    expect(runner).toContain('webkit-*')
  })
})
