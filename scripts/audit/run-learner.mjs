/**
 * Orchestrates a full learner run: build the app against a backend, serve it,
 * walk it as a learner, clean up.
 *
 *   node scripts/audit/run-learner.mjs                    # all phases, en + pt
 *   node scripts/audit/run-learner.mjs --phases=40-68 --langs=pt
 *   node scripts/audit/run-learner.mjs --skip-build       # reuse dist/ as-is
 *
 * This layer is Node, not PowerShell, for one hard-learned reason: the
 * PowerShell version failed four different ways on the owner's machine —
 * missing dependency, browser path, vite binding IPv6 while the probe asked
 * IPv4, and a build with no Supabase config so the app showed CONFIGURATION
 * REQUIRED and there was no login form to sign into. Every one shipped,
 * because PowerShell on Windows cannot be run where this repo is maintained.
 * Node behaves identically on both platforms, so THIS file is tested
 * end-to-end before it ships. run-learner.ps1 is a thin wrapper for the four
 * things Node cannot do: git pull, npm ci, playwright install, and the switch.
 *
 * The build config lives here because it depends on how we intend to sign in:
 *
 *   audit account present  -> build against scripts/audit/supabase-stub.mjs,
 *                             the repo's own local backend, which honours the
 *                             account's own credentials. No secrets needed, and
 *                             it works even though the owner's .env.local has no
 *                             Supabase keys (they deploy through Cloudflare Pages
 *                             env vars, so a local build never had them).
 *   no account             -> build with a placeholder config, walk as a guest.
 *
 * To test against REAL Supabase instead (exercising live sync and RLS), set
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the environment before
 * running — both are publishable by design — and they take precedence.
 *
 * Two addresses, one lesson pinned four times: every server binds 127.0.0.1
 * EXPLICITLY and every probe/URL uses that literal. "localhost" resolves to
 * both IPv4 and IPv6, and a server answering on one while a probe asks the
 * other reads as "never started" with the server plainly running.
 */
import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..', '..')
const HOST = '127.0.0.1'
const PORT = 4173
const STUB_PORT = 54321
const BASE = `http://${HOST}:${PORT}`
const STUB_URL = `http://${HOST}:${STUB_PORT}`
const SKIP_BUILD = process.argv.includes('--skip-build')
const passthrough = process.argv.slice(2).filter(arg => arg !== '--skip-build')

// ── audit-account credentials (same .env.audit.local convention as run-auditor) ──
const envFile = resolve(ROOT, '.env.audit.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([^#][^=]*)=(.*)$/)
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim()
  }
}
const SIGNED_IN = Boolean(process.env.AUDIT_USER_EMAIL && process.env.AUDIT_USER_PASSWORD)
// A real config in the environment wins over the stub — that is the "test
// against live Supabase" escape hatch.
const REAL_SUPABASE = Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)

if (!SIGNED_IN) console.log('no audit account in .env.audit.local — the learner will walk as a GUEST (no sync coverage)')

const die = (message) => { console.error(message); process.exit(1) }
const wait = (ms) => new Promise(done => setTimeout(done, ms))
const probe = async (url) => {
  try { return (await fetch(url, { signal: AbortSignal.timeout(2000) })).ok } catch { return false }
}
const node = (argv, extraEnv = {}) => new Promise((done) => {
  const child = spawn(process.execPath, argv, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...extraEnv } })
  child.on('exit', (code) => done(code ?? 1))
})

// ── background processes, torn down in a finally no matter how we exit ──
const background = []
function serve(name, argv, url, captureFor) {
  const output = []
  const proc = spawn(process.execPath, argv, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] })
  proc.stdout.on('data', c => output.push(String(c)))
  proc.stderr.on('data', c => output.push(String(c)))
  let exited = false
  proc.on('exit', () => { exited = true })
  background.push(proc)
  return { proc, output, url, name, isExited: () => exited, captureFor }
}
async function waitUp(server) {
  for (let i = 0; i < 120 && !server.isExited(); i++) {
    if (await probe(server.url)) return true
    await wait(500)
  }
  console.error(`--- ${server.name} output ---`)
  console.error(server.output.join('').slice(0, 4000) || '(no output)')
  return false
}

let exitCode = 1
try {
  // ── 1. decide the backend and build against it ──
  const viteBin = resolve(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
  let buildEnv = {}
  if (REAL_SUPABASE) {
    console.log('using VITE_SUPABASE_URL from the environment (real backend)')
  } else if (SIGNED_IN) {
    console.log('using the local Supabase stub — the audit account signs in against it')
    buildEnv = { VITE_SUPABASE_URL: STUB_URL, VITE_SUPABASE_ANON_KEY: 'stub-anon-key-for-local-audit-only-0000' }
  } else {
    buildEnv = { VITE_SUPABASE_URL: 'https://placeholder.supabase.co', VITE_SUPABASE_ANON_KEY: 'guest-placeholder-key-not-a-credential-00' }
  }

  if (!SKIP_BUILD) {
    console.log('\n── build')
    // npm runs the "prebuild" (copy-pyodide) automatically; invoking vite
    // directly would skip it and leave the runtime + wheels out of dist.
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const buildCode = await new Promise((done) => {
      const child = spawn(npm, ['run', 'build'], { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, ...buildEnv } })
      child.on('exit', (code) => done(code ?? 1))
    })
    if (buildCode !== 0) die('build failed')
  } else if (!existsSync(resolve(ROOT, 'dist', 'index.html'))) {
    die('--skip-build but dist/ has no build')
  }

  // ── 2. start the stub (only when it is the backend) ──
  if (SIGNED_IN && !REAL_SUPABASE) {
    if (await probe(`${STUB_URL}/auth/v1/health`)) die(`something is already serving ${STUB_URL} — close it and retry`)
    const stub = serve('supabase stub', [resolve(ROOT, 'scripts', 'audit', 'supabase-stub.mjs'), '--port', String(STUB_PORT)], `${STUB_URL}/auth/v1/health`)
    if (!await waitUp(stub)) die('the Supabase stub did not start')
    console.log(`supabase stub on ${STUB_URL}`)
  }

  // ── 3. serve the build ──
  if (await probe(`${BASE}/`)) die(`something is already serving ${BASE} (an orphaned previous run?) — close it and retry`)
  const server = serve('preview server', [viteBin, 'preview', '--host', HOST, '--port', String(PORT), '--strictPort'], `${BASE}/`)
  if (!await waitUp(server)) die(`preview server did not answer on ${BASE}`)
  console.log(`serving dist/ on ${BASE}`)

  // ── 4. the learner pipeline ──
  const tsx = resolve(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs')
  const stepEnv = { HP_BASE: BASE }
  console.log('\n── reference dump')
  exitCode = await node([resolve(ROOT, 'scripts', 'audit', 'python.mjs'), 'scripts/audit/dump-references.py'], stepEnv)
  if (exitCode === 0) { console.log('\n── localize references'); exitCode = await node([tsx, 'scripts/audit/localize-references.ts'], stepEnv) }
  if (exitCode === 0) { console.log('\n── learner agent'); exitCode = await node([tsx, 'scripts/audit/learner-agent.ts', ...passthrough], stepEnv) }
} finally {
  for (const proc of background) proc.kill()
}

console.log('\nreport: audit-reports/learner-agent.md (send this back for review)')
process.exit(exitCode)
