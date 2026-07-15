import { spawnSync, type SpawnSyncReturns } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { auditPlanSignature, buildAuditPlan, PHASE_COUNT, type AuditMode, type AuditPlanEntry } from './audit-plan'

const VERSION_FILE = path.resolve('audit/auditor-version.txt')
const AUDITOR_VERSION = fs.existsSync(VERSION_FILE)
  ? fs.readFileSync(VERSION_FILE, 'utf8').trim()
  : '8.5.0'

interface Args {
  cycles: number
  mode: AuditMode
  minutes: number
  batch: number
  start: number
  url: string
  fresh: boolean
  environmentOffset: number
}

interface AuditEnvironment {
  device: string
  lang: 'en' | 'pt'
  theme: 'light' | 'dark'
}

interface AggregatedIssue {
  fingerprint: string
  source: string
  cycle: number
  firstSeen: string
  lastSeen: string
  occurrences: number
  details: Record<string, unknown>
}

interface CommandResult {
  status: number
  signal: NodeJS.Signals | null
  error?: string
  startedAt: string
  finishedAt: string
  durationMs: number
}

interface DeepAuditSummary {
  cycleNumber?: number
  phaseIds?: number[]
  language?: string
  theme?: string
  failures?: Array<{ step?: string; message?: string }>
}

const AUDIT_ENVIRONMENTS: readonly AuditEnvironment[] = [
  { device: 'iphone-webkit', lang: 'pt', theme: 'dark' },
  { device: 'desktop-chromium', lang: 'en', theme: 'dark' },
  { device: 'tablet-webkit', lang: 'pt', theme: 'light' },
  { device: 'iphone-webkit', lang: 'en', theme: 'light' },
  { device: 'desktop-chromium', lang: 'pt', theme: 'light' },
  { device: 'tablet-webkit', lang: 'en', theme: 'dark' },
  { device: 'iphone-webkit', lang: 'pt', theme: 'light' },
  { device: 'desktop-chromium', lang: 'en', theme: 'light' },
  { device: 'tablet-webkit', lang: 'pt', theme: 'dark' },
  { device: 'iphone-webkit', lang: 'en', theme: 'dark' },
  { device: 'desktop-chromium', lang: 'pt', theme: 'dark' },
  { device: 'tablet-webkit', lang: 'en', theme: 'light' },
]

function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const value = (name: string, fallback: number) => {
    const inline = argv.find(arg => arg.startsWith(`--${name}=`))
    if (inline) return Number(inline.split('=')[1])
    const index = argv.indexOf(`--${name}`)
    return index >= 0 ? Number(argv[index + 1]) : fallback
  }
  const stringValue = (name: string, fallback = '') => {
    const inline = argv.find(arg => arg.startsWith(`--${name}=`))
    if (inline) return inline.slice(name.length + 3)
    const index = argv.indexOf(`--${name}`)
    return index >= 0 ? String(argv[index + 1] || fallback) : fallback
  }

  const requestedMode = stringValue('mode', process.env.HP_AUDIT_MODE || 'smart').toLowerCase()
  const mode: AuditMode = requestedMode === 'full' || requestedMode === 'smoke' ? requestedMode : 'smart'

  return {
    cycles: Math.max(0, value('cycles', 0)),
    mode,
    minutes: Math.max(0, value('minutes', 240)),
    batch: Math.min(PHASE_COUNT, Math.max(1, value('batch', 1))),
    start: Math.max(0, value('start', 0)) % PHASE_COUNT,
    url: stringValue('url', process.env.HP_AUDIT_BASE_URL || ''),
    fresh: argv.includes('--fresh'),
    environmentOffset: Math.max(0, value('environment-offset', Number(process.env.HP_AUDIT_ENVIRONMENT_OFFSET || 0))),
  }
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv): CommandResult {
  const startedAtMs = Date.now()
  const startedAt = new Date(startedAtMs).toISOString()
  const result: SpawnSyncReturns<Buffer> = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    env,
  })
  const finishedAtMs = Date.now()

  return {
    status: result.status ?? 1,
    signal: result.signal,
    error: result.error?.message,
    startedAt,
    finishedAt: new Date(finishedAtMs).toISOString(),
    durationMs: finishedAtMs - startedAtMs,
  }
}

