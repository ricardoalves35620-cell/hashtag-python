import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('auditor provenance integrity', () => {
  it('uses cycle-specific Playwright report paths', () => {
    const config = readFileSync('playwright.config.ts', 'utf8')
    const autopilot = readFileSync('audit/autopilot.ts', 'utf8')

    expect(config).toContain('HP_AUDIT_RESULTS_OUTPUT')
    expect(config).toContain('HP_AUDIT_HTML_OUTPUT')
    expect(config).toContain('HP_AUDIT_ARTIFACTS_OUTPUT')
    expect(autopilot).toContain("'cycles'")
  })

  it('never accepts a Playwright result without a freshness check', () => {
    const autopilot = readFileSync('audit/autopilot.ts', 'utf8')

    expect(autopilot).toContain('fileIsFresh')
    expect(autopilot).toContain('visualResultsFresh')
    expect(autopilot).toContain('Playwright result file was stale')
  })

  it('launches Playwright through the local Node CLI instead of npx', () => {
    const autopilot = readFileSync('audit/autopilot.ts', 'utf8')

    expect(autopilot).toContain("node_modules/@playwright/test/cli.js")
    expect(autopilot).not.toContain("'npx.cmd'")
  })
})
