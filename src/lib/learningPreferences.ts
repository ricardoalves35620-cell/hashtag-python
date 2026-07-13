import { getSupabase } from './supabase'

export interface LearningPreferences {
  showReflections: boolean
  showDetailedExplanations: boolean
  showHints: boolean
  showExtraChallenges: boolean
  showFlowcharts: boolean
  showPseudocode: boolean
  shareAnonymousReflections: boolean
}

const STORAGE_KEY = 'hp_learning_preferences_v1'

export const DEFAULT_LEARNING_PREFERENCES: LearningPreferences = {
  showReflections: true,
  showDetailedExplanations: true,
  showHints: true,
  showExtraChallenges: true,
  showFlowcharts: true,
  showPseudocode: true,
  shareAnonymousReflections: false,
}

export function loadLearningPreferences(): LearningPreferences {
  if (typeof localStorage === 'undefined') return DEFAULT_LEARNING_PREFERENCES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_LEARNING_PREFERENCES
    return { ...DEFAULT_LEARNING_PREFERENCES, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_LEARNING_PREFERENCES
  }
}

export function saveLearningPreferences(preferences: LearningPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  window.dispatchEvent(new CustomEvent('hp-learning-preferences', { detail: preferences }))
}

export async function syncLearningPreferences(preferences: LearningPreferences) {
  saveLearningPreferences(preferences)
  const { data } = await getSupabase().auth.getUser()
  if (!data.user) return
  await getSupabase().auth.updateUser({ data: { learning_preferences: preferences } })
}

export async function hydrateLearningPreferencesFromUser() {
  const { data } = await getSupabase().auth.getUser()
  const remote = data.user?.user_metadata?.learning_preferences
  if (!remote || typeof remote !== 'object') return loadLearningPreferences()
  const merged = { ...DEFAULT_LEARNING_PREFERENCES, ...remote }
  saveLearningPreferences(merged)
  return merged
}
