import { getSupabase } from './supabase'

const LS_PREFIX = 'hp_exam_draft_'

function lsKey(userId: string, phaseId: number) {
  return `${LS_PREFIX}${userId}_${phaseId}`
}

// ── Load draft: try Supabase first (cross-device), fall back to localStorage ──
export async function loadExamDraft(userId: string, phaseId: number, fallback: string): Promise<string> {
  const local = localStorage.getItem(lsKey(userId, phaseId))

  try {
    const { data, error } = await getSupabase()
      .from('exam_drafts')
      .select('code, updated_at')
      .eq('user_id', userId)
      .eq('phase_id', phaseId)
      .maybeSingle()

    if (!error && data?.code) {
      // Cache it locally too
      localStorage.setItem(lsKey(userId, phaseId), data.code)
      return data.code
    }
  } catch {
    // Supabase unavailable — use local cache
  }

  return local || fallback
}

// ── Save draft: always update localStorage instantly, sync to Supabase in background ──
let saveTimeout: ReturnType<typeof setTimeout> | null = null

export function saveExamDraft(userId: string, phaseId: number, code: string) {
  // Instant local save
  localStorage.setItem(lsKey(userId, phaseId), code)

  // Debounced remote save (avoid hammering Supabase on every keystroke)
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    try {
      await getSupabase()
        .from('exam_drafts')
        .upsert(
          { user_id: userId, phase_id: phaseId, code, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,phase_id' }
        )
    } catch (e) {
      console.error('Draft sync failed (saved locally):', e)
    }
  }, 1500) // wait 1.5s after last keystroke
}

// ── Clear draft after successful submission ──
export async function clearExamDraft(userId: string, phaseId: number) {
  localStorage.removeItem(lsKey(userId, phaseId))
  try {
    await getSupabase().from('exam_drafts').delete().eq('user_id', userId).eq('phase_id', phaseId)
  } catch { /* non-critical */ }
}
