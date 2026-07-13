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
const failedCycles = cycles.filter(cycle =>
  cycle.contentExitCode !== 0 ||
  cycle.visualExitCode !== 0 ||
  cycle.visualResultsFresh !== true
)

const durationSeconds = cycles.reduce((total, cycle) => total + Number(cycle.durationSeconds || 0), 0)
const environments = new Set(cycles.map(cycle => `${cycle.device}|${cycle.lang}|${cycle.theme}`))
const summary = [
  '# Hashtag Python audit gate',
  '',
  `- Auditor version: ${state.auditorVersion || 'unknown'}`,
  `- Target: ${state.target || 'unknown'}`,
  `- Cycles: ${cycles.length}`,
  `- Environments covered: ${environments.size}`,
  `- Failed cycles: ${failedCycles.length}`,
  `- Unique issues: ${issues.length}`,
  `- Duration: ${Math.round(durationSeconds / 60)} minutes`,
]

if (failedCycles.length > 0) {
  summary.push('', '## Failed cycles', '')
  for (const cycle of failedCycles.slice(0, 30)) {
    summary.push(`- Cycle ${cycle.number}: phase ${cycle.phaseStart}-${cycle.phaseEnd}, ${cycle.device}, ${cycle.lang}/${cycle.theme}, exits ${cycle.contentExitCode}/${cycle.visualExitCode}`)
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

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown)
}

if (failedCycles.length > 0 || issues.length > 0) process.exit(1)
