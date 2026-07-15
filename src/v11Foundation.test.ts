import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildAuditPlan } from '../audit/audit-plan'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('Hashtag Python v11 protected foundation', () => {
  it('keeps the intelligent overnight plan materially smaller than the exhaustive matrix', () => {
    const smart = buildAuditPlan('smart', 3, 0)
    const full = buildAuditPlan('full', 1, 0)
    expect(smart).toHaveLength(114)
    expect(smart.reduce((total, entry) => total + entry.phaseIds.length, 0)).toBe(324)
    expect(full).toHaveLength(828)
  })

  it('ships a one-command Windows overnight runner with safe continuation', () => {
    const runner = read('../run-auditor-night.ps1')
    expect(runner).toContain('-Mode", "Smart"')
    expect(runner).toContain('-NoOpen')
    expect(runner).toContain('if ($Continue)')
    expect(runner).toContain('-Fresh')
  })

  it('records the v11 security and curriculum corrections instead of blindly copying unsafe requirements', () => {
    const plan = read('../docs/HASHTAG_PYTHON_V11_EXECUTION_PLAN.md')
    expect(plan).toContain('Não haverá concentração obrigatória em seguros e construção')
    expect(plan).toContain('não receberá um segredo HMAC reutilizável exposto ao aluno')
    expect(plan).toContain('Nenhum mundo será marcado como concluído por quantidade de texto')
  })


  it('adds the v11 migration gap to the overnight report without blocking legacy visual coverage', () => {
    const readiness = read('../audit/v11-readiness.ts')
    const autopilot = read('../audit/autopilot.ts')
    const slim = read('../scripts/audit/create-slim-report.mjs')
    expect(readiness).toContain("enforcement: 'diagnostic-only'")
    expect(readiness).toContain('MIN_LESSON_BYTES = 14_000')
    expect(autopilot).toContain("audit/v11-readiness.ts")
    expect(slim).toContain("'v11-readiness.json'")
  })
})
