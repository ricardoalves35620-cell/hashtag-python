import { describe, expect, it } from 'vitest'
import { PythonUnavailableError } from './pyodide'
import { isPythonUnavailable, runtimeUnavailableCopy, runtimeUnavailableText } from './runtimeMessages'

/**
 * Observed in a real browser before this fix: with the Pyodide CDN unreachable, a
 * learner running an exercise saw this in the CONSOLE OUTPUT panel — the same panel
 * their own program's output appears in, in English, during a pt-BR session:
 *
 *   ❌ Error: Failed to execute 'importScripts' on 'WorkerGlobalScope':
 *      The script at 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
 *      failed to load.
 *
 * A beginner reads that as "I broke it".
 */
describe('detecting an unavailable Python runtime', () => {
  it('recognises the typed error', () => {
    expect(isPythonUnavailable(new PythonUnavailableError())).toBe(true)
  })

  it('recognises the raw browser string, whatever path it arrives by', () => {
    expect(isPythonUnavailable(new Error("Failed to execute 'importScripts' on 'WorkerGlobalScope'"))).toBe(true)
    expect(isPythonUnavailable(new Error('The script at https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js failed to load'))).toBe(true)
    expect(isPythonUnavailable(new Error('Python worker crashed.'))).toBe(true)
  })

  it('does NOT swallow a genuine mistake in the learner\'s code', () => {
    // These are teachable moments and must keep reaching ErrorExplainer.
    expect(isPythonUnavailable(new Error('NameError: name \'x\' is not defined'))).toBe(false)
    expect(isPythonUnavailable(new Error('SyntaxError: invalid syntax'))).toBe(false)
    expect(isPythonUnavailable(new Error('ZeroDivisionError: division by zero'))).toBe(false)
    expect(isPythonUnavailable(new Error('IndentationError: unexpected indent'))).toBe(false)
  })

  it('is safe on odd input', () => {
    expect(isPythonUnavailable(null)).toBe(false)
    expect(isPythonUnavailable(undefined)).toBe(false)
    expect(isPythonUnavailable({})).toBe(false)
  })
})

describe('what the learner is told', () => {
  it('says plainly that their code is not at fault', () => {
    expect(runtimeUnavailableCopy('en').body).toMatch(/not a problem with your code/i)
    expect(runtimeUnavailableCopy('pt').body).toMatch(/não é um problema no seu código/i)
  })

  it('is written in both languages, with no English leaking into pt', () => {
    const pt = runtimeUnavailableCopy('pt')
    expect(pt.title).toBe('Não foi possível carregar o Python')
    expect(pt.retry).toBe('Tentar de novo')
    for (const value of Object.values(pt)) {
      expect(value).not.toMatch(/importScripts|WorkerGlobalScope|jsdelivr/i)
    }
  })

  it('never exposes engine internals in either language', () => {
    for (const lang of ['en', 'pt'] as const) {
      const text = runtimeUnavailableText(lang)
      expect(text).not.toMatch(/importScripts|WorkerGlobalScope|cdn\.jsdelivr|Error:/i)
      expect(text.length).toBeGreaterThan(60)
    }
  })

  it('tells the learner offline works once Python has loaded once', () => {
    // This is the single most useful thing to know: it is a PWA, and the runtime is
    // CacheFirst after the first success.
    expect(runtimeUnavailableCopy('en').hint).toMatch(/offline/i)
    expect(runtimeUnavailableCopy('pt').hint).toMatch(/offline/i)
  })
})
