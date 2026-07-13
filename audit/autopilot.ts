import { spawnSync, type SpawnSyncReturns } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const AUDITOR_VERSION = '7.6.0'

interface Args {
  cycles: number
  minutes: number
  batch: number
  start: number
  url: string
  fresh: boolean
}

interface AggregatedIssue {
  fingerprint: string
  source: string
  cycle: number
  firstSeen: string
  lastSeen: string
  occurrences: number
  details: unknown
}

interface CommandResult {
  status: number
  signal: NodeJS.Signals | null
  error?: string
  startedAt: string
  finishedAt: string
  durationMs: number
}

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

  return {
    cycles: value('cycles', 40),
    minutes: value('minutes', 240),
    batch: value('batch', 2),
    start: value('start', 0),
    url: stringValue('url', process.env.HP_AUDIT_BASE_URL || ''),
    fresh: argv.includes('--fresh'),
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
    .replace(/phase\s+\d+/gi, 'phase #')
    .replace(/\b\d+ms\b/g, '<duration>')
    .replace(/\s+/g, ' ')
    .trim()

  return `${normalizedTitle}|${normalizedMessage}`
}

function playwrightIssues(payload: any, cycle: number): AggregatedIssue[] {
  const issues: AggregatedIssue[] = []
  const suites = payload?.suites || []

  const walk = (nodes: any[], trail: string[]) => {
    for (const node of nodes) {
      const nextTrail = node.title ? [...trail, node.title] : trail

      for (const spec of node.specs || []) {
        for (const test of spec.tests || []) {
          for (const result of test.results || []) {
            if (result.status === 'passed' || result.status === 'skipped') continue

            const message = result.error?.message || result.status
            const signature = normalizeFailureSignature(spec.title, message)
            const now = new Date().toISOString()

            issues.push({
              fingerprint: `visual-${hash(signature)}`,
              source: 'playwright',
              cycle,
              firstSeen: now,
              lastSeen: now,
              occurrences: 1,
              details: {
                title: spec.title,
                affectedTests: [spec.title],
                trail: nextTrail,
                status: result.status,
                message: stripAnsi(message),
              },
            })
          }
        }
      }

      walk(node.suites || [], nextTrail)
    }
  }

  walk(suites, [])
  return issues
}

function contentIssues(payload: any, cycle: number): AggregatedIssue[] {
  const now = new Date().toISOString()

  return (payload?.issues || []).map((issue: any) => ({
    fingerprint: `content-${issue.fingerprint}`,
    source: 'content',
    cycle,
    firstSeen: now,
    lastSeen: now,
    occurrences: 1,
    details: issue,
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
    details: {
      title,
      message,
      ...metadata,
    },
  }
}

function fileIsFresh(file: string, startedAtIso: string) {
  if (!fs.existsSync(file)) return false

  const startedAt = Date.parse(startedAtIso)
  const modifiedAt = fs.statSync(file).mtimeMs
  return Number.isFinite(startedAt) && modifiedAt >= startedAt - 1_000
}

function writeHtml(file: string, data: any) {
  const rows = Object.values(data.issues as Record<string, AggregatedIssue>)
    .map(
      (issue: any) =>
        `<tr><td>${escapeHtml(issue.source)}</td><td>${issue.cycle}</td><td>${issue.occurrences}</td><td><code>${escapeHtml(issue.fingerprint)}</code></td><td><pre>${escapeHtml(JSON.stringify(issue.details, null, 2))}</pre></td></tr>`,
    )
    .join('')

  const cycles = data.cycles
    .map(
      (cycle: any) =>
        `<tr><td>${cycle.number}</td><td>${cycle.phaseStart}-${cycle.phaseEnd}</td><td>${cycle.lang}</td><td>${cycle.theme}</td><td>${escapeHtml(cycle.device)}</td><td>${cycle.contentExitCode}</td><td>${cycle.visualExitCode}</td><td>${cycle.visualResultsFresh ? 'yes' : 'no'}</td><td>${cycle.newIssues}</td><td>${cycle.knownIssues}</td><td>${cycle.durationSeconds}s</td></tr>`,
    )
    .join('')

  fs.writeFileSync(
    file,
    `<!doctype html><html><head><meta charset="utf-8"><title>Hashtag Python Audit</title><style>body{font-family:system-ui;margin:24px;background:#0b0b16;color:#eee}table{border-collapse:collapse;width:100%;margin:16px 0}th,td{border:1px solid #34344d;padding:8px;vertical-align:top}th{background:#1b1732}pre{white-space:pre-wrap;max-width:900px}code{color:#c4b5fd}.ok{color:#4ade80}.warn{color:#fbbf24}</style></head><body><h1>Hashtag Python — Auditor Autopilot</h1><p>Version: ${escapeHtml(data.auditorVersion || 'unknown')} · Run ID: ${escapeHtml(data.runId || 'unknown')} · Generated: ${escapeHtml(data.updatedAt || '')}</p><p>Target: ${escapeHtml(data.target || '')}</p><p>Cycles: ${data.cycles.length} · Unique issues: <strong>${Object.keys(data.issues).length}</strong></p><h2>Cycles</h2><table><thead><tr><th>#</th><th>Phases</th><th>Lang</th><th>Theme</th><th>Device</th><th>Content exit</th><th>Visual exit</th><th>Fresh results</th><th>New</th><th>Known</th><th>Duration</th></tr></thead><tbody>${cycles}</tbody></table><h2>Deduplicated issues</h2><table><thead><tr><th>Source</th><th>First cycle</th><th>Occurrences</th><th>Fingerprint</th><th>Details</th></tr></thead><tbody>${rows}</tbody></table></body></html>`,
  )
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    char =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]!,
  )
}

