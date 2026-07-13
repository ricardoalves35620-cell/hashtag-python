import { getSupabase } from './supabase'
import type { Lang } from '../data/types'

export interface ReflectionPayload {
  userId: string
  phaseId: number
  unitId: string
  lang: Lang
  content: string
  skipped?: boolean
}

export async function syncLearningReflection(payload: ReflectionPayload, shareAnonymous: boolean) {
  if (!shareAnonymous || !payload.content.trim()) return
  const { error } = await getSupabase().from('learning_reflections').upsert({
    user_id: payload.userId,
    phase_id: payload.phaseId,
    unit_id: payload.unitId,
    language: payload.lang,
    content: payload.content.trim(),
    skipped: Boolean(payload.skipped),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,phase_id,unit_id' })
  if (error) console.warn('Could not sync anonymous learning reflection', error)
}
