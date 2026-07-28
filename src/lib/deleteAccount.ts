import { getSupabase } from './supabase'
import { clearLocalLearningData } from './resetLearningProgress'

/**
 * Permanent account deletion.
 *
 * LGPD Art. 18, VI gives a learner the right to have their personal data
 * eliminated. This is a legal obligation for a pt-BR product regardless of whether
 * the app is ever submitted to an app store — Apple's 5.1.1(v) requirement is the
 * lesser reason.
 *
 * The anon client cannot remove an auth user, so the actual deletion runs in the
 * `delete-account` Edge Function under the service role. That function reads the
 * user id from the verified JWT and ignores the request body entirely, so a caller
 * can only ever delete themselves.
 */

export class AccountDeletionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AccountDeletionError'
  }
}

export interface DeleteAccountResult {
  deleted: true
}

export async function deleteAccount(): Promise<DeleteAccountResult> {
  const supabase = getSupabase()

  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new AccountDeletionError('You need to be signed in to delete your account.')
  }

  const { data, error } = await supabase.functions.invoke<{ deleted?: boolean; error?: string }>(
    'delete-account',
    { method: 'POST' },
  )

  if (error) throw new AccountDeletionError(error.message)
  if (!data?.deleted) throw new AccountDeletionError(data?.error ?? 'The account was not deleted.')

  // The server rows are gone; clear this device so a cached copy cannot resurrect
  // anything in the UI, then drop the now-invalid session.
  clearLocalLearningData()
  try {
    await supabase.auth.signOut()
  } catch {
    // The user no longer exists, so a failed sign-out is expected and harmless.
  }

  return { deleted: true }
}
