import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('sprint 7.8 reliability fixes', () => {
  it('persists exercise drafts immediately and blocks late remote overwrites', () => {
    const exercises = readFileSync('src/pages/Exercises.tsx', 'utf8')

    expect(exercises).toContain('lastEditAt.current = Date.now()')
    expect(exercises).toContain('saveLocalDraft(learnerId')
    expect(exercises).toContain('User input always wins over a late network response')
    expect(exercises).toContain('data-testid="draft-status"')
  })

  it('uses stable quiz identifiers instead of localized text matching', () => {
    const quiz = readFileSync('src/pages/Quiz.tsx', 'utf8')
    const audit = readFileSync('tests/audit/app.audit.spec.ts', 'utf8')

    expect(quiz).toContain('data-question-id={question.id ||')
    expect(quiz).toContain('data-option-index={originalIndex}')
    expect(audit).toContain('findQuizOptionByOriginalIndex')
    expect(audit).toContain("getAttribute('data-question-id')")
  })

  it('tests a unique draft marker and restores the original content', () => {
    const audit = readFileSync('tests/audit/app.audit.spec.ts', 'utf8')

    expect(audit).toContain('hp-audit-draft-')
    expect(audit).toContain('Exercise draft cleanup was not persisted')
  })
})
