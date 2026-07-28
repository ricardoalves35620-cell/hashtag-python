import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { personalize, DEFAULT_PROFILE } from './learnerProfile'

/**
 * Authored curriculum text stores {{file}}, {{folder}} and {{name}} so the content
 * audits keep seeing one canonical wording. Every learner-facing surface is then
 * responsible for substituting them at render time.
 *
 * Found by driving the app, not by reading code: the visible-contract panel did not
 * substitute, so the very first exercise a beginner ever opens told them to expect
 * the literal output "Running: {{file}}". Nothing failed, no test broke — the app
 * simply taught its first lesson in template syntax.
 *
 * Two ways that regresses, so two guards:
 *   1. an author writes a token personalize() has never heard of, or
 *   2. a new surface renders authored text raw.
 */

// fileURLToPath, not URL.pathname: on Windows the latter yields "/C:/Users/..." and
// join() then builds "C:\C:\Users\...", so this suite failed only off Linux.
const SRC = fileURLToPath(new URL('..', import.meta.url))
const KNOWN_TOKENS = ['file', 'folder', 'name']

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.tsx?$/.test(entry) && !entry.includes('.test.')) out.push(full)
  }
  return out
}

describe('placeholders authors can write', () => {
  const dataFiles = walk(join(SRC, 'data'))

  /**
   * There are two kinds of {{...}} in this codebase and they behave in opposite ways:
   *
   *   {{file}}       — a personalize() token. MUST be substituted before the learner
   *                    sees it. Leaking one is the bug this file exists for.
   *   {{your name}}  — a deliberate wildcard, shown to the learner to mean "your value
   *                    goes here", and turned into `.+` by samplePattern() so the
   *                    grader does not demand one specific name.
   *
   * They are told apart by shape: a personalize token is a single identifier, a
   * wildcard reads as natural language. Anything that is a single unknown identifier
   * is neither, and would reach the learner as literal template syntax.
   */
  it('are all either a token personalize() substitutes or an obvious wildcard', () => {
    const unknown = new Set<string>()
    for (const file of dataFiles) {
      for (const match of readFileSync(file, 'utf8').matchAll(/\{\{([^}]*)\}\}/g)) {
        const token = match[1].trim()
        if (token === 'placeholders') continue // a doc comment about the mechanism
        if (KNOWN_TOKENS.includes(token)) continue
        if (/\s/.test(token)) continue // natural-language wildcard, shown on purpose
        unknown.add(`${match[0]} in ${relative(SRC, file)}`)
      }
    }
    // A single-word token nobody substitutes reaches the learner verbatim. There is no
    // runtime error for that, which is exactly why it needs a test.
    expect([...unknown]).toEqual([])
  })

  it('are every one of them actually removed by personalize()', () => {
    const profile = { name: 'Ricardo', folder: 'MeusProjetos', file: 'aula1.py' }
    for (const token of KNOWN_TOKENS) {
      expect(personalize(`before {{${token}}} after`, profile)).not.toContain('{{')
    }
  })

  it('leaves no dangling token when the learner never gave a name', () => {
    // The one token with no sensible generic fallback.
    expect(personalize('Nice work, {{name}}!', DEFAULT_PROFILE)).not.toContain('{{')
  })
})

describe('surfaces that render authored exercise text', () => {
  const contractPanel = readFileSync(join(SRC, 'components/ExerciseExpectedOutput.tsx'), 'utf8')

  it('substitute in the expected-output panel — description, inputs and output alike', () => {
    // The regression that started this: the output block is the one a beginner reads
    // most literally, because it is what they are trying to reproduce.
    expect(contractPanel).toContain('personalize(contract.expected)')
    expect(contractPanel).toContain('personalize(contract.description)')
    expect(contractPanel).toContain('personalize(value)')
  })

  it('never render a raw contract field anywhere in the panel', () => {
    // Catches a future field being added and printed unwrapped.
    expect(contractPanel).not.toMatch(/\{contract\.(expected|description)\}/)
  })

  it('substitute in the exam panel too', () => {
    // No exam currently authors a placeholder, so this is not fixing a live bug — it
    // closes the same hole in the one other surface built from the same contract shape.
    const examPanel = readFileSync(join(SRC, 'components/ExamExpectedOutput.tsx'), 'utf8')
    expect(examPanel).toContain('personalize(contract.expected)')
    expect(examPanel).not.toMatch(/\{contract\.(expected|description)\}/)
  })
})

describe('wording a learner meets before anything has been explained', () => {
  const contractPanel = readFileSync(join(SRC, 'components/ExerciseExpectedOutput.tsx'), 'utf8')
  // Comments explain the rule; only the strings ship to the learner.
  const withoutComments = (source: string) => source.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')

  it('does not call print() "a call" on the very first requirement they read', () => {
    const requirements = readFileSync(join(SRC, 'lib/requirementLanguage.ts'), 'utf8')
    expect(requirements).not.toContain('a call to ${value}()')
  })

  it('does not use the word traceback in the beginner stage', () => {
    // Introduced later, deliberately. Base-stage copy has to survive being someone's
    // first ever screen of programming text.
    const pedagogy = withoutComments(readFileSync(join(SRC, 'lib/pedagogy.ts'), 'utf8'))
    const base = pedagogy.slice(pedagogy.indexOf('base: {'), pedagogy.indexOf('professional: {'))
    expect(base).not.toBe('')
    expect(base.toLowerCase()).not.toContain('traceback')
  })

  it('does not print a sentence in terminal green under "Expected output"', () => {
    // Seven exercises (the guided opener of phases 2-8) author no sample output, so
    // the contract falls back to a prose sentence. It was being rendered in a <pre>
    // in output colour, which reads as text to reproduce rather than a description.
    expect(contractPanel).toContain("contract.kind === 'behavior' ? copy.behaviorTitle : copy.output")
    expect(contractPanel).toMatch(/behaviorTitle: 'What counts as done'/)
    expect(contractPanel).toMatch(/behaviorTitle: 'O que conta como concluído'/)
  })

  it('does not describe the expected output as "canonical"', () => {
    const visible = withoutComments(contractPanel).toLowerCase()
    expect(visible).not.toContain('canonical')
    expect(visible).not.toContain('canônica')
  })
})
