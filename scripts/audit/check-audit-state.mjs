import fs from 'node:fs'
import path from 'node:path'

const statePath = path.resolve(process.argv[2] || 'playwright-report/autopilot/state.json')
if (!fs.existsSync(statePath)) {
  console.error(`Audit state not found: ${statePath}`)
  process.exit(2)
}

const state = JSON.parse(fs.readFileSync(statePath, 'utf8'))
const cycles = Array.isArray(state.cycles) ? state.cycles : []
const issues = Object.values(state.issues || {})
const failedCycles = cycles.filter(cycle => cycle.contentExitCode !== 0 || cycle.visualExitCode !== 0 || cycle.visualResultsFresh !== true)
const durationSeconds = cycles.reduce((total, cycle) => total + Number(cycle.durationSeconds || 0), 0)
const environments = new Set(cycles.map(cycle => `${cycle.device}|${cycle.lang}|${cycle.theme}`))
const lastRun = state.lastRun || {}
const plan = state.plan || {}
const pendingConfirmations = Array.isArray(state.focusQueue) ? state.focusQueue.length : 0
const confirmedIssues = issues.filter(issue => issue?.details?.confirmationStatus === 'confirmed').length
const possibleFlakes = issues.filter(issue => issue?.details?.possibleFlake === true).length
const runIncomplete = state.status !== 'completed' || lastRun.status !== 'completed' || Number(lastRun.completedCycles || 0) !== Number(lastRun.requestedCycles || 0)

const summary = [
  '# Hashtag Python audit gate',
  '',
  `- Auditor version: ${state.auditorVersion || 'unknown'}`,
  `- Target: ${state.target || 'unknown'}`,
  `- State: ${state.status || 'unknown'}`,
  `- Mode: ${lastRun.mode || plan.mode || 'legacy'}`,
  `- Last run: ${lastRun.completedCycles || 0}/${lastRun.requestedCycles || 0} cycles (${lastRun.stopReason || 'unknown'})`,
  `- Plan progress: ${plan.cursor || 0}/${Array.isArray(plan.entries) ? plan.entries.length : 0}`,
  `- Pending confirmations: ${pendingConfirmations}`,
  `- Total cycles stored: ${cycles.length}`,
  `- Phase visits: ${state.phaseVisits || 0}`,
  `- Environments covered: ${environments.size}`,
  `- Failed cycles: ${failedCycles.length}`,
  `- Unique issues: ${issues.length}`,
  `- Confirmed issues: ${confirmedIssues}`,
  `- Possible flakes: ${possibleFlakes}`,
  `- Duration: ${Math.round(durationSeconds / 60)} minutes`,
]

if (runIncomplete) summary.push('', '⚠️ The most recent run is incomplete or interrupted.')
if (failedCycles.length > 0) {
  summary.push('', '## Failed cycles', '')
  for (const cycle of failedCycles.slice(0, 30)) {
    const phases = Array.isArray(cycle.phaseIds) ? cycle.phaseIds.join(',') : `${cycle.phaseStart}-${cycle.phaseEnd}`
    summary.push(`- Cycle ${cycle.number}: phases ${phases}, ${cycle.device}, ${cycle.lang}/${cycle.theme}, ${cycle.depth || 'deep'}, exits ${cycle.contentExitCode}/${cycle.visualExitCode}`)
  }
}
if (issues.length > 0) {
  summary.push('', '## Deduplicated issues', '')
  for (const issue of issues.slice(0, 30)) {
    const details = issue.details || {}
    summary.push(`- ${issue.fingerprint}: ${details.title || details.message || issue.source || 'issue'} (${issue.occurrences || 1} occurrence(s))`)
  }
}

const markdown = `${summary.join('\n')}\n`
console.log(markdown)
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown)
if (runIncomplete || failedCycles.length > 0 || issues.length > 0) process.exit(1)
