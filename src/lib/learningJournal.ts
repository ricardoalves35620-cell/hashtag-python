import { getSupabase } from './supabase'

export interface JournalPreferences {
  showJournal: boolean
  showDetailedExplanations: boolean
  showFlowcharts: boolean
  showPseudocode: boolean
  showExtraChallenges: boolean
}

const DEFAULTS: JournalPreferences = {
  showJournal: true,
  showDetailedExplanations: true,
  showFlowcharts: true,
  showPseudocode: true,
  showExtraChallenges: true,
}

const PREF_KEY = 'hp_learning_preferences_v1'
const PROGRESS_PREFIX = 'hp_journey_progress_v1_'

export function loadJournalPreferences(): JournalPreferences {
  try {
    const raw = localStorage.getItem(PREF_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch { return DEFAULTS }
}

export function saveJournalPreferences(value: JournalPreferences) {
  localStorage.setItem(PREF_KEY, JSON.stringify(value))
}

export function loadJourneyProgress(learnerId: string, phaseId: number): string[] {
  try { return JSON.parse(localStorage.getItem(`${PROGRESS_PREFIX}${learnerId}_${phaseId}`) || '[]') }
  catch { return [] }
}

export function markJourneyUnitVisited(learnerId: string, phaseId: number, unitId: string): string[] {
  const current = loadJourneyProgress(learnerId, phaseId)
  const next = current.includes(unitId) ? current : [...current, unitId]
  localStorage.setItem(`${PROGRESS_PREFIX}${learnerId}_${phaseId}`, JSON.stringify(next))
  return next
}

export async function saveJournalEntry(input: {
  userId: string
  phaseId: number
  unitId: string
  prompt: string
  response: string
  language: 'en' | 'pt'
}) {
  const trimmed = input.response.trim()
  if (!trimmed || input.userId === 'guest') return
  const { error } = await getSupabase().from('learning_journal_entries').upsert({
    user_id: input.userId,
    phase_id: input.phaseId,
    unit_id: input.unitId,
    prompt: input.prompt,
    response: trimmed,
    language: input.language,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,phase_id,unit_id' })
  if (error) console.warn('Could not sync optional learning journal entry', error)
}
