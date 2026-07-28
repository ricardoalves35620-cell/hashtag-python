import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Three files decide what language a brand-new learner is greeted in, and they used
 * to disagree: ConfigurationScreen and AppErrorBoundary fall back to Portuguese,
 * while the app itself fell back to English. So a learner on a Brazilian phone could
 * be told about a configuration problem in Portuguese and then taught in English.
 *
 * The rule now: an explicit choice wins, otherwise follow the device.
 */

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('the language a learner is greeted in', () => {
  const context = read('../contexts/AppContext.tsx')

  it('honours a stored choice above everything else', () => {
    const helper = context.slice(context.indexOf('function initialLang'), context.indexOf('function getDisplayName'))
    const savedCheck = helper.indexOf("saved === 'en'")
    const navigatorCheck = helper.indexOf('navigator')
    expect(savedCheck).toBeGreaterThan(-1)
    expect(savedCheck, 'a stored choice must be read before the device language').toBeLessThan(navigatorCheck)
  })

  it('follows the device when nobody has chosen yet', () => {
    expect(context).toMatch(/navigator\.languages\?\.\[0\]/)
    expect(context).toMatch(/\/\^pt\\b\/i/)
  })

  it('still lets an account-level preference override the device', () => {
    // Signing in on a borrowed phone must not switch the learner's language.
    const update = context.slice(context.indexOf('const updateUserState'))
    expect(update).toContain('preferred_language')
    expect(update).toContain("setLangState(remoteLanguage)")
  })

  it('leaves the login-screen toggle in place', () => {
    // The device guess is a default, not a decision. It has to stay one tap from wrong.
    const login = read('../pages/Login.tsx')
    expect(login).toContain("setLang('pt')")
    expect(login).toContain("setLang('en')")
  })
})
