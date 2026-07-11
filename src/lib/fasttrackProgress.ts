import { getSupabase } from './supabase'

const LS_KEY = 'hp_ft_done'

// ── Load completed days ──
// Fetches from Supabase, merges with localStorage cache
export async function loadFTProgress(userId: string): Promise<number[]> {
  try {
    const { data, error } = await getSupabase()
      .from('user_fasttrack')
      .select('day_id')
      .eq('user_id', userId)

    if (error) throw error

    const remoteDays = (data || []).map((r: { day_id: number }) => r.day_id)

    // Also read localStorage (in case of offline completions)
    const localDays: number[] = JSON.parse(localStorage.getItem(LS_KEY) || '[]')

    // Merge: unique union of remote + local
    const merged = [...new Set([...remoteDays, ...localDays])].sort()

    // Sync merged back to localStorage
    localStorage.setItem(LS_KEY, JSON.stringify(merged))

    return merged
  } catch {
    // Fallback to localStorage if Supabase unavailable
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  }
}

// ── Mark a day as done ──
export async function markFTDayDone(userId: string, dayId: number): Promise<number[]> {
  // Optimistic: update localStorage immediately
  const current: number[] = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  const updated = [...new Set([...current, dayId])].sort()
  localStorage.setItem(LS_KEY, JSON.stringify(updated))

  // Persist to Supabase
  try {
    await getSupabase()
      .from('user_fasttrack')
      .upsert({ user_id: userId, day_id: dayId }, { onConflict: 'user_id,day_id' })
  } catch (e) {
    console.error('FastTrack sync error:', e)
    // Don't fail — localStorage already saved it
  }

  return updated
}

// ── Reset all progress ──
export async function resetFTProgress(userId: string): Promise<void> {
  localStorage.removeItem(LS_KEY)

  try {
    await getSupabase()
      .from('user_fasttrack')
      .delete()
      .eq('user_id', userId)
  } catch (e) {
    console.error('FastTrack reset error:', e)
  }
}
