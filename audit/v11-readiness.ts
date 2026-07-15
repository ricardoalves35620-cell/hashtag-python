import fs from 'node:fs'
import path from 'node:path'
import { ALL_PHASES } from '../src/data/phases/index'
import type { Check, Phase, TestCase } from '../src/data/types'

const MIN_LESSON_BYTES = 14_000

function requiredExerciseCount(phaseId: number) {
  if (phaseId <= 8) return 3
  if (phaseId <= 27) return 4
  if (phaseId <= 39) return 5
  if (phaseId <= 53) return 6
  return 5
}

function allTestCases(phase: Phase): TestCase[] {
  return [
    ...phase.exercises.flatMap(exercise => exercise.grading?.tests || []),
    ...phase.exam.testCases,
  ]
}

function allChecks(phase: Phase): Check[] {
  return allTestCases(phase).flatMap(testCase => testCase.checks)
}

function countCodeRequirements(phase: Phase) {
  return phase.exercises.reduce((total, exercise) => total + (exercise.grading?.codeRequirements?.length || 0), 0)
    + phase.exam.testCases.reduce((total, testCase) => total + (testCase.codeRequirements?.length || 0), 0)
}

function hiddenClassSignals(testCase: TestCase) {
  const values = [
    ...testCase.inputs,
    ...Object.values(testCase.inputMap || {}),
    testCase.setupCode || '',
    testCase.afterCode || '',
  ]
  return {
    empty: values.some(value => value === '' || value === '[]' || value === '{}'),
    negative: values.some(value => /^-\d/.test(value.trim())),
    accented: values.some(value => /[áàâãéêíóôõúç]/i.test(value)),
    large: values.some(value => /\b\d{6,}\b/.test(value)),
  }
}

function phaseReadiness(phase: Phase) {
  const serializedLesson = JSON.stringify(phase.lesson)
  const lessonBytes = Buffer.byteLength(serializedLesson, 'utf8')
  const requiredExercises = requiredExerciseCount(phase.id)
  const tests = allTestCases(phase)
  const hiddenTests = tests.filter(testCase => testCase.hidden)
  const checks = allChecks(phase)
  const containsChecks = checks.filter(check => check.type === 'contains' || check.type === 'contains_any')
  const exactChecks = checks.filter(check => ['equals', 'equals_any', 'numeric_equals', 'matches'].includes(check.type))
  const codeBlocks = phase.lesson.blocks.filter(block => block.type === 'code').length
  const warnings = phase.lesson.blocks.filter(block => block.type === 'warning').length
  const tips = phase.lesson.blocks.filter(block => block.type === 'tip').length
  const hiddenSignals = hiddenTests.map(hiddenClassSignals)
  const hiddenClasses = {
    empty: hiddenSignals.some(signal => signal.empty),
    negative: hiddenSignals.some(signal => signal.negative),
    accented: hiddenSignals.some(signal => signal.accented),
    large: hiddenSignals.some(signal => signal.large),
  }

  const gaps: string[] = []
  if (phase.id >= 9 && lessonBytes < MIN_LESSON_BYTES) gaps.push('lesson-density')
  if (phase.exercises.length < requiredExercises) gaps.push('exercise-volume')
  if (codeBlocks < 3) gaps.push('progressive-code-blocks')
  if (warnings < 1) gaps.push('common-errors-block')
  if (tips < 1) gaps.push('pro-tip-block')
  if (containsChecks.length > 0) gaps.push('contains-grading')
  if (hiddenTests.length === 0) gaps.push('hidden-tests')
  if (!Object.values(hiddenClasses).some(Boolean)) gaps.push('hidden-input-class-diversity')
  if (countCodeRequirements(phase) === 0) gaps.push('code-requirements')

  return {
    phaseId: phase.id,
    stage: phase.stage || 'base',
    title: phase.title,
    lessonBytes,
    targetLessonBytes: phase.id >= 9 ? MIN_LESSON_BYTES : null,
    lessonBlocks: phase.lesson.blocks.length,
    codeBlocks,
    warningBlocks: warnings,
    tipBlocks: tips,
    exercises: phase.exercises.length,
    requiredExercises,
    tests: tests.length,
    hiddenTests: hiddenTests.length,
    hiddenInputClasses: hiddenClasses,
    exactChecks: exactChecks.length,
    containsChecks: containsChecks.length,
    codeRequirements: countCodeRequirements(phase),
    gaps,
    readinessScore: Math.max(0, 100 - gaps.length * 12),
  }
}

const phases = ALL_PHASES.map(phaseReadiness)
const summary = {
  totalPhases: phases.length,
  phasesMeetingDensity: phases.filter(phase => phase.targetLessonBytes === null || phase.lessonBytes >= MIN_LESSON_BYTES).length,
  phasesMeetingExerciseVolume: phases.filter(phase => phase.exercises >= phase.requiredExercises).length,
  phasesWithoutContainsChecks: phases.filter(phase => phase.containsChecks === 0).length,
  phasesWithHiddenTests: phases.filter(phase => phase.hiddenTests > 0).length,
  phasesWithCodeRequirements: phases.filter(phase => phase.codeRequirements > 0).length,
  fullyReady: phases.filter(phase => phase.gaps.length === 0).length,
  totalContainsChecks: phases.reduce((total, phase) => total + phase.containsChecks, 0),
  averageLessonBytes: Math.round(phases.reduce((total, phase) => total + phase.lessonBytes, 0) / phases.length),
  averageReadinessScore: Math.round(phases.reduce((total, phase) => total + phase.readinessScore, 0) / phases.length),
}

const report = {
  generatedAt: new Date().toISOString(),
  standard: 'Hashtag Python v11 readiness diagnostic',
  enforcement: 'diagnostic-only',
  note: 'This report measures the migration gap. It does not block tonight\'s visual audit until legacy phases are rewritten safely.',
  thresholds: {
    minLessonBytes: MIN_LESSON_BYTES,
    exerciseVolume: {
      '0-8': 3,
      '9-27': 4,
      '28-39': 5,
      '40-53': 6,
      '54-68': 5,
    },
  },
  summary,
  phases,
}

const output = path.resolve(process.env.HP_V11_READINESS_OUTPUT || 'playwright-report/v11-readiness.json')
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

console.log(`V11 readiness: ${summary.fullyReady}/${summary.totalPhases} phase(s) fully migrated.`)
console.log(`Density: ${summary.phasesMeetingDensity}/${summary.totalPhases}; exercise volume: ${summary.phasesMeetingExerciseVolume}/${summary.totalPhases}; contains-free: ${summary.phasesWithoutContainsChecks}/${summary.totalPhases}.`)
console.log(`Diagnostic report: ${output}`)
