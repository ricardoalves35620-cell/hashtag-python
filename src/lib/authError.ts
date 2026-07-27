import type { Lang } from '../data/types'

export function friendlyAuthError(error: unknown, lang: Lang): string {
  const raw = error instanceof Error ? error.message : String(error || '')
  const message = raw.toLowerCase()

  const copy = lang === 'pt' ? {
    invalid: 'E-mail ou senha incorretos.',
    confirm: 'Confirme seu e-mail antes de entrar.',
    registered: 'Já existe uma conta com este e-mail.',
    password: 'Use uma senha com pelo menos 6 caracteres.',
    rate: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.',
    network: 'Não foi possível conectar. Verifique sua internet e tente novamente.',
    unavailable: 'Login indisponível no momento. Você ainda pode continuar no modo visitante.',
    generic: 'Não foi possível concluir esta ação. Tente novamente em instantes.',
  } : {
    invalid: 'Incorrect email or password.',
    confirm: 'Confirm your email before signing in.',
    registered: 'An account with this email already exists.',
    password: 'Use a password with at least 6 characters.',
    rate: 'Too many attempts in a short time. Wait a few minutes and try again.',
    network: 'Could not connect. Check your internet connection and try again.',
    unavailable: 'Sign-in is unavailable right now. You can still continue in visitor mode.',
    generic: 'We could not complete this action. Try again in a moment.',
  }

  if (/invalid login|invalid credentials/.test(message)) return copy.invalid
  if (/email.*not confirmed|confirm.*email/.test(message)) return copy.confirm
  if (/already registered|already exists/.test(message)) return copy.registered
  if (/password.*(least|short|characters)/.test(message)) return copy.password
  if (/rate limit|too many requests|over_email_send_rate_limit/.test(message)) return copy.rate
  if (/fetch|network|offline|connection/.test(message)) return copy.network
  if (/not configured|not available|disabled/.test(message)) return copy.unavailable
  return copy.generic
}
