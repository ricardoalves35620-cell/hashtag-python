import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The audit suite has to run on the machine this project is developed on.
 *
 * It did not. Six npm scripts called `python3` and wrote to `/tmp/...`, and on Windows
 * `python3` hits the Microsoft Store alias stub — which prints "Python was not found" and
 * exits — while `/tmp/ex0_20.json` resolves to `C:\tmp\...` if it resolves at all. So the
 * owner of the repository could not run half of his own checks, and the failure message
 * pointed at a missing install rather than a wrong command name.
 *
 * That is worse than a broken check. A check nobody can run is a check nobody runs, and
 * the whole standard in docs/CURRICULUM-STANDARD.md rests on these commands being used.
 *
 * Scripts kept for history rather than run — the one-off authoring scripts — are exempt.
 */

const AUDIT_DIR = 'scripts/audit'

const ONE_OFF_AUTHORING = new Set([
  'author-behaviour.py',
  'author-transfers.py',
  'author-transfers-2.py',
  'behaviour-shadow.py',
  'local-ci.sh',        // a bash script, POSIX by definition, and not on the npm path
  'flight-mode.mjs',    // caches a Pyodide download; not part of the standard's commands
  'portability.test.ts',
])

const liveScripts = readdirSync(AUDIT_DIR)
  .filter(name => /\.(py|mjs|ts)$/.test(name))
  .filter(name => !ONE_OFF_AUTHORING.has(name))

describe('the audit suite runs on Windows as well as POSIX', () => {
  it('no npm script calls python3 or writes to /tmp', () => {
    const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
    const offenders = Object.entries(scripts)
      .filter(([, command]) => /\bpython3?\b(?!\.mjs)|\/tmp\//.test(command))
      .map(([name, command]) => `${name}: ${command}`)
    expect(offenders).toEqual([])
  })

  /**
   * Read CODE, not prose.
   *
   * The first version of these two checks matched anywhere in the file and reported
   * cache.py and pt-grading.mjs — for the sentences explaining why this rule exists.
   * That is the third time in this session a detector here has flagged the comment
   * documenting the very bug it looks for. So: strip comments and docstrings first, and
   * match a CALL rather than a mention.
   */
  const DOCSTRING = new RegExp('"'.repeat(3) + '[\\s\\S]*?' + '"'.repeat(3), 'g')

  const codeOnly = (body: string) => body
    .replace(/\/\*[\s\S]*?\*\//g, ' ')            // block comments
    .replace(DOCSTRING, ' ')                      // Python docstrings
    .replace(/(^|\n)[ \t]*(\/\/|#).*/g, '$1')     // line comments, JS and Python

  const scan = (test: RegExp, skip: string[] = []) => liveScripts
    .filter(name => !skip.includes(name))
    .map(name => ({ name, code: codeOnly(readFileSync(join(AUDIT_DIR, name), 'utf8')) }))
    .filter(({ code }) => test.test(code))
    .map(({ name }) => name)

  it('no live audit script hardcodes a POSIX temp path', () => {
    expect(scan(/['"]\/tmp\//)).toEqual([])
  })

  it('no live audit script spawns python3 directly', () => {
    // A spawn, not the word: execFileSync('python3', …), spawn("python3", …).
    expect(scan(/(?:exec|spawn)\w*\(\s*['"]python3?['"]/, ['python.mjs'])).toEqual([])
  })

  it('fires on the patterns that caused this test to exist', () => {
    // A guard reporting zero proves nothing until it has been shown to report one.
    expect(/['"]\/tmp\//.test(`json.load(open('/tmp/ex0_20.json'))`)).toBe(true)
    expect(/(?:exec|spawn)\w*\(\s*['"]python3?['"]/.test(`execFileSync('python3', [path])`)).toBe(true)
    // …and stays quiet on the prose that describes them.
    expect(codeOnly('# it used to read /tmp/references.json\ncode()')).not.toMatch(/\/tmp\//)
  })
})
