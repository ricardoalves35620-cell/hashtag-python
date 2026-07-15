import type { Check, Phase, TestCase } from '../data/types'

export interface V11PhaseMetrics {
  phaseId: number
  lessonBytes: number
  exercises: number
  gradedExercises: number
  tests: number
  hiddenTests: number
  exactChecks: number
  containsChecks: number
  unjustifiedContainsChecks: number
  codeRequirements: number
}

export interface V11Baseline {
  schemaVersion: 1
  generatedAt: string
  phases: V11PhaseMetrics[]
}

export interface V11GateIssue {
  phaseId: number
  rule: string
  message: string
}

export function requiredExerciseCount(phaseId: number) {
  if (phaseId <= 8) return 3
  if (phaseId <= 27) return 4
  if (phaseId <= 39) return 5
  if (phaseId <= 53) return 6
  return 5
}

export function allPhaseTestCases(phase: Phase): TestCase[] {
  return [
    ...phase.exercises.flatMap(exercise => exercise.grading?.tests || []),
    ...phase.exam.testCases,
  ]
}

export function allPhaseChecks(phase: Phase): Check[] {
  return allPhaseTestCases(phase).flatMap(testCase => testCase.checks)
}

export function measurePhaseV11(phase: Phase): V11PhaseMetrics {
  const tests = allPhaseTestCases(phase)
  const checks = tests.flatMap(testCase => testCase.checks)
  const contains = checks.filter(check => check.type === 'contains' || check.type === 'contains_any')
  const codeRequirements = phase.exercises.reduce(
    (total, exercise) => total + (exercise.grading?.codeRequirements?.length || 0)
      + (exercise.grading?.tests || []).reduce((sum, test) => sum + (test.codeRequirements?.length || 0), 0),
    0,
  ) + phase.exam.testCases.reduce((total, test) => total + (test.codeRequirements?.length || 0), 0)

  return {
    phaseId: phase.id,
    lessonBytes: new TextEncoder().encode(JSON.stringify(phase.lesson)).length,
    exercises: phase.exercises.length,
    gradedExercises: phase.exercises.filter(exercise => exercise.grading?.tests?.length).length,
    tests: tests.length,
    hiddenTests: tests.filter(test => test.hidden).length,
    exactChecks: checks.filter(check => ['equals', 'equals_any', 'numeric_equals'].includes(check.type)).length,
    containsChecks: contains.length,
    unjustifiedContainsChecks: contains.filter(check => !check.justification?.en?.trim() || !check.justification?.pt?.trim()).length,
    codeRequirements,
  }
}

export function evaluateV11Regression(current: V11PhaseMetrics, baseline: V11PhaseMetrics): V11GateIssue[] {
  const issues: V11GateIssue[] = []
  const minimumRules: Array<[keyof V11PhaseMetrics, string]> = [
    ['lessonBytes', 'lesson-density-regression'],
    ['exercises', 'exercise-volume-regression'],
    ['gradedExercises', 'graded-exercise-regression'],
    ['tests', 'test-volume-regression'],
    ['hiddenTests', 'hidden-test-regression'],
    ['exactChecks', 'exact-check-regression'],
    ['codeRequirements', 'code-requirement-regression'],
  ]

  for (const [key, rule] of minimumRules) {
    if (current[key] < baseline[key]) {
      issues.push({
        phaseId: current.phaseId,
        rule,
        message: `${String(key)} decreased from ${baseline[key]} to ${current[key]}.`,
      })
    }
  }

  if (current.containsChecks > baseline.containsChecks) {
    issues.push({
      phaseId: current.phaseId,
      rule: 'contains-check-regression',
      message: `Partial contains checks increased from ${baseline.containsChecks} to ${current.containsChecks}.`,
    })
  }

  if (current.unjustifiedContainsChecks > baseline.unjustifiedContainsChecks) {
    issues.push({
      phaseId: current.phaseId,
      rule: 'unjustified-contains-regression',
      message: `Unjustified contains checks increased from ${baseline.unjustifiedContainsChecks} to ${current.unjustifiedContainsChecks}.`,
    })
  }

  return issues
}

export function evaluateMigratedGrading(phase: Phase): V11GateIssue[] {
  const issues: V11GateIssue[] = []
  const tests = allPhaseTestCases(phase)
  const checks = tests.flatMap(test => test.checks)
  const partial = checks.filter(check => check.type === 'contains' || check.type === 'contains_any')

  if (partial.length) {
    issues.push({
      phaseId: phase.id,
      rule: 'migrated-phase-contains-check',
      message: `Migrated grading still has ${partial.length} partial contains check(s).`,
    })
  }

  if (!tests.some(test => test.hidden)) {
    issues.push({
      phaseId: phase.id,
      rule: 'migrated-phase-hidden-test',
      message: 'Migrated grading has no hidden generalization test.',
    })
  }

  for (const test of tests) {
    const behavioralChecks = test.checks.filter(check => check.type !== 'no_error')
    if (behavioralChecks.length && !behavioralChecks.some(check => ['equals', 'equals_any', 'numeric_equals', 'matches'].includes(check.type))) {
      issues.push({
        phaseId: phase.id,
        rule: 'migrated-phase-exact-contract',
        message: `Test ${test.id} has no exact, numeric, or explicit-pattern output contract.`,
      })
    }
    if (behavioralChecks.length && !(test.codeRequirements?.length)) {
      issues.push({
        phaseId: phase.id,
        rule: 'migrated-phase-code-requirement',
        message: `Test ${test.id} checks output without an AST code requirement.`,
      })
    }
  }

  return issues
}
