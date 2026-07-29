import { spawnSync } from 'node:child_process'

/**
 * Runs a Python script with whatever the local Python is called.
 *
 * `python3` is not a command on Windows. Typing it there hits the Microsoft Store alias
 * stub, which prints
 *
 *     Python was not found; run without arguments to install from the Microsoft Store
 *
 * and exits 9009 — so six npm scripts failed on the machine this project is developed on,
 * with a message that reads like a missing install rather than a wrong command name. The
 * interpreter is `py -3` or `python` there, and `python3` or `python` on macOS and Linux.
 *
 *   node scripts/audit/python.mjs scripts/audit/described-output.py [args...]
 */

const CANDIDATES = [
  ['python3', []],
  ['python', []],
  ['py', ['-3']],
]

/** A candidate counts only if it RUNS. The Store stub answers to the name and does not. */
export function findPython() {
  for (const [command, prefix] of CANDIDATES) {
    const probe = spawnSync(command, [...prefix, '-c', 'print(1)'], { encoding: 'utf8' })
    if (probe.status === 0 && probe.stdout.trim() === '1') return { command, prefix }
  }
  return null
}

const RUN_AS_SCRIPT = /python\.mjs$/.test(process.argv[1] || '')

if (RUN_AS_SCRIPT) {
  const args = process.argv.slice(2)
  if (!args.length) {
    console.error('usage: node scripts/audit/python.mjs <script.py> [args...]')
    process.exit(2)
  }

  const python = findPython()
  if (!python) {
    console.error('no working Python found. Tried: python3, python, py -3.')
    console.error('Windows: install from python.org and tick "Add python.exe to PATH", or')
    console.error('disable the Store alias under Settings > Apps > Advanced > App execution aliases.')
    process.exit(1)
  }

  const result = spawnSync(python.command, [...python.prefix, ...args], {
    stdio: 'inherit',
    // Windows consoles default to a legacy code page, which mangles the Portuguese and
    // the emoji these scripts print and compare. Force UTF-8 on every platform.
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' },
  })
  process.exit(result.status ?? 1)
}
