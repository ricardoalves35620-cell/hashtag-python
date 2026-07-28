#!/usr/bin/env node
/**
 * First-paint budget.
 *
 * Measures what a browser must download before it can render the login screen:
 * every stylesheet and script that dist/index.html references directly, including
 * <link rel="modulepreload">. That is the number a learner on a 3G connection
 * actually waits for.
 *
 * Written because this regressed silently. Route components were switched from
 * React.lazy to static imports in App.tsx, and because Lesson/Exercises/Quiz/Exam
 * pull in ALL_PHASES, the 900 kB curriculum came with them. First paint went from
 * roughly 500 kB to 2.6 MB and nothing failed — no test, no gate, no alarm.
 *
 * Deliberately dependency-free: node's own zlib and a regex over the built HTML.
 * A budget you have to `npm install` for is a budget that gets dropped.
 *
 *   node scripts/audit/check-bundle-budget.mjs
 *   node scripts/audit/check-bundle-budget.mjs --update    # rewrite the budget
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { resolve, join } from 'node:path'

const DIST = resolve('dist')
const INDEX = join(DIST, 'index.html')
const BUDGET_FILE = resolve('audit/bundle-budget.json')

// Headroom over the measured baseline. Tight enough to catch a route-splitting
// regression (which is a multiple, not a percentage), loose enough that ordinary
// feature work does not trip it.
const TOLERANCE = 0.15

if (!existsSync(INDEX)) {
  console.error('dist/index.html not found — run `npm run build` first.')
  process.exit(1)
}

const html = readFileSync(INDEX, 'utf8')
const referenced = [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(m => m[1]))]

if (!referenced.length) {
  console.error('No /assets/ references found in dist/index.html — has the build layout changed?')
  process.exit(1)
}

let raw = 0
let gzip = 0
const rows = []
for (const ref of referenced.sort()) {
  const file = join(DIST, ref)
  if (!existsSync(file)) {
    console.error(`dist/index.html references ${ref}, which does not exist.`)
    process.exit(1)
  }
  const bytes = readFileSync(file)
  const gz = gzipSync(bytes).length
  raw += bytes.length
  gzip += gz
  rows.push({ ref, raw: bytes.length, gzip: gz })
}

const kb = n => (n / 1024).toFixed(1).padStart(8)
console.log('First-paint payload (dist/index.html direct references):')
for (const row of rows) console.log(`  ${row.ref.padEnd(46)} ${kb(row.raw)} kB  gz ${kb(row.gzip)} kB`)
console.log(`  ${'TOTAL'.padEnd(46)} ${kb(raw)} kB  gz ${kb(gzip)} kB`)

if (process.argv.includes('--update')) {
  writeFileSync(BUDGET_FILE, `${JSON.stringify({ raw, gzip, note: 'First-paint payload. Update deliberately, never to make CI green.' }, null, 2)}\n`)
  console.log(`\nBudget written to ${BUDGET_FILE}`)
  process.exit(0)
}

if (!existsSync(BUDGET_FILE)) {
  console.error(`\nNo budget recorded. Run with --update to establish one.`)
  process.exit(1)
}

const budget = JSON.parse(readFileSync(BUDGET_FILE, 'utf8'))
const limitRaw = Math.round(budget.raw * (1 + TOLERANCE))
const limitGzip = Math.round(budget.gzip * (1 + TOLERANCE))
const over = raw > limitRaw || gzip > limitGzip

console.log(`\nBudget: ${kb(budget.raw)} kB raw / ${kb(budget.gzip)} kB gzip  (+${TOLERANCE * 100}% tolerance)`)
console.log(`Limit:  ${kb(limitRaw)} kB raw / ${kb(limitGzip)} kB gzip`)

if (over) {
  console.error('\n❌ First-paint payload exceeds budget.')
  console.error('   The usual cause is a module that pulled a large dependency into the entry')
  console.error('   graph — check whether a route stopped being lazy, or whether something')
  console.error('   imported by AppContext now reaches src/data/phases.')
  console.error('   If the growth is intended, re-baseline with:')
  console.error('     node scripts/audit/check-bundle-budget.mjs --update')
  process.exit(1)
}

console.log('\n✅ Within budget.')
