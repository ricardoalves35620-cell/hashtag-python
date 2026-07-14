import { getSupabase } from './supabase'

const CLOUD_TABLES = ['user_progress', 'learning_states', 'code_drafts', 'exam_drafts', 'user_fasttrack', 'learning_project_progress', 'learning_journey_progress', 'learning_journal_entries', 'learning_reflections'] as const
const OPTIONAL_CLOUD_TABLES = new Set<string>(['learning_project_progress', 'learning_journey_progress', 'learning_journal_entries', 'learning_reflections'])

const PRESERVED_LOCAL_KEYS = new Set([
  'hp_lang', 'hp_theme', 'hp_editor_height', 'hp_editor_wrap', 'hp_editor_font_size',
  'hp_guest_mode', 'hp_onboarding_done', 'hp_computer_level',
])

function isLearningKey(key: string) {
  if (PRESERVED_LOCAL_KEYS.has(key)) return false
  return key.startsWith('hp_progress_')
    || key.startsWith('hp_exam_')
    || key.startsWith('hp_code_draft_')
    || key.startsWith('hp_learning_')
    || key.startsWith('hp_base_zero_')
    || key.startsWith('hp_lesson_reflection_')
    || key === 'hp_ft_done'
    || key.startsWith('hp_project_lab_')
    || key.startsWith('hp_mini_project_')
    || key.startsWith('hp_engineering_lab_')
    || key.startsWith('hp_ai_lab_')
    || key.startsWith('hp_diagnostic_')
}

export function clearLocalLearningData() {
  if (typeof localStorage === 'undefined') return
  const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(Boolean) as string[]
  keys.filter(isLearningKey).forEach(key => localStorage.removeItem(key))
}

export async function resetLearningProgress(userId: string) {
  const failures: string[] = []

  for (const table of CLOUD_TABLES) {
    const { error } = await getSupabase().from(table).delete().eq('user_id', userId)
    const optionalTableMissing = Boolean(error && OPTIONAL_CLOUD_TABLES.has(table) && /does not exist|schema cache|could not find/i.test(error.message))
    if (error && !optionalTableMissing) failures.push(`${table}: ${error.message}`)
  }

  if (failures.length) {
    throw new Error(`The cloud reset was not completed: ${failures.join(' | ')}`)
  }

  clearLocalLearningData()
}