const args = parseArgs()
const reportDir = path.resolve('playwright-report/autopilot')
const stateFile = path.join(reportDir, 'state.json')
const runId = new Date().toISOString().replace(/[:.]/g, '-')

if (args.fresh) {
  fs.rmSync(reportDir, { recursive: true, force: true })
}

fs.mkdirSync(reportDir, { recursive: true })

const state =
  readJson(stateFile) || {
    auditorVersion: AUDITOR_VERSION,
    runId,
    target: args.url,
    startedAt: new Date().toISOString(),
    updatedAt: '',
    cursor: args.start,
    cycles: [],
    issues: {},
  }

state.auditorVersion = AUDITOR_VERSION
state.runId = args.fresh ? runId : state.runId || runId
state.target = args.url

const started = Date.now()
const deadline =
  args.minutes > 0
    ? started + args.minutes * 60_000
    : Number.POSITIVE_INFINITY

for (
  let iteration = 1;
  iteration <= args.cycles && Date.now() < deadline;
  iteration += 1
) {
  const cycle = state.cycles.length + 1
  const cycleStart = Date.now()
  const phaseStart = state.cursor % 69
  const phaseCount = Math.min(args.batch, 69 - phaseStart)
  const lang = cycle % 2 === 0 ? 'en' : 'pt'
  const theme = cycle % 3 === 0 ? 'light' : 'dark'
  const device =
    cycle % 3 === 1
      ? 'iphone-chromium'
      : cycle % 3 === 2
        ? 'desktop-chromium'
        : 'tablet-chromium'

  if (fs.existsSync(path.resolve('.autopilot-stop-after-cycle'))) {
    console.log('Graceful stop requested. Ending before the next cycle.')
    fs.rmSync(path.resolve('.autopilot-stop-after-cycle'), { force: true })
    break
  }

  const cycleDir = path.join(
    reportDir,
    'cycles',
    `cycle-${String(cycle).padStart(3, '0')}`,
  )
  fs.rmSync(cycleDir, { recursive: true, force: true })
  fs.mkdirSync(cycleDir, { recursive: true })

  const contentOutput = path.join(cycleDir, 'content.json')
  const visualOutput = path.join(cycleDir, 'results.json')
  const htmlOutput = path.join(cycleDir, 'html')
  const artifactsOutput = path.join(cycleDir, 'artifacts')

  const env = {
    ...process.env,
    ...(args.url ? { HP_AUDIT_BASE_URL: args.url } : {}),
    HP_AUDIT_PHASE_START: String(phaseStart),
    HP_AUDIT_PHASE_COUNT: String(phaseCount),
    HP_AUDIT_LANG: lang,
    HP_AUDIT_THEME: theme,
    HP_AUDIT_CONTENT_OUTPUT: contentOutput,
    HP_AUDIT_RESULTS_OUTPUT: visualOutput,
    HP_AUDIT_HTML_OUTPUT: htmlOutput,
    HP_AUDIT_ARTIFACTS_OUTPUT: artifactsOutput,
    HP_AUDIT_REQUIRE_LOGIN: 'true',
    HP_AUDIT_CYCLE: String(cycle),
    HP_AUDIT_LIVE_STATUS: path.join(reportDir, 'live-status.txt'),
    HP_AUDIT_HEADED: process.env.HP_AUDIT_HEADED || 'false',
    HP_AUDIT_SLOW_MO: process.env.HP_AUDIT_SLOW_MO || '0',
  }

  console.log(
    `\n=== Cycle ${cycle}: phases ${phaseStart}-${phaseStart + phaseCount - 1}, ${lang}, ${theme}, ${device} ===`,
  )

  const contentRun = run(
    process.execPath,
    ['--import', 'tsx', 'audit/content-audit.ts'],
    env,
  )

  const playwrightCli = path.resolve(
    'node_modules/@playwright/test/cli.js',
  )
  const visualRun = run(
    process.execPath,
    [playwrightCli, 'test', '--project', device],
    env,
  )

  const found: AggregatedIssue[] = []

  const contentPayload = readJson(contentOutput)
  if (contentPayload) {
    found.push(...contentIssues(contentPayload, cycle))
  } else {
    found.push(
      runnerIssue(
        cycle,
        'content-runner',
        'Content audit did not produce a result file',
        contentRun.error || `Process exited with code ${contentRun.status}`,
        {
          exitCode: contentRun.status,
          startedAt: contentRun.startedAt,
          finishedAt: contentRun.finishedAt,
          outputFile: contentOutput,
        },
      ),
    )
  }

  const visualPayload = readJson(visualOutput)
  const visualResultsFresh = fileIsFresh(
    visualOutput,
    visualRun.startedAt,
  )

  if (visualPayload && visualResultsFresh) {
    found.push(...playwrightIssues(visualPayload, cycle))
  } else {
    found.push(
      runnerIssue(
        cycle,
        'playwright-runner',
        visualPayload
          ? 'Playwright result file was stale'
          : 'Playwright did not produce a result file',
        visualRun.error || `Process exited with code ${visualRun.status}`,
        {
          exitCode: visualRun.status,
          signal: visualRun.signal,
          startedAt: visualRun.startedAt,
          finishedAt: visualRun.finishedAt,
          outputFile: visualOutput,
          outputFileExists: fs.existsSync(visualOutput),
          outputFileFresh: visualResultsFresh,
          target: args.url,
          device,
        },
      ),
    )
  }

  let newIssues = 0
  let knownIssues = 0

  for (const issue of found) {
    const existing = state.issues[
      issue.fingerprint
    ] as AggregatedIssue | undefined

    if (existing) {
      existing.lastSeen = new Date().toISOString()
      existing.occurrences += 1

      const currentDetails = existing.details as {
        affectedTests?: string[]
      }
      const incomingDetails = issue.details as { title?: string }

      if (incomingDetails.title) {
        currentDetails.affectedTests ||= []
        if (
          !currentDetails.affectedTests.includes(
            incomingDetails.title,
          )
        ) {
          currentDetails.affectedTests.push(incomingDetails.title)
        }
      }

      knownIssues += 1
    } else {
      state.issues[issue.fingerprint] = issue
      newIssues += 1
    }
  }

  state.cycles.push({
    number: state.cycles.length + 1,
    phaseStart,
    phaseEnd: phaseStart + phaseCount - 1,
    lang,
    theme,
    device,
    newIssues,
    knownIssues,
    contentExitCode: contentRun.status,
    visualExitCode: visualRun.status,
    visualResultsFresh,
    contentDurationMs: contentRun.durationMs,
    visualDurationMs: visualRun.durationMs,
    durationSeconds: Math.max(
      1,
      Math.round((Date.now() - cycleStart) / 1000),
    ),
    cycleDir,
  })

  state.cursor = (phaseStart + phaseCount) % 69
  state.updatedAt = new Date().toISOString()

  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2))
  writeHtml(path.join(reportDir, 'index.html'), state)

  const completedThisRun = iteration
  const elapsedMs = Date.now() - started
  const averageMs = elapsedMs / completedThisRun
  const remainingCycles = Math.max(0, args.cycles - completedThisRun)
  const etaMs = averageMs * remainingCycles
  const etaMinutes = Math.max(0, Math.round(etaMs / 60_000))

  console.log(
    `Cycle complete. New issues: ${newIssues}; already known and ignored for stopping: ${knownIssues}.`,
  )
  console.log(
    `Progress: ${completedThisRun}/${args.cycles} cycle(s) in this run · average ${Math.max(1, Math.round(averageMs / 1000))}s/cycle · estimated ${etaMinutes} min remaining.`,
  )
}

console.log(
  `\nAutopilot v${AUDITOR_VERSION} finished. Report: ${path.join(reportDir, 'index.html')}`,
)
