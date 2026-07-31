/**
 * Orchestrates a full learner run: serve the built app, walk it, clean up.
 *
 *   node scripts/audit/run-learner.mjs                    # all phases, en + pt
 *   node scripts/audit/run-learner.mjs --phases=40-68 --langs=pt
 *
 * This layer exists in Node, not PowerShell, for one hard-learned reason: the
 * PowerShell version failed three different ways on the owner's machine
 * (missing dependency, browser path, and finally vite binding IPv6 ::1 while
 * the probe asked IPv4 127.0.0.1) — and every failure shipped, because
 * PowerShell on Windows cannot be executed where this repository is
 * maintained. Node behaves the same on both platforms, so THIS file is tested
 * end-to-end before it ships. run-learner.ps1 is now a thin wrapper that only
 * does the things Node cannot: git pull, npm ci, the build, playwright install.
 *
 * The dual-stack lesson, pinned: the server binds 127.0.0.1 EXPLICITLY and the
 * probe and HP_BASE use the same literal address. "localhost" is two addresses
 * on modern machines, and vite answering on one while the probe asks the other
 * reads as "server never started" with the server plainly running.
 */
import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..', '..')
const HOST = '127.0.0.1'
const PORT = 4173
const BASE = `http://${HOST}:${PORT}`
const passthrough = process.argv.slice(2)

// ── audit-account credentials (same .env.audit.local convention as run-auditor) ──
const envFile = resolve(ROOT, '.env.audit.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([^#][^=]*)=(.*)$/)
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim()
  }
}
if (!process.env.AUDIT_USER_EMAIL || !process.env.AUDIT_USER_PASSWORD) {
  console.log('no audit account in .env.audit.local — the learner will walk as a GUEST (no sync coverage)')
}

const probe = async () => {
  try {
    const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

const die = (message) => { console.error(message); process.exit(1) }

if (!existsSync(resolve(ROOT, 'dist', 'index.html'))) {
  die('dist/ has no build — run npm run build first (run-learner.ps1 does this)')
}

// A server already answering is a previous run's orphan serving a STALE build —
// the worst failure mode, because every check then passes against old code.
if (await probe()) {
  die(`something is already serving ${BASE} (an orphaned previous run?) — close it and retry`)
}

const serverOutput = []
const server = spawn(process.execPath,
  [resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--host', HOST, '--port', String(PORT), '--strictPort'],
  { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] })
server.stdout.on('data', (chunk) => serverOutput.push(String(chunk)))
server.stderr.on('data', (chunk) => serverOutput.push(String(chunk)))
let serverExited = false
server.on('exit', () => { serverExited = true })

let up = false
for (let i = 0; i < 120 && !serverExited; i++) {
  if (await probe()) { up = true; break }
  await new Promise(done => setTimeout(done, 500))
}
if (!up) {
  console.error('--- preview server output ---')
  console.error(serverOutput.join('').slice(0, 4000) || '(no output)')
  server.kill()
  die(`preview server did not answer on ${BASE} — its output is above`)
}
console.log(`serving dist/ on ${BASE}`)

// ── the learner pipeline, each step spawned without any shell in between ──
const tsx = resolve(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs')
const step = (label, argv) => new Promise((done) => {
  console.log(`\n── ${label}`)
  const child = spawn(process.execPath, argv, {
    cwd: ROOT, stdio: 'inherit', env: { ...process.env, HP_BASE: BASE },
  })
  child.on('exit', (code) => done(code ?? 1))
})

let exitCode = 1
try {
  exitCode = await step('reference dump', [resolve(ROOT, 'scripts', 'audit', 'python.mjs'), 'scripts/audit/dump-references.py'])
  if (exitCode === 0) exitCode = await step('localize references', [tsx, 'scripts/audit/localize-references.ts'])
  if (exitCode === 0) exitCode = await step('learner agent', [tsx, 'scripts/audit/learner-agent.ts', ...passthrough])
} finally {
  server.kill()
}

console.log('\nreport: audit-reports/learner-agent.md (send this back for review)')
process.exit(exitCode)
