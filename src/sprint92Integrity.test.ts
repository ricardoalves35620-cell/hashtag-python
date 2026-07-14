import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Sprint 9.2 integrity', () => {
  it('ships RLS delete policies required by account reset', () => {
    const sql = readFileSync(resolve('supabase/reset-learning-progress.sql'), 'utf8')
    for (const table of ['user_progress', 'learning_states', 'code_drafts', 'exam_drafts', 'user_fasttrack', 'learning_project_progress', 'learning_journey_progress', 'learning_journal_entries', 'learning_reflections']) {
      expect(sql).toContain(table)
    }
    expect((sql.match(/for delete/g) || [])).toHaveLength(9)
    expect(sql).toContain('auth.uid() = user_id')
  })

  it('keeps reset behind typed confirmation in Profile', () => {
    const profile = readFileSync(resolve('src/pages/Profile.tsx'), 'utf8')
    expect(profile).toContain("lang === 'pt' ? 'RESETAR' : 'RESET'")
    expect(profile).toContain('resetLearningProgress(user.id)')
  })
})
