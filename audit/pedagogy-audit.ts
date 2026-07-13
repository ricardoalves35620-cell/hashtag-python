import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ALL_PHASES } from '../src/data/phases/index'
import { auditCurriculumPedagogy, type PhasePedagogyAudit } from '../src/lib/pedagogyAudit'

const report = auditCurriculumPedagogy(ALL_PHASES)
const outputDir = resolve(process.cwd(), 'pedagogy-report')
mkdirSync(outputDir, { recursive: true })

writeFileSync(resolve(outputDir, 'pedagogy-audit.json'), JSON.stringify(report, null, 2), 'utf8')

function row(phase: PhasePedagogyAudit) {
  const issueSummary = phase.issues.length
    ? phase.issues.map(issue => `${issue.severity}: ${issue.title}`).join('<br>')
    : '—'
  return `| ${phase.phaseId} | ${phase.title.replaceAll('|', '\\|')} | ${phase.score} | ${phase.classification} | ${phase.issues.length} | ${issueSummary} |`
}

const priority = report.phases
  .flatMap(phase => phase.issues)
  .sort((a, b) => {
    const rank = { critical: 0, high: 1, medium: 2, low: 3 }
    return rank[a.severity] - rank[b.severity] || a.phaseId - b.phaseId
  })
  .slice(0, 30)

const markdown = `# Hashtag Python — Pedagogical Audit\n\nGenerated: ${report.generatedAt}\n\n## Summary\n\n- Phases: ${report.summary.totalPhases}\n- Average score: ${report.summary.averageScore}/100\n- Excellent: ${report.summary.excellent}\n- Adequate: ${report.summary.adequate}\n- Needs review: ${report.summary.needsReview}\n- Critical: ${report.summary.critical}\n- Total issues: ${report.summary.issueCount}\n- Critical issues: ${report.summary.criticalIssues}\n- High issues: ${report.summary.highIssues}\n\n## Priority backlog\n\n${priority.length ? priority.map((item, index) => `${index + 1}. **Phase ${item.phaseId} · ${item.severity.toUpperCase()} · ${item.title}** — ${item.recommendation}`).join('\n') : 'No priority issues.'}\n\n## Phase matrix\n\n| Phase | Title | Score | Classification | Issues | Main findings |\n|---:|---|---:|---|---:|---|\n${report.phases.map(row).join('\n')}\n\n## Interpretation\n\n- **Excellent (90–100):** strong enough for release; continue manual review.\n- **Adequate (75–89):** usable, with focused improvements.\n- **Needs review (55–74):** important pedagogical gaps.\n- **Critical (0–54):** should not be considered mastery-ready.\n\nThis audit is a deterministic quality screen. It does not replace observation of real learners, expert curriculum review or retention testing.\n`

writeFileSync(resolve(outputDir, 'PEDAGOGY_AUDIT.md'), markdown, 'utf8')

console.log(`Pedagogical audit complete: ${report.summary.totalPhases} phases`)
console.log(`Average score: ${report.summary.averageScore}/100`)
console.log(`Excellent: ${report.summary.excellent}`)
console.log(`Adequate: ${report.summary.adequate}`)
console.log(`Needs review: ${report.summary.needsReview}`)
console.log(`Critical: ${report.summary.critical}`)
console.log(`Issues: ${report.summary.issueCount} (${report.summary.criticalIssues} critical, ${report.summary.highIssues} high)`)
console.log(`Report: ${resolve(outputDir, 'PEDAGOGY_AUDIT.md')}`)
