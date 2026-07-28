import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from '../data/phases/index'
import { localizePythonComments, resolveLocalizedCode } from './localization'

/**
 * Portuguese mode leaks English, and the architecture guarantees it will keep leaking.
 *
 * Code comments are translated at render time by a 176-entry dictionary plus 77 regex
 * rules in localization.ts. Anything the dictionary does not know passes through
 * silently, so every new exercise an author writes adds untranslated comments and
 * nothing fails. A measured 53% of code blocks leaked when this test was written.
 *
 * The count below is a RATCHET, not a target. It may only ever go down. Converting a
 * starterCode to the bilingual form ({ en, pt }) takes the translator out of the path
 * for that block and lowers the number; lower it when you do.
 */

/**
 * Function words only. Content words like "use", "name", "line" and "value" exist in
 * both languages or appear as printed labels inside comments, and every one of them
 * produced a false positive on the first pass. Precision beats recall here: a ratchet
 * nobody trusts gets deleted.
 */
const EN_EVIDENCE = /\b(the|and|with|your|this|that|these|those|from|into|each|when|then|after|before|must|should|would|could|here|there|what|which|where|because|about|above|below|again|without|inside|outside|between|every|always|never|only|also|still|same|very|more|less|many|drops|holds|remainder|reached|worked|identical|defines|carries|produces|downloaded|disconnected)\b/gi

/** A comment line that is a runnable command is syntax, not prose — see COMMAND_LINE. */
const COMMAND_LINE = /^\s*[$>]?\s*(python|python3|py|pip|pip3|npm|npx|pnpm|yarn|node|git|curl|wget|cd|ls|mkdir|export|source|docker|make|pytest|uvicorn|streamlit)\b/i

function commentsOf(code: string): string {
  return code
    .split('\n')
    .map(line => {
      const i = line.indexOf('#')
      if (i < 0) return ''
      const body = line.slice(i + 1)
      return COMMAND_LINE.test(body.trim()) ? '' : body
    })
    .join('\n')
    .trim()
}

function leakingBlocks(): string[] {
  const leaks: string[] = []
  const visit = (where: string, code: unknown) => {
    if (!code) return
    const en = commentsOf(resolveLocalizedCode(code as string, 'en'))
    if (!en) return
    const pt = commentsOf(resolveLocalizedCode(code as string, 'pt'))
    if ((pt.match(EN_EVIDENCE) || []).length) leaks.push(where)
  }
  for (const phase of ALL_PHASES as any[]) {
    for (const [i, block] of (phase.lesson?.blocks || []).entries()) visit(`p${phase.id} lesson[${i}]`, block.code)
    for (const ex of phase.exercises || []) visit(`p${phase.id} ${ex.id}`, ex.starterCode)
    visit(`p${phase.id} exam`, phase.exam?.starterCode)
  }
  return leaks
}

// Measured 2026-07-28: 45 of 142 blocks. Lower it whenever you convert a block to the
// bilingual form; never raise it. Phases 0 and 1 are already at zero and are held there
// by the test below, so a regression in the beginner phases fails loudly rather than
// hiding inside this aggregate.
const LEAK_CEILING = 45

describe('Portuguese mode does not leak English into code comments', () => {
  it('never leaks in more blocks than it did when this ratchet was set', () => {
    const leaks = leakingBlocks()
    expect(
      leaks.length,
      `Leaking blocks:\n  ${leaks.join('\n  ')}\n\n` +
        'If this went UP, a new block was authored as a plain string and its comments ' +
        'are not in the translation dictionary. Author starterCode as { en, pt } instead. ' +
        'If it went DOWN, lower LEAK_CEILING to the new number.',
    ).toBeLessThanOrEqual(LEAK_CEILING)
  })

  it('keeps the beginner phases clean, where a leak does the most damage', () => {
    // Phases 0 and 1 are someone's first contact with code in any language.
    const early = leakingBlocks().filter(w => /^p[01] /.test(w))
    expect(early, 'phases 0 and 1 must be fully translated').toEqual([])
  })
})

describe('the comment translator cannot corrupt what it does not understand', () => {
  it('does not fire inside an English contraction', () => {
    // [/\bcan\b/gi, 'pode'] matched inside "can't", because ' is a non-word character
    // and so \b holds between "can" and "'t". Phase 4 shipped "TypeError: pode't add
    // str + int" — a word in no language, next to a real Python error name.
    expect(localizePythonComments("# TypeError: can't add str + int", 'pt')).toContain("can't")
    expect(localizePythonComments("# TypeError: can't add str + int", 'pt')).not.toContain("pode't")
  })

  it('leaves a runnable command alone', () => {
    // [/\bBuild\b/gi, 'Construa'] rewrote `python -m build` to `python -m Construa`
    // in phase 52. Not a translation defect — an instruction that no longer runs.
    expect(localizePythonComments('# python -m build', 'pt')).toBe('# python -m build')
    expect(localizePythonComments('# pip install -e .[dev]', 'pt')).toBe('# pip install -e .[dev]')
    expect(localizePythonComments('# npm run build', 'pt')).toBe('# npm run build')
  })

  it('still translates ordinary prose', () => {
    expect(localizePythonComments('# Variables can be UPDATED anytime', 'pt')).not.toContain('Variables')
  })

  it('never touches anything in English mode', () => {
    const code = '# Create the four variables below\nx = 1'
    expect(localizePythonComments(code, 'en')).toBe(code)
  })
})

describe('a bilingual starterCode bypasses the translator entirely', () => {
  it('returns the authored text verbatim for each language', () => {
    const code = { en: '# First select the row', pt: '# Primeiro selecione a linha' }
    expect(resolveLocalizedCode(code, 'en')).toBe(code.en)
    expect(resolveLocalizedCode(code, 'pt')).toBe(code.pt)
  })

  it('is the form used by the blocks already converted', () => {
    const source = readFileSync(new URL('../data/phases/phases_9_to_12_v11.ts', import.meta.url), 'utf8')
    expect(source).toContain('Primeiro selecione a linha, depois selecione a coluna.')
    expect(source).toContain('First select the row, then select the column.')
  })
})
