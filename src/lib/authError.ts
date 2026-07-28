/**
 * Human, localised auth errors.
 *
 * Login.tsx rendered `error.message` verbatim, so a Portuguese learner who hit a
 * rate limit was shown the raw English string "Email rate limit exceeded". A
 * previous build shipped an authError chunk that did this mapping; the source file
 * was deleted and nothing replaced it.
 *
 * Matching is on stable substrings and HTTP status rather than exact text, because
 * Supabase rewords these strings between releases.
 */

export type AuthErrorKey =
  | 'invalid_credentials'
  | 'email_taken'
  | 'weak_password'
  | 'rate_limited'
  | 'email_not_confirmed'
  | 'network'
  | 'unknown'

const COPY: Record<AuthErrorKey, { en: string; pt: string }> = {
  invalid_credentials: {
    en: 'That email and password do not match. Check both and try again.',
    pt: 'Esse email e senha não conferem. Verifique os dois e tente de novo.',
  },
  email_taken: {
    en: 'An account already exists for this email. Try signing in instead.',
    pt: 'Já existe uma conta com esse email. Tente entrar em vez de criar.',
  },
  weak_password: {
    en: 'Choose a password with at least 6 characters.',
    pt: 'Escolha uma senha com pelo menos 6 caracteres.',
  },
  rate_limited: {
    en: 'Too many attempts. Wait about 15 minutes before trying again.',
    pt: 'Muitas tentativas. Espere cerca de 15 minutos antes de tentar de novo.',
  },
  email_not_confirmed: {
    en: 'Confirm your email first — check your inbox for the link.',
    pt: 'Confirme seu email primeiro — procure o link na sua caixa de entrada.',
  },
  network: {
    en: 'No connection. Your work is saved on this device.',
    pt: 'Sem conexão. Seu trabalho está salvo neste aparelho.',
  },
  unknown: {
    en: 'Something went wrong. Please try again.',
    pt: 'Algo deu errado. Tente novamente.',
  },
}

function statusOf(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const candidate = (error as { status?: unknown }).status
  return typeof candidate === 'number' ? candidate : undefined
}

export function classifyAuthError(error: unknown): AuthErrorKey {
  if (statusOf(error) === 429) return 'rate_limited'

  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  const message = raw.toLowerCase()
  if (!message) return 'unknown'

  if (message.includes('invalid login credentials')) return 'invalid_credentials'
  if (message.includes('invalid_grant')) return 'invalid_credentials'
  if (message.includes('already registered')) return 'email_taken'
  if (message.includes('already been registered')) return 'email_taken'
  if (message.includes('user already exists')) return 'email_taken'
  if (message.includes('password should be')) return 'weak_password'
  if (message.includes('weak password')) return 'weak_password'
  if (message.includes('rate limit')) return 'rate_limited'
  if (message.includes('too many requests')) return 'rate_limited'
  if (message.includes('email not confirmed')) return 'email_not_confirmed'
  if (message.includes('failed to fetch')) return 'network'
  if (message.includes('networkerror')) return 'network'
  if (message.includes('network request failed')) return 'network'

  return 'unknown'
}

export function authErrorMessage(error: unknown, lang: 'en' | 'pt'): string {
  return COPY[classifyAuthError(error)][lang]
}
