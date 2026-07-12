import { describe, expect, it } from 'vitest'
import { localizePythonComments, resolveLocalizedCode } from './localization'

describe('code localization', () => {
  it('translates Portuguese comments without changing executable strings', () => {
    const code = `status = "approved"  # Comparing TEXT works too (case-sensitive!)\nprint("# stays inside the string")`
    const localized = localizePythonComments(code, 'pt')
    expect(localized).toContain('# Comparar TEXTO também funciona')
    expect(localized).toContain('print("# stays inside the string")')
    expect(localized).toContain('status = "approved"')
  })

  it('keeps English code unchanged', () => {
    const code = '# condition + colon\nif ready:\n    pass'
    expect(localizePythonComments(code, 'en')).toBe(code)
  })

  it('prefers explicitly bilingual code', () => {
    expect(resolveLocalizedCode({ en: '# Read value', pt: '# Leia o valor' }, 'pt')).toBe('# Leia o valor')
  })

  it('translates the Phase 5 safety comments', () => {
    const code = '# Site safety gate: wind speed and crane operations\n# ✅ FIX: convert first'
    const localized = localizePythonComments(code, 'pt')
    expect(localized).toContain('Regra de segurança da obra')
    expect(localized).toContain('✅ CORREÇÃO: converta primeiro')
  })
})
