import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ALL_PHASES } from '../src/data/phases/index'
import { auditCurriculum, type CurriculumIssue, type PhaseCurriculumAudit } from '../src/lib/curriculumAudit'

const report = auditCurriculum(ALL_PHASES)
const outputDir = resolve(process.env.HP_CURRICULUM_AUDIT_OUTPUT_DIR || 'curriculum-audit-report')
mkdirSync(outputDir, { recursive: true })

writeFileSync(resolve(outputDir, 'curriculum-audit.json'), JSON.stringify(report, null, 2), 'utf8')

const severityRank = { blocking: 0, high: 1, medium: 2, low: 3 } as const
const priority = [...report.curriculumIssues, ...report.phases.flatMap(phase => phase.issues)]
  .sort((a, b) => severityRank[a.severity] - severityRank[b.severity]
    || (a.phaseId ?? -1) - (b.phaseId ?? -1)
    || a.title.localeCompare(b.title))

function escapeCell(value: string) {
  return value.replaceAll('|', '\\|').replaceAll('\n', '<br>')
}

function phaseRow(phase: PhaseCurriculumAudit) {
  const topIssues = phase.issues
    .slice()
    .sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
    .slice(0, 4)
    .map(item => `${item.severity}: ${item.title}`)
    .join('<br>') || '—'
  return `| ${phase.phaseId} | ${escapeCell(phase.title.en)} | ${phase.stage} | ${phase.score} | ${phase.classification} | ${phase.issues.length} | ${topIssues} |`
}

function issueLine(item: CurriculumIssue, index: number) {
  const where = item.phaseId === null ? 'Curriculum' : `Phase ${item.phaseId}`
  return `${index + 1}. **${where} · ${item.severity.toUpperCase()} · ${item.title}** — ${item.detail}  \n   Recommendation: ${item.recommendation}`
}

const markdown = `# Hashtag Python — Learning Engine V2.10 Curriculum Audit

Generated: ${report.generatedAt}

## Release decision

- Quality gate: **${report.qualityGate.passed ? 'PASS' : 'BLOCKED'}**
- Blocking issues: ${report.summary.blockingIssues}
- All 69 phases use an individually authored ten-stage learning journey: ${report.summary.authoredJourneys === report.summary.totalPhases ? 'yes' : 'no'}
- Visible exam contracts: ${report.summary.visibleExamContracts}/${report.summary.totalPhases}

The quality gate blocks only contradictions or missing foundations that could mislead a learner. High, medium, and low findings remain visible as a prioritized improvement backlog rather than pretending that static checks prove perfect teaching.

## Summary

- Phases: ${report.summary.totalPhases}
- Average curriculum score: ${report.summary.averageScore}/100
- Release-ready: ${report.summary.releaseReady}
- Minor review: ${report.summary.minorReview}
- Important review: ${report.summary.importantReview}
- Critical: ${report.summary.critical}
- Total findings: ${report.summary.issueCount}
- High findings: ${report.summary.highIssues}
- Mini projects: ${report.summary.projects}

## Highest-priority backlog

${priority.slice(0, 60).map(issueLine).join('\n') || 'No findings.'}

## Phase matrix

| Phase | Title | Stage | Score | Classification | Findings | Main findings |
|---:|---|---|---:|---|---:|---|
${report.phases.map(phaseRow).join('\n')}

## Score dimensions

Each phase is scored on the actual Learning Engine V2 experience rather than only the legacy lesson blocks:

- **Journey:** authored problem, logic, flow, pseudocode, Python, trace, debug, practice, and transfer.
- **Clarity:** beginner-facing outcomes and exercise contracts.
- **Practice:** deliberate practice and requirement-specific verification.
- **Assessment:** visible output contracts, consistent grading, quizzes, and hidden generalization.
- **Feedback:** explanations, progressive hints, and debugging guidance.
- **Progression:** stable sequence, track structure, and skill mapping.
- **Localization:** complete English and Portuguese learning paths.
- **Project:** planning, test evidence, edge cases, and refactoring where a mini project exists.
- **Experience:** shared guarantees such as optional journals, top-of-page navigation, and visible exam output.

## Interpretation

- **Release-ready (90–100):** no blocking contradiction and only limited improvement findings.
- **Minor review (80–89):** safe to learn from, with focused quality improvements.
- **Important review (65–79):** meaningful gaps in practice, feedback, or generalization.
- **Critical (0–64):** should not be treated as mastery-ready.

This audit is deterministic evidence, not proof that every learner will understand the material. The overnight browser auditor, real learner observation, retention checks, and expert review remain necessary.
`

writeFileSync(resolve(outputDir, 'CURRICULUM_AUDIT.md'), markdown, 'utf8')

const csvHeader = [
  'phase_id', 'title_en', 'stage', 'score', 'classification', 'authored_journey', 'journey_units',
  'exercises', 'graded_exercises', 'quiz_questions', 'visible_exam_cases', 'hidden_exam_cases',
  'mini_project', 'skill_count', 'blocking', 'high', 'medium', 'low',
]
const csvRows = report.phases.map(phase => {
  const counts = { blocking: 0, high: 0, medium: 0, low: 0 }
  phase.issues.forEach(item => { counts[item.severity] += 1 })
  const values = [
    phase.phaseId,
    phase.title.en,
    phase.stage,
    phase.score,
    phase.classification,
    phase.metrics.authoredJourney,
    phase.metrics.journeyUnits,
    phase.metrics.exercises,
    phase.metrics.gradedExercises,
    phase.metrics.quizQuestions,
    phase.metrics.visibleExamCases,
    phase.metrics.hiddenExamCases,
    phase.metrics.miniProject,
    phase.metrics.skillCount,
    counts.blocking,
    counts.high,
    counts.medium,
    counts.low,
  ]
  return values.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')
})
writeFileSync(resolve(outputDir, 'phase-matrix.csv'), `${csvHeader.join(',')}\n${csvRows.join('\n')}\n`, 'utf8')

const manifest = {
  schemaVersion: report.schemaVersion,
  engineVersion: report.engineVersion,
  generatedAt: report.generatedAt,
  qualityGatePassed: report.qualityGate.passed,
  blockingIssueIds: report.qualityGate.blockingIssueIds,
  artifacts: ['curriculum-audit.json', 'CURRICULUM_AUDIT.md', 'phase-matrix.csv'],
}
writeFileSync(resolve(outputDir, 'audit-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

console.log(`Learning Engine V2.10 audit: ${report.summary.totalPhases} phases`)
console.log(`Average score: ${report.summary.averageScore}/100`)
console.log(`Release-ready: ${report.summary.releaseReady}`)
console.log(`Minor review: ${report.summary.minorReview}`)
console.log(`Important review: ${report.summary.importantReview}`)
console.log(`Critical: ${report.summary.critical}`)
console.log(`Blocking issues: ${report.summary.blockingIssues}`)
console.log(`Quality gate: ${report.qualityGate.passed ? 'PASS' : 'BLOCKED'}`)
console.log(`Report: ${resolve(outputDir, 'CURRICULUM_AUDIT.md')}`)

if (!report.qualityGate.passed) process.exitCode = 1
