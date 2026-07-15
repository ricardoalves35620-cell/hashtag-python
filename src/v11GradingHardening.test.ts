import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { V11_GRADING_MIGRATED_PHASES } from './data/v11Migration'
import { checkText } from './lib/pyodide'
import { evaluateMigratedGrading, evaluateV11Regression, measurePhaseV11 } from './lib/v11Quality'

describe('Hashtag Python v11 grading hardening', () => {
  it('supports complete exact comparison with multiple accepted representations', () => {
    expect(checkText('450.0', { type: 'equals_any', value: ['450', '450.0'] })).toBe(true)
    expect(checkText('Result: 450.0', { type: 'equals_any', value: ['450', '450.0'] })).toBe(false)
  })

  it('keeps every grading-migrated phase free from partial contains checks', () => {
    const phases = ALL_PHASES.filter(phase => V11_GRADING_MIGRATED_PHASES.includes(phase.id))
    expect(phases).toHaveLength(41)
    for (const phase of phases) expect(evaluateMigratedGrading(phase)).toEqual([])
  })

  it('blocks measurable regressions against the committed per-phase baseline', () => {
    const current = measurePhaseV11(ALL_PHASES[28])
    const regressed = { ...current, hiddenTests: Math.max(0, current.hiddenTests - 1), containsChecks: current.containsChecks + 1 }
    const issues = evaluateV11Regression(regressed, current)
    expect(issues.map(issue => issue.rule)).toEqual(expect.arrayContaining([
      'hidden-test-regression',
      'contains-check-regression',
    ]))
  })

  it('collects AST evidence needed to reject copied literal answers', () => {
    const worker = readFileSync(new URL('../public/python.worker.js', import.meta.url), 'utf8')
    expect(worker).toContain("'literalPrintValues'")
    expect(worker).toContain("'functionDetails'")
    expect(worker).toContain("'returnLiterals'")
    expect(worker).toContain("'loadedNames'")
  })

  it('protects the v11 gate inside the main quality command', () => {
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { scripts: Record<string, string> }
    expect(packageJson.scripts['quality:gate']).toContain('audit:v11:gate')
    expect(packageJson.scripts['audit:v11:baseline']).toContain('--write-baseline')
  })
})
