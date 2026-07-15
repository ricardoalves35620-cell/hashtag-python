import fs from 'node:fs'
import path from 'node:path'
import { ALL_PHASES } from '../src/data/phases/index'
import { V11_GRADING_MIGRATED_PHASES } from '../src/data/v11Migration'
import {
  evaluateMigratedGrading,
  evaluateV11Regression,
  measurePhaseV11,
  type V11Baseline,
  type V11GateIssue,
} from '../src/lib/v11Quality'

const baselinePath = path.resolve('audit/v11-quality-baseline.json')
const outputPath = path.resolve(process.env.HP_V11_GATE_OUTPUT || 'playwright-report/v11-quality-gate.json')
const writeBaseline = process.argv.includes('--write-baseline')
const metrics = ALL_PHASES.map(measurePhaseV11)

if (writeBaseline) {
  const baseline: V11Baseline = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    phases: metrics,
  }
  fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8')
  console.log(`V11 quality baseline written: ${baselinePath}`)
  process.exit(0)
}

if (!fs.existsSync(baselinePath)) {
  console.error(`Missing V11 quality baseline: ${baselinePath}`)
  process.exit(1)
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as V11Baseline
const baselineByPhase = new Map(baseline.phases.map(item => [item.phaseId, item]))
const issues: V11GateIssue[] = []

for (const phase of ALL_PHASES) {
  const current = metrics.find(item => item.phaseId === phase.id)!
  const previous = baselineByPhase.get(phase.id)
  if (!previous) {
    issues.push({ phaseId: phase.id, rule: 'missing-baseline', message: 'Phase is missing from the committed quality baseline.' })
  } else {
    issues.push(...evaluateV11Regression(current, previous))
  }

  if (V11_GRADING_MIGRATED_PHASES.includes(phase.id)) {
    issues.push(...evaluateMigratedGrading(phase))
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  baselineGeneratedAt: baseline.generatedAt,
  migratedGradingPhases: V11_GRADING_MIGRATED_PHASES,
  passed: issues.length === 0,
  issues,
  metrics,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`V11 quality gate: ${report.passed ? 'PASS' : 'BLOCKED'} (${issues.length} issue(s)).`)
console.log(`Report: ${outputPath}`)
for (const issue of issues.slice(0, 20)) console.log(`Phase ${issue.phaseId} ${issue.rule}: ${issue.message}`)
if (!report.passed) process.exitCode = 1
