import { describe, expect, it } from 'vitest'
import { authErrorMessage, classifyAuthError } from './authError'

/** Shapes Supabase actually returns, kept verbatim so a copy change is caught here. */
const supabaseError = (message: string, status?: number) =>
  Object.assign(new Error(message), status === undefined ? {} : { status })

describe('auth error classification', () => {
  it('maps the real Supabase strings a learner can hit', () => {
    expect(classifyAuthError(supabaseError('Invalid login credentials'))).toBe('invalid_credentials')
    expect(classifyAuthError(supabaseError('User already registered'))).toBe('email_taken')
    expect(classifyAuthError(supabaseError('Password should be at least 6 characters'))).toBe('weak_password')
    expect(classifyAuthError(supabaseError('Email rate limit exceeded'))).toBe('rate_limited')
    expect(classifyAuthError(supabaseError('Email not confirmed'))).toBe('email_not_confirmed')
    expect(classifyAuthError(supabaseError('Failed to fetch'))).toBe('network')
  })

  it('treats HTTP 429 as a rate limit even when the message is unfamiliar', () => {
    expect(classifyAuthError(supabaseError('something new upstream', 429))).toBe('rate_limited')
  })

  it('falls back to unknown rather than throwing on odd input', () => {
    expect(classifyAuthError(null)).toBe('unknown')
    expect(classifyAuthError(undefined)).toBe('unknown')
    expect(classifyAuthError({})).toBe('unknown')
    expect(classifyAuthError(supabaseError(''))).toBe('unknown')
  })
})

describe('auth error copy', () => {
  it('never leaks a raw Supabase string into the interface', () => {
    const raw = 'Invalid login credentials'
    expect(authErrorMessage(supabaseError(raw), 'en')).not.toContain(raw)
    expect(authErrorMessage(supabaseError(raw), 'pt')).not.toContain(raw)
  })

  it('speaks Portuguese to Portuguese learners', () => {
    // The app is pt-BR first; this is the regression that shipped when authError.ts
    // was deleted and Login.tsx started rendering error.message directly.
    expect(authErrorMessage(supabaseError('Email rate limit exceeded'), 'pt')).toContain('Muitas tentativas')
    expect(authErrorMessage(supabaseError('Invalid login credentials'), 'pt')).toContain('não conferem')
  })

  it('offers copy in both languages for every classification', () => {
    const samples = [
      supabaseError('Invalid login credentials'),
      supabaseError('User already registered'),
      supabaseError('Password should be at least 6 characters'),
      supabaseError('rate limit'),
      supabaseError('Email not confirmed'),
      supabaseError('Failed to fetch'),
      supabaseError('anything else'),
    ]
    for (const sample of samples) {
      for (const lang of ['en', 'pt'] as const) {
        const message = authErrorMessage(sample, lang)
        expect(message.length).toBeGreaterThan(10)
        expect(message).not.toMatch(/undefined|\[object/)
      }
    }
  })
})
