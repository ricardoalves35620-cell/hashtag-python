import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { V11_FULL_CURRICULUM_MIGRATED_PHASES, V11_GRADING_MIGRATED_PHASES } from './data/v11Migration'
import { allPhaseChecks, allPhaseTestCases, measurePhaseV11, requiredExerciseCount } from './lib/v11Quality'

const migratedIds = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

describe('v11 authored curriculum phases 9-20', () => {
  it('marks only completed phases as fully migrated in this batch', () => {
    expect(V11_FULL_CURRICULUM_MIGRATED_PHASES).toEqual(migratedIds)
    for (const phaseId of migratedIds) expect(V11_GRADING_MIGRATED_PHASES).toContain(phaseId)
  })

  it.each(migratedIds)('phase %i meets the authored lesson and exercise contract', phaseId => {
    const phase = ALL_PHASES.find(item => item.id === phaseId)
    expect(phase).toBeDefined()
    const metrics = measurePhaseV11(phase!)

    expect(metrics.lessonBytes).toBeGreaterThanOrEqual(14_000)
    expect(metrics.exercises).toBeGreaterThanOrEqual(requiredExerciseCount(phaseId))
    expect(phase!.lesson.blocks.filter(block => block.type === 'code').length).toBeGreaterThanOrEqual(3)
    expect(phase!.lesson.blocks.some(block => block.type === 'warning')).toBe(true)
    expect(phase!.lesson.blocks.some(block => block.type === 'tip')).toBe(true)
  })

  it.each(migratedIds)('phase %i has exact grading, hidden cases and AST requirements', phaseId => {
    const phase = ALL_PHASES.find(item => item.id === phaseId)!
    const tests = allPhaseTestCases(phase)
    const checks = allPhaseChecks(phase)

    expect(phase.exercises).toHaveLength(4)
    expect(phase.exercises.every(item => (item.grading?.tests || []).some(test => test.hidden))).toBe(true)
    expect(tests.some(test => test.hidden)).toBe(true)
    expect(checks.some(check => check.type === 'contains' || check.type === 'contains_any')).toBe(false)
    expect(checks.some(check => ['equals', 'equals_any', 'numeric_equals', 'matches'].includes(check.type))).toBe(true)
    expect(tests.filter(test => test.checks.some(check => check.type !== 'no_error')).every(test => (test.codeRequirements || []).length > 0)).toBe(true)
  })

  it.each(migratedIds)('phase %i uses diverse hidden classes', phaseId => {
    const phase = ALL_PHASES.find(item => item.id === phaseId)!
    const hiddenSource = allPhaseTestCases(phase)
      .filter(test => test.hidden)
      .map(test => [test.inputs.join(' '), Object.values(test.inputMap || {}).join(' '), test.setupCode || '', test.afterCode || ''].join('\n'))
      .join('\n')

    const hasDiverseSignal = /\[\]|-\d|[áàâãéêíóôõúç]|\b\d{6,}\b/i.test(hiddenSource)
    expect(hasDiverseSignal).toBe(true)
  })
})
