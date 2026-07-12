import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './phases'

function expectPair(value: { en: string; pt: string }, label: string) {
  expect(value.en.trim().length, `${label}.en`).toBeGreaterThan(0)
  expect(value.pt.trim().length, `${label}.pt`).toBeGreaterThan(0)
}

describe('curriculum localization completeness', () => {
  it('has both languages for every learner-facing prose field', () => {
    for (const phase of ALL_PHASES) {
      expectPair(phase.title, `phase ${phase.id} title`)
      expectPair(phase.description, `phase ${phase.id} description`)
      expectPair(phase.lesson.title, `phase ${phase.id} lesson title`)
      phase.lesson.blocks.forEach((block, index) => {
        if (block.content) expectPair(block.content, `phase ${phase.id} block ${index}`)
      })
      phase.exercises.forEach(exercise => {
        expectPair(exercise.title, `${phase.id}:${exercise.id} title`)
        expectPair(exercise.description, `${phase.id}:${exercise.id} description`)
        exercise.hints.forEach((hint, index) => expectPair(hint, `${phase.id}:${exercise.id} hint ${index}`))
      })
      phase.quiz.forEach(question => {
        expectPair(question.question, `${phase.id}:${question.id} question`)
        expectPair(question.explanation, `${phase.id}:${question.id} explanation`)
        question.options.forEach((option, index) => expectPair(option, `${phase.id}:${question.id} option ${index}`))
      })
      expectPair(phase.exam.title, `phase ${phase.id} exam title`)
      expectPair(phase.exam.scenario, `phase ${phase.id} exam scenario`)
    }
  })
})