function readJson(file: string): any {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function writeJson(file: string, value: unknown) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function hash(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

function stripAnsi(value: string) {
  return value.replace(/\u001b\[[0-9;]*m/g, '')
}

function normalizeFailureSignature(title: string, message: string) {
  const normalizedTitle = title.replace(/phase\s+\d+/gi, 'phase #')
  const normalizedMessage = stripAnsi(message)
    .replace(/[A-Z]:\\[^\n]+?app\.audit\.spec\.ts/gi, '<audit-file>')
    .replace(/\/[^\n]+?app\.audit\.spec\.ts/gi, '<audit-file>')
    .replace(/phase\s+\d+/gi, 'phase #')
    .replace(/cycle\s+\d+/gi, 'cycle #')
    .replace(/\b\d+ms\b/g, '<duration>')
    .replace(/\s+at\s+.*app\.audit\.spec\.ts[^\n]*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  return `${normalizedTitle}|${normalizedMessage}`
}

function extractAffectedPhases(value: string) {
  return Array.from(
    new Set(
      Array.from(value.matchAll(/phase\s+(\d+)/gi), match => Number(match[1]))
        .filter(number => Number.isInteger(number)),
    ),
  ).sort((a, b) => a - b)
}

function environmentKey(environment: AuditEnvironment) {
  return `${environment.device}/${environment.lang}/${environment.theme}`
}

function decodeSummaryAttachment(result: any): DeepAuditSummary | null {
  const attachment = (result?.attachments || []).find((item: any) => item?.name === 'deep-audit-summary' && item?.body)
  if (!attachment) return null

  try {
    const decoded = Buffer.from(String(attachment.body), 'base64').toString('utf8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function makePlaywrightIssue(
  cycle: number,
  environment: AuditEnvironment,
  title: string,
  message: string,
  metadata: Record<string, unknown>,
  fallbackPhases: number[] = [],
): AggregatedIssue {
  const cleanMessage = stripAnsi(message)
  const signature = normalizeFailureSignature(title, cleanMessage)
  const now = new Date().toISOString()
  const phases = extractAffectedPhases(`${title}\n${cleanMessage}`)

  return {
    fingerprint: `visual-${hash(signature)}`,
    source: 'playwright',
    cycle,
    firstSeen: now,
    lastSeen: now,
    occurrences: 1,
    details: {
      title,
      affectedTests: [title],
      affectedPhases: phases.length > 0 ? phases : fallbackPhases,
      environments: [environmentKey(environment)],
      message: cleanMessage,
      ...metadata,
    },
  }
}

function playwrightIssues(payload: any, cycle: number, environment: AuditEnvironment): AggregatedIssue[] {
  const issues: AggregatedIssue[] = []
  const suites = payload?.suites || []

  const walk = (nodes: any[], trail: string[]) => {
    for (const node of nodes) {
      const nextTrail = node.title ? [...trail, node.title] : trail

      for (const spec of node.specs || []) {
        for (const currentTest of spec.tests || []) {
          const result = (currentTest.results || []).at(-1)
          if (!result || result.status === 'passed' || result.status === 'skipped') continue

          const summary = decodeSummaryAttachment(result)
          const failures = summary?.failures?.filter(item => item?.step || item?.message) || []
          const fallbackPhases = summary?.phaseIds || []

          if (failures.length > 0) {
            for (const failure of failures) {
              const title = String(failure.step || spec.title || 'Deep audit step failed')
              const message = String(failure.message || result.error?.message || result.status)
              issues.push(makePlaywrightIssue(cycle, environment, title, message, {
                trail: nextTrail,
                status: result.status,
                attempts: currentTest.results?.length || 1,
                summaryLanguage: summary?.language,
                summaryTheme: summary?.theme,
              }, fallbackPhases))
            }
          } else {
            const message = String(result.error?.message || result.status)
            issues.push(makePlaywrightIssue(cycle, environment, String(spec.title || 'Playwright test failed'), message, {
              trail: nextTrail,
              status: result.status,
              attempts: currentTest.results?.length || 1,
            }))
          }
        }
      }

      walk(node.suites || [], nextTrail)
    }
  }

  walk(suites, [])
  return issues
}

function contentIssues(payload: any, cycle: number, environment: AuditEnvironment): AggregatedIssue[] {
  const now = new Date().toISOString()

  return (payload?.issues || []).map((issue: any) => ({
    fingerprint: `content-${issue.fingerprint}`,
    source: 'content',
    cycle,
    firstSeen: now,
    lastSeen: now,
    occurrences: 1,
    details: {
      ...issue,
      environments: [environmentKey(environment)],
    },
  }))
}

function runnerIssue(
  cycle: number,
  source: string,
  title: string,
  message: string,
  metadata: Record<string, unknown>,
): AggregatedIssue {
  const signature = `${source}|${title}|${message}`
  const now = new Date().toISOString()

  return {
    fingerprint: `runner-${hash(signature)}`,
    source,
    cycle,
    firstSeen: now,
    lastSeen: now,
    occurrences: 1,
    details: { title, message, ...metadata },
  }
}

function fileIsFresh(file: string, startedAtIso: string) {
  if (!fs.existsSync(file)) return false
  const startedAt = Date.parse(startedAtIso)
  const modifiedAt = fs.statSync(file).mtimeMs
  return Number.isFinite(startedAt) && modifiedAt >= startedAt - 1_000
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )
}

function writeHtml(file: string, data: any) {
  const issueRows = Object.values(data.issues as Record<string, AggregatedIssue>)
    .map((issue: any) => `<tr><td>${escapeHtml(issue.source)}</td><td>${issue.cycle}</td><td>${issue.occurrences}</td><td><code>${escapeHtml(issue.fingerprint)}</code></td><td><pre>${escapeHtml(JSON.stringify(issue.details, null, 2))}</pre></td></tr>`)
    .join('')

  const cycleRows = (data.cycles || [])
    .map((cycle: any) => {
      const phases = Array.isArray(cycle.phaseIds) ? cycle.phaseIds.join(', ') : `${cycle.phaseStart}-${cycle.phaseEnd}`
      return `<tr><td>${cycle.number}</td><td>${escapeHtml(phases)}</td><td>${escapeHtml(cycle.depth || 'deep')}</td><td>${escapeHtml(cycle.reason || 'legacy')}</td><td>${cycle.lang}</td><td>${cycle.theme}</td><td>${escapeHtml(cycle.device)}</td><td>${cycle.contentExitCode}</td><td>${cycle.visualExitCode}</td><td>${cycle.visualResultsFresh ? 'yes' : 'no'}</td><td>${cycle.newIssues}</td><td>${cycle.knownIssues}</td><td>${cycle.durationSeconds}s</td></tr>`
    })
    .join('')

  const lastRun = data.lastRun || {}
  const v11 = data.v11Readiness?.summary || {}
  fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><title>Hashtag Python Audit</title><style>body{font-family:system-ui;margin:24px;background:#0b0b16;color:#eee}table{border-collapse:collapse;width:100%;margin:16px 0}th,td{border:1px solid #34344d;padding:8px;vertical-align:top}th{background:#1b1732}pre{white-space:pre-wrap;max-width:900px}code{color:#c4b5fd}.ok{color:#4ade80}.warn{color:#fbbf24}</style></head><body><h1>Hashtag Python — Auditor Autopilot</h1><p>Version: ${escapeHtml(data.auditorVersion || 'unknown')} · Run ID: ${escapeHtml(data.runId || 'unknown')} · Generated: ${escapeHtml(data.updatedAt || '')}</p><p>Target: ${escapeHtml(data.target || '')}</p><p>Status: <strong>${escapeHtml(data.status || 'unknown')}</strong> · Mode: ${escapeHtml(lastRun.mode || data.plan?.mode || 'legacy')} · This run: ${Number(lastRun.completedCycles || 0)}/${Number(lastRun.requestedCycles || 0)} cycles · Stop reason: ${escapeHtml(lastRun.stopReason || 'running')}</p><p>Plan: ${Number(data.plan?.cursor || 0)}/${Number(data.plan?.entries?.length || 0)} · Pending confirmations: ${Number(data.focusQueue?.length || 0)} · Total cycles stored: ${data.cycles.length} · Phase visits: ${Number(data.phaseVisits || 0)} · Unique issues: <strong>${Object.keys(data.issues).length}</strong></p><p>V11 diagnostic: ${Number(v11.fullyReady || 0)}/${Number(v11.totalPhases || 0)} fully migrated · density ${Number(v11.phasesMeetingDensity || 0)}/${Number(v11.totalPhases || 0)} · exercise volume ${Number(v11.phasesMeetingExerciseVolume || 0)}/${Number(v11.totalPhases || 0)} · contains-free ${Number(v11.phasesWithoutContainsChecks || 0)}/${Number(v11.totalPhases || 0)}</p><h2>Cycles</h2><table><thead><tr><th>#</th><th>Phases</th><th>Depth</th><th>Reason</th><th>Lang</th><th>Theme</th><th>Device</th><th>Content exit</th><th>Visual exit</th><th>Fresh results</th><th>New</th><th>Known</th><th>Duration</th></tr></thead><tbody>${cycleRows}</tbody></table><h2>Deduplicated issues</h2><table><thead><tr><th>Source</th><th>First cycle</th><th>Occurrences</th><th>Fingerprint</th><th>Details</th></tr></thead><tbody>${issueRows}</tbody></table></body></html>`, 'utf8')
}

function mergeIssue(existing: AggregatedIssue, incoming: AggregatedIssue) {
  existing.lastSeen = incoming.lastSeen
  existing.occurrences += 1

  const current = existing.details
  const next = incoming.details
  const mergeList = (key: string) => {
    const merged = Array.from(new Set([
      ...((current[key] as unknown[]) || []),
      ...((next[key] as unknown[]) || []),
    ]))
    if (merged.length > 0) current[key] = merged
  }

  mergeList('affectedTests')
  mergeList('affectedPhases')
  mergeList('environments')
  if (next.message && next.message !== current.message) current.latestMessage = next.message
  current.lastCycle = incoming.cycle
}

const args = parseArgs()
const reportDir = path.resolve('playwright-report/autopilot')
const stateFile = path.join(reportDir, 'state.json')
const stopFile = path.resolve('.autopilot-stop-after-cycle')
const runId = new Date().toISOString().replace(/[:.]/g, '-')
const planSignature = auditPlanSignature(args.mode, args.batch, args.environmentOffset)

if (args.fresh) fs.rmSync(reportDir, { recursive: true, force: true })
fs.mkdirSync(reportDir, { recursive: true })

const state: any = readJson(stateFile) || {
  auditorVersion: AUDITOR_VERSION,
  runId,
  target: args.url,
  startedAt: new Date().toISOString(),
  updatedAt: '',
  status: 'idle',
  phaseVisits: 0,
  cycles: [],
  issues: {},
  focusQueue: [],
}

state.auditorVersion = AUDITOR_VERSION
state.runId = args.fresh ? runId : state.runId || runId
state.target = args.url
state.environmentOffset = args.environmentOffset
state.cycles ||= []
state.issues ||= {}
state.focusQueue ||= []
state.inFlight ||= null
state.phaseVisits = Number.isFinite(state.phaseVisits)
  ? state.phaseVisits
  : state.cycles.reduce((total: number, cycle: any) => total + (Array.isArray(cycle.phaseIds) ? cycle.phaseIds.length : Math.max(1, Number(cycle.phaseEnd) - Number(cycle.phaseStart) + 1)), 0)

if (!state.plan || state.plan.signature !== planSignature || args.fresh) {
  state.plan = {
    signature: planSignature,
    mode: args.mode,
    batch: args.batch,
    environmentOffset: args.environmentOffset,
    entries: buildAuditPlan(args.mode, args.batch, args.environmentOffset),
    cursor: 0,
    createdAt: new Date().toISOString(),
  }
  state.focusQueue = []
  state.inFlight = null
}

const startedAtMs = Date.now()
const startedAt = new Date(startedAtMs).toISOString()
const deadline = args.minutes > 0 ? startedAtMs + args.minutes * 60_000 : Number.POSITIVE_INFINITY
const cycleCountAtStart = state.cycles.length
const baselineRemainingAtStart = Math.max(0, state.plan.entries.length - state.plan.cursor)
const queuedAtStart = state.focusQueue.length
const automaticRun = args.cycles === 0
const requestedCyclesAtStart = automaticRun ? baselineRemainingAtStart + queuedAtStart : args.cycles
let completedThisRun = 0
let stopReason = 'running'

state.status = 'running'
state.lastRun = {
  startedAt,
  requestedCycles: requestedCyclesAtStart,
  completedCycles: 0,
  cycleCountAtStart,
  cycleCountAtFinish: cycleCountAtStart,
  status: 'running',
  stopReason,
  mode: args.mode,
  planSignature,
  baselineRemainingAtStart,
  confirmationsQueuedAtStart: queuedAtStart,
}
state.updatedAt = new Date().toISOString()
writeJson(stateFile, state)
writeHtml(path.join(reportDir, 'index.html'), state)

// Content checks are source-level and independent from browser/device settings.
// Run them once per invocation instead of repeating the same full scan in every cycle.
const contentOutput = path.join(reportDir, 'content.json')
const contentEnvironment = AUDIT_ENVIRONMENTS[args.environmentOffset % AUDIT_ENVIRONMENTS.length]
const contentEnv = {
  ...process.env,
  HP_AUDIT_PHASE_START: '0',
  HP_AUDIT_PHASE_COUNT: String(PHASE_COUNT),
  HP_AUDIT_CONTENT_OUTPUT: contentOutput,
}
const contentRun = run(process.execPath, ['--import', 'tsx', 'audit/content-audit.ts'], contentEnv)
const contentPayload = readJson(contentOutput)
const contentFound = contentPayload
  ? contentIssues(contentPayload, 0, contentEnvironment)
  : [runnerIssue(0, 'content-runner', 'Content audit did not produce a result file', contentRun.error || `Process exited with code ${contentRun.status}`, {
      exitCode: contentRun.status,
      startedAt: contentRun.startedAt,
      finishedAt: contentRun.finishedAt,
      outputFile: contentOutput,
    })]

for (const issue of contentFound) {
  const existing = state.issues[issue.fingerprint] as AggregatedIssue | undefined
  if (existing) mergeIssue(existing, issue)
  else {
    issue.details.firstCycle = 0
    issue.details.lastCycle = 0
    state.issues[issue.fingerprint] = issue
  }
}
state.contentGate = {
  exitCode: contentRun.status,
  durationMs: contentRun.durationMs,
  issueCount: contentFound.length,
  outputFile: contentOutput,
  finishedAt: contentRun.finishedAt,
}

// V11 rules are diagnostic while the legacy curriculum is migrated world by world.
// They enrich the overnight report without blocking visual coverage prematurely.
const v11Output = path.join(reportDir, 'v11-readiness.json')
const v11Run = run(process.execPath, ['--import', 'tsx', 'audit/v11-readiness.ts'], {
  ...process.env,
  HP_V11_READINESS_OUTPUT: v11Output,
})
const v11Payload = readJson(v11Output)
state.v11Readiness = {
  exitCode: v11Run.status,
  durationMs: v11Run.durationMs,
  outputFile: v11Output,
  finishedAt: v11Run.finishedAt,
  summary: v11Payload?.summary || null,
  enforcement: v11Payload?.enforcement || 'diagnostic-only',
}

state.updatedAt = new Date().toISOString()
writeJson(stateFile, state)
writeHtml(path.join(reportDir, 'index.html'), state)

function nextPlanEntry(): { entry: AuditPlanEntry; source: 'focus' | 'baseline' } | null {
  if (state.inFlight?.entry) return state.inFlight
  if (state.focusQueue.length > 0) return { entry: state.focusQueue[0], source: 'focus' }
  if (state.plan.cursor >= state.plan.entries.length) return null
  return { entry: state.plan.entries[state.plan.cursor] as AuditPlanEntry, source: 'baseline' }
}

function queueConfirmation(entry: AuditPlanEntry, fingerprints: string[]) {
  if (args.mode !== 'smart' || entry.reason === 'confirm-new-issue' || fingerprints.length === 0) return

  const unscheduled = fingerprints.filter(fingerprint => {
    const issue = state.issues[fingerprint] as AggregatedIssue | undefined
    return issue && issue.source === 'playwright' && issue.details.confirmationStatus === undefined
  })
  if (unscheduled.length === 0) return

  const key = `${entry.environmentIndex}|${entry.phaseIds.join(',')}|${unscheduled.sort().join(',')}`
  const alreadyQueued = state.focusQueue.some((candidate: AuditPlanEntry & { confirmationKey?: string }) => candidate.confirmationKey === key)
  if (alreadyQueued) return

  for (const fingerprint of unscheduled) {
    const issue = state.issues[fingerprint] as AggregatedIssue
    issue.details.confirmationStatus = 'queued'
  }

  state.focusQueue.push({
    id: `confirm-${Date.now()}-${entry.environmentIndex}-${entry.phaseIds.join('.')}`,
    phaseIds: [...entry.phaseIds],
    environmentIndex: entry.environmentIndex,
    depth: 'deep',
    reason: 'confirm-new-issue',
    confirmFingerprints: unscheduled,
    confirmationKey: key,
  })
  if (automaticRun) state.lastRun.requestedCycles += 1
}

while (true) {
  if (!automaticRun && completedThisRun >= args.cycles) {
    stopReason = 'requested-cycles-complete'
    break
  }
  if (Date.now() >= deadline) {
    stopReason = 'deadline-reached'
    break
  }
  if (fs.existsSync(stopFile)) {
    console.log('Graceful stop requested. Ending before the next cycle.')
    fs.rmSync(stopFile, { force: true })
    stopReason = 'graceful-stop'
    break
  }

  const selected = nextPlanEntry()
  if (!selected) {
    stopReason = 'audit-plan-complete'
    break
  }

  const { entry, source: entrySource } = selected
  state.inFlight = { entry, source: entrySource, selectedAt: new Date().toISOString() }
  state.updatedAt = new Date().toISOString()
  writeJson(stateFile, state)

  const cycle = state.cycles.length + 1
  const cycleStart = Date.now()
  const environment = AUDIT_ENVIRONMENTS[entry.environmentIndex]
  const { lang, theme, device } = environment
  const phaseStart = Math.min(...entry.phaseIds)
  const phaseEnd = Math.max(...entry.phaseIds)

  const cycleDir = path.join(reportDir, 'cycles', `cycle-${String(cycle).padStart(3, '0')}`)
  fs.rmSync(cycleDir, { recursive: true, force: true })
  fs.mkdirSync(cycleDir, { recursive: true })

  const visualOutput = path.join(cycleDir, 'results.json')
  const htmlOutput = path.join(cycleDir, 'html')
  const artifactsOutput = path.join(cycleDir, 'artifacts')

  const env = {
    ...process.env,
    ...(args.url ? { HP_AUDIT_BASE_URL: args.url } : {}),
    HP_AUDIT_PHASE_START: String(phaseStart),
    HP_AUDIT_PHASE_COUNT: String(entry.phaseIds.length),
    HP_AUDIT_PHASE_IDS: entry.phaseIds.join(','),
    HP_AUDIT_LANG: lang,
    HP_AUDIT_THEME: theme,
    HP_AUDIT_DEPTH: entry.depth,
    HP_AUDIT_MODE: args.mode,
    HP_AUDIT_RESULTS_OUTPUT: visualOutput,
    HP_AUDIT_HTML_OUTPUT: htmlOutput,
    HP_AUDIT_ARTIFACTS_OUTPUT: artifactsOutput,
    HP_AUDIT_STORAGE_STATE: path.join(reportDir, 'auth-state.json'),
    HP_AUDIT_REQUIRE_LOGIN: 'true',
    HP_AUDIT_CYCLE: String(cycle),
    HP_AUDIT_LIVE_STATUS: path.join(reportDir, 'live-status.txt'),
    HP_AUDIT_HEADED: process.env.HP_AUDIT_HEADED || 'false',
    HP_AUDIT_SLOW_MO: process.env.HP_AUDIT_SLOW_MO || '0',
    HP_AUDIT_RETRIES: process.env.HP_AUDIT_RETRIES || (args.mode === 'full' ? '1' : '0'),
    HP_AUDIT_DETAILED: process.env.HP_AUDIT_DETAILED || 'false',
    HP_AUDIT_EXPECT_VERSION: process.env.HP_AUDIT_EXPECT_VERSION || process.env.npm_package_version || '',
  }

  console.log(`\n=== Cycle ${cycle}: phases ${entry.phaseIds.join(',')}, ${lang}, ${theme}, ${device}, ${entry.depth}, ${entry.reason} ===`)

  const playwrightCli = path.resolve('node_modules/@playwright/test/cli.js')
  const visualRun = run(process.execPath, [playwrightCli, 'test', '--project', device], env)
  const found: AggregatedIssue[] = []
  const visualPayload = readJson(visualOutput)
  const visualResultsFresh = fileIsFresh(visualOutput, visualRun.startedAt)

  if (visualPayload && visualResultsFresh) {
    found.push(...playwrightIssues(visualPayload, cycle, environment))
  } else {
    found.push(runnerIssue(cycle, 'playwright-runner', visualPayload ? 'Playwright result file was stale' : 'Playwright did not produce a result file', visualRun.error || `Process exited with code ${visualRun.status}`, {
      exitCode: visualRun.status,
      signal: visualRun.signal,
      startedAt: visualRun.startedAt,
      finishedAt: visualRun.finishedAt,
      outputFile: visualOutput,
      outputFileExists: fs.existsSync(visualOutput),
      outputFileFresh: visualResultsFresh,
      target: args.url,
      affectedPhases: entry.phaseIds,
      environments: [environmentKey(environment)],
    }))
  }

  let newIssues = 0
  let knownIssues = 0
  const newFingerprints: string[] = []
  for (const issue of found) {
    const existing = state.issues[issue.fingerprint] as AggregatedIssue | undefined
    if (existing) {
      mergeIssue(existing, issue)
      knownIssues += 1
    } else {
      issue.details.firstCycle = cycle
      issue.details.lastCycle = cycle
      state.issues[issue.fingerprint] = issue
      newIssues += 1
      newFingerprints.push(issue.fingerprint)
    }
  }

  if (entry.confirmFingerprints?.length) {
    const reproduced = new Set(found.map(issue => issue.fingerprint))
    for (const fingerprint of entry.confirmFingerprints) {
      const issue = state.issues[fingerprint] as AggregatedIssue | undefined
      if (!issue) continue
      issue.details.confirmationStatus = reproduced.has(fingerprint) ? 'confirmed' : 'not-reproduced'
      issue.details.confirmationCycle = cycle
      if (!reproduced.has(fingerprint)) issue.details.possibleFlake = true
    }
  }

  queueConfirmation(entry, newFingerprints)

  state.cycles.push({
    number: cycle,
    phaseIds: entry.phaseIds,
    phaseStart,
    phaseEnd,
    lang,
    theme,
    device,
    environmentIndex: entry.environmentIndex,
    depth: entry.depth,
    reason: entry.reason,
    newIssues,
    knownIssues,
    contentExitCode: contentRun.status,
    visualExitCode: visualRun.status,
    visualResultsFresh,
    contentDurationMs: cycle === cycleCountAtStart + 1 ? contentRun.durationMs : 0,
    visualDurationMs: visualRun.durationMs,
    durationSeconds: Math.max(1, Math.round((Date.now() - cycleStart) / 1000)),
    cycleDir,
  })

  if (entrySource === 'focus') {
    const queuedIndex = state.focusQueue.findIndex((candidate: AuditPlanEntry) => candidate.id === entry.id)
    if (queuedIndex >= 0) state.focusQueue.splice(queuedIndex, 1)
  } else {
    state.plan.cursor += 1
  }
  state.inFlight = null
  state.phaseVisits = Number(state.phaseVisits || 0) + entry.phaseIds.length
  completedThisRun += 1
  state.lastRun.completedCycles = completedThisRun
  state.lastRun.cycleCountAtFinish = state.cycles.length
  state.lastRun.planCursor = state.plan.cursor
  state.lastRun.planEntries = state.plan.entries.length
  state.lastRun.confirmationsPending = state.focusQueue.length
  state.updatedAt = new Date().toISOString()
  writeJson(stateFile, state)
  writeHtml(path.join(reportDir, 'index.html'), state)

  const elapsedMs = Date.now() - startedAtMs
  const averageMs = elapsedMs / completedThisRun
  const baselineRemaining = Math.max(0, state.plan.entries.length - state.plan.cursor)
  const remainingCycles = baselineRemaining + state.focusQueue.length
  const etaMinutes = Math.max(0, Math.round((averageMs * remainingCycles) / 60_000))
  console.log(`Cycle complete. New issues: ${newIssues}; known occurrences: ${knownIssues}; confirmations queued: ${state.focusQueue.length}.`)
  console.log(`Progress: ${completedThisRun} cycle(s) this run · plan ${state.plan.cursor}/${state.plan.entries.length} · average ${Math.max(1, Math.round(averageMs / 1000))}s/cycle · estimated ${etaMinutes} min remaining.`)
}

const baselineComplete = state.plan.cursor >= state.plan.entries.length
const confirmationsComplete = state.focusQueue.length === 0
const automaticComplete = automaticRun && baselineComplete && confirmationsComplete
const explicitComplete = !automaticRun && completedThisRun >= args.cycles
const status = automaticComplete || explicitComplete ? 'completed' : 'interrupted'
if (stopReason === 'running') stopReason = status === 'completed' ? 'audit-plan-complete' : 'interrupted'
state.status = status
state.lastRun = {
  ...state.lastRun,
  finishedAt: new Date().toISOString(),
  completedCycles: completedThisRun,
  cycleCountAtFinish: state.cycles.length,
  status,
  stopReason,
  baselineComplete,
  confirmationsComplete,
  planCursor: state.plan.cursor,
  planEntries: state.plan.entries.length,
  confirmationsPending: state.focusQueue.length,
}
state.updatedAt = new Date().toISOString()
writeJson(stateFile, state)
writeHtml(path.join(reportDir, 'index.html'), state)

console.log(`\nAutopilot v${AUDITOR_VERSION} ${status}. Mode: ${args.mode}. This run: ${completedThisRun} cycle(s). Plan: ${state.plan.cursor}/${state.plan.entries.length}. Pending confirmations: ${state.focusQueue.length}. Stop reason: ${stopReason}. Report: ${path.join(reportDir, 'index.html')}`)
