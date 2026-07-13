import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearLocalLearningData } from './resetLearningProgress'

function makeStorage() {
  const data = new Map<string, string>()
  return {
    get length() { return data.size },
    clear: vi.fn(() => data.clear()),
    getItem: vi.fn((key: string) => data.get(key) ?? null),
    key: vi.fn((index: number) => [...data.keys()][index] ?? null),
    removeItem: vi.fn((key: string) => data.delete(key)),
    setItem: vi.fn((key: string, value: string) => data.set(key, String(value))),
  }
}

describe('clearLocalLearningData', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', makeStorage())
  })

  it('removes learning records but preserves profile preferences', () => {
    localStorage.setItem('hp_lang', 'pt')
    localStorage.setItem('hp_theme', 'dark')
    localStorage.setItem('hp_editor_font_size', '18')
    localStorage.setItem('hp_progress_v1_user', '[]')
    localStorage.setItem('hp_lesson_reflection_v1_user_1_logic', 'answer')
    localStorage.setItem('hp_exam_user_1', '{}')
    localStorage.setItem('hp_code_draft_v1_user_1_x', '{}')
    localStorage.setItem('hp_ft_done', '[1]')
    localStorage.setItem('hp_ai_lab_v4_checklist', '[1]')

    clearLocalLearningData()

    expect(localStorage.getItem('hp_lang')).toBe('pt')
    expect(localStorage.getItem('hp_theme')).toBe('dark')
    expect(localStorage.getItem('hp_editor_font_size')).toBe('18')
    expect(localStorage.getItem('hp_progress_v1_user')).toBeNull()
    expect(localStorage.getItem('hp_lesson_reflection_v1_user_1_logic')).toBeNull()
    expect(localStorage.getItem('hp_exam_user_1')).toBeNull()
    expect(localStorage.getItem('hp_code_draft_v1_user_1_x')).toBeNull()
    expect(localStorage.getItem('hp_ft_done')).toBeNull()
    expect(localStorage.getItem('hp_ai_lab_v4_checklist')).toBeNull()
  })
})
