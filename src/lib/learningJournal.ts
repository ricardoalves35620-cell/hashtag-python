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

function journeyKey(learnerId: string, phaseId: number) {
  return `${PROGRESS_PREFIX}${learnerId}_${phaseId}`
}

export function loadJourneyProgress(learnerId: string, phaseId: number): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(journeyKey(learnerId, phaseId)) || '[]')
    return Array.isArray(parsed) ? parsed.filter(value => typeof value === 'string') : []
  } catch { return [] }
}

function saveJourneyProgressLocal(learnerId: string, phaseId: number, units: string[]) {
  const unique = [...new Set(units)]
  localStorage.setItem(journeyKey(learnerId, phaseId), JSON.stringify(unique))
  window.dispatchEvent(new CustomEvent('hp:journey-progress', { detail: { learnerId, phaseId, units: unique } }))
  return unique
}

export async function hydrateJourneyProgress(userId: string, phaseId: number): Promise<string[]> {
  const local = loadJourneyProgress(userId, phaseId)
  if (userId === 'guest') return local
  try {
    const { data, error } = await getSupabase()
      .from('learning_journey_progress')
      .select('visited_units')
      .eq('user_id', userId)
      .eq('phase_id', phaseId)
      .maybeSingle()
    if (error) throw error
    const remote = Array.isArray(data?.visited_units) ? data.visited_units.filter((value: unknown) => typeof value === 'string') : []
    const merged = saveJourneyProgressLocal(userId, phaseId, [...local, ...remote])
    if (merged.length !== remote.length || merged.some(unit => !remote.includes(unit))) {
      await getSupabase().from('learning_journey_progress').upsert({
        user_id: userId,
        phase_id: phaseId,
        visited_units: merged,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,phase_id' })
    }
    return merged
  } catch {
    return local
  }
}

const journeyTimers = new Map<string, ReturnType<typeof setTimeout>>()

function scheduleJourneySync(userId: string, phaseId: number, units: string[]) {
  if (userId === 'guest') return
  const timerKey = `${userId}:${phaseId}`
  const current = journeyTimers.get(timerKey)
  if (current) clearTimeout(current)
  journeyTimers.set(timerKey, setTimeout(async () => {
    journeyTimers.delete(timerKey)
    try {
      const { data } = await getSupabase()
        .from('learning_journey_progress')
        .select('visited_units')
        .eq('user_id', userId)
        .eq('phase_id', phaseId)
        .maybeSingle()
      const remote = Array.isArray(data?.visited_units) ? data.visited_units : []
      const merged = saveJourneyProgressLocal(userId, phaseId, [...units, ...remote])
      await getSupabase().from('learning_journey_progress').upsert({
        user_id: userId,
        phase_id: phaseId,
        visited_units: merged,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,phase_id' })
    } catch {
      // Local state remains the source until the next focus/online retry.
    }
  }, 500))
}

export function markJourneyUnitVisited(learnerId: string, phaseId: number, unitId: string): string[] {
  const current = loadJourneyProgress(learnerId, phaseId)
  const next = saveJourneyProgressLocal(learnerId, phaseId, [...current, unitId])
  scheduleJourneySync(learnerId, phaseId, next)
  return next
}

export async function fetchJournalEntry(userId: string, phaseId: number, unitId: string): Promise<string> {
  if (userId === 'guest') return ''
  try {
    const { data, error } = await getSupabase()
      .from('learning_journal_entries')
      .select('response')
      .eq('user_id', userId)
      .eq('phase_id', phaseId)
      .eq('unit_id', unitId)
      .maybeSingle()
    if (error) throw error
    return typeof data?.response === 'string' ? data.response : ''
  } catch {
    return ''
  }
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
