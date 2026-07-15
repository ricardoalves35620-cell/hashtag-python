import fs from 'node:fs'
import path from 'node:path'
import { ALL_PHASES } from '../src/data/phases/index'
import type { Bilingual, LessonBlock, Phase } from '../src/data/types'
import { resolveLocalizedCode } from '../src/lib/localization'
import { getVisibleExamContracts } from '../src/lib/examContract'
import { checkText } from '../src/lib/pyodide'
import { V11_FULL_CURRICULUM_MIGRATED_PHASES, V11_GRADING_MIGRATED_PHASES } from '../src/data/v11Migration'
import { allPhaseTestCases, measurePhaseV11, requiredExerciseCount } from '../src/lib/v11Quality'

type Severity = 'error' | 'warning'
interface Issue { fingerprint: string; severity: Severity; phaseId: number; location: string; message: string; sample?: string }

const ptWords = /\b(erro|corre[cç][aã]o|sempre|nunca|contador|condi[cç][aã]o|linha|idade|dano|processar|solicita[cç][oõ]es|estoque|restante|imprime|enquanto)\b/i
const enWords = /\b(error|mistake|fix|always|never|counter|condition|process|claims|remaining|prints|should|inside|outside|caller|returned|scattered)\b/i
const translatedPython = /\b(Mostre|Imprima|Enquanto|Senao|Senão|Verdadeiro|Falso)\s*\(/i
const obviousEnglishComment = /\b(each|inner|claim|row|forgetting|update|counter|always|never|process|pending|should|specific|highest|condition|reached|using|instead|inside|outside|remaining|payout)\b/i
const obviousPortugueseComment = /\b(cada|interna|sinistro|linha|esquecer|atualizar|contador|sempre|nunca|processar|pendente|deve|específica|maior|condição|alcançado|usando|dentro|fora|restante|pagamento)\b/i

function fingerprint(parts: string[]) {
  return parts.join('|').toLowerCase().replace(/\s+/g, ' ').slice(0, 500)
}

function push(issues: Issue[], issue: Omit<Issue, 'fingerprint'>) {
  issues.push({ ...issue, fingerprint: fingerprint([String(issue.phaseId), issue.location, issue.message, issue.sample || '']) })
}

function auditBilingual(issues: Issue[], phase: Phase, value: Bilingual | undefined, location: string) {
  if (!value?.en?.trim()) push(issues, { severity: 'error', phaseId: phase.id, location, message: 'Missing English text' })
  if (!value?.pt?.trim()) push(issues, { severity: 'error', phaseId: phase.id, location, message: 'Missing Portuguese text' })
  if (!value) return
  if (ptWords.test(value.en) && enWords.test(value.en)) push(issues, { severity: 'warning', phaseId: phase.id, location: `${location}.en`, message: 'Possible mixed Portuguese/English sentence', sample: value.en.slice(0, 220) })
  if (ptWords.test(value.pt) && enWords.test(value.pt)) push(issues, { severity: 'warning', phaseId: phase.id, location: `${location}.pt`, message: 'Possible mixed Portuguese/English sentence', sample: value.pt.slice(0, 220) })
}

function auditCode(issues: Issue[], phase: Phase, block: LessonBlock, index: number) {
  if (!block.code) return

  const rendered = [
    ['en', resolveLocalizedCode(block.code, 'en')] as const,
    ['pt', resolveLocalizedCode(block.code, 'pt')] as const,
  ]

  for (const [lang, code] of rendered) {
    if (translatedPython.test(code)) push(issues, { severity: 'error', phaseId: phase.id, location: `lesson.blocks[${index}].code.${lang}`, message: 'Python command appears translated and may be invalid', sample: code.match(translatedPython)?.[0] })

    const comments = code
      .split(/\r?\n/)
      .map(line => {
        const commentIndex = line.indexOf('#')
        return commentIndex >= 0 ? line.slice(commentIndex + 1) : ''
      })
      .filter(Boolean)
      .join('\n')

    if (lang === 'pt' && obviousEnglishComment.test(comments)) {
      push(issues, { severity: 'warning', phaseId: phase.id, location: `lesson.blocks[${index}].code.pt`, message: 'Portuguese code comments still contain English prose', sample: comments.slice(0, 300) })
    }
    if (lang === 'en' && obviousPortugueseComment.test(comments)) {
      push(issues, { severity: 'warning', phaseId: phase.id, location: `lesson.blocks[${index}].code.en`, message: 'English code comments still contain Portuguese prose', sample: comments.slice(0, 300) })
    }
  }
}


const MIN_V11_LESSON_BYTES = 14_000

function lessonText(phase: Phase) {
  return phase.lesson.blocks.map(block => [block.content?.en, block.content?.pt].filter(Boolean).join('\n')).join('\n')
}

function auditV11Standards(issues: Issue[], phase: Phase) {
  const metrics = measurePhaseV11(phase)
  const fullMigration = V11_FULL_CURRICULUM_MIGRATED_PHASES.includes(phase.id)
  const gradingMigration = V11_GRADING_MIGRATED_PHASES.includes(phase.id)
  const severity: Severity = fullMigration ? 'error' : 'warning'

  if (phase.id >= 9 && metrics.lessonBytes < MIN_V11_LESSON_BYTES) {
    push(issues, {
      severity,
      phaseId: phase.id,
      location: 'lesson',
      message: `V11 lesson density is ${metrics.lessonBytes} bytes; target is ${MIN_V11_LESSON_BYTES}.`,
    })
  }

  const requiredExercises = requiredExerciseCount(phase.id)
  if (metrics.exercises < requiredExercises) {
    push(issues, {
      severity,
      phaseId: phase.id,
      location: 'exercises',
      message: `V11 exercise volume is ${metrics.exercises}; target is ${requiredExercises}.`,
    })
  }

  for (const [testIndex, testCase] of allPhaseTestCases(phase).entries()) {
    for (const [checkIndex, check] of testCase.checks.entries()) {
      if (check.type !== 'contains' && check.type !== 'contains_any') continue
      const hasJustification = Boolean(check.justification?.en?.trim() && check.justification?.pt?.trim())
      push(issues, {
        severity: gradingMigration || !hasJustification ? (gradingMigration ? 'error' : 'warning') : 'warning',
        phaseId: phase.id,
        location: `grading.tests[${testIndex}].checks[${checkIndex}]`,
        message: gradingMigration
          ? 'V11 grading-migrated phase still uses a partial contains check.'
          : hasJustification
            ? 'Partial contains check is justified but remains migration debt.'
            : 'Partial contains check has no bilingual justification.',
        sample: `${check.type}: ${String(check.value ?? '')}`,
      })
    }
  }

  if (!fullMigration) return
  const text = lessonText(phase)
  const codeBlocks = phase.lesson.blocks.filter(block => block.type === 'code').length
  const warningBlocks = phase.lesson.blocks.filter(block => block.type === 'warning').length
  const tipBlocks = phase.lesson.blocks.filter(block => block.type === 'tip').length
  const requiredSignals = [
    ['world-hook', /🌍|world.?real|mundo real/i.test(text)],
    ['analogy', /🧩|analogy|analogia|modelo mental/i.test(text)],
    ['progressive-code', codeBlocks >= 3],
    ['real-scenario-1', /cen[aá]rio real 1|real scenario 1/i.test(text)],
    ['real-scenario-2', /cen[aá]rio real 2|real scenario 2/i.test(text)],
    ['common-errors', warningBlocks >= 1],
    ['pro-tip', tipBlocks >= 1],
    ['recap-and-bridge', /recap|resumo|pr[oó]xima fase|next phase/i.test(text)],
  ] as const

  for (const [signal, present] of requiredSignals) {
    if (!present) push(issues, {
      severity: 'error',
      phaseId: phase.id,
      location: 'lesson.blocks',
      message: `V11 fully migrated lesson is missing required block signal: ${signal}.`,
    })
  }
}

function auditPhase(phase: Phase) {
  const issues: Issue[] = []
  auditV11Standards(issues, phase)
  auditBilingual(issues, phase, phase.title, 'title')
  auditBilingual(issues, phase, phase.description, 'description')
  auditBilingual(issues, phase, phase.lesson.title, 'lesson.title')
  phase.lesson.blocks.forEach((block, index) => {
    if (block.type !== 'code' && block.type !== 'video') auditBilingual(issues, phase, block.content, `lesson.blocks[${index}].content`)
    if (block.alternate) auditBilingual(issues, phase, block.alternate, `lesson.blocks[${index}].alternate`)
    auditCode(issues, phase, block, index)
  })
  phase.exercises.forEach((exercise, index) => {
    auditBilingual(issues, phase, exercise.title, `exercises[${index}].title`)
    auditBilingual(issues, phase, exercise.description, `exercises[${index}].description`)
    exercise.hints.forEach((hint, hintIndex) => auditBilingual(issues, phase, hint, `exercises[${index}].hints[${hintIndex}]`))
  })
  phase.quiz.forEach((question, index) => {
    auditBilingual(issues, phase, question.question, `quiz[${index}].question`)
    auditBilingual(issues, phase, question.explanation, `quiz[${index}].explanation`)
    question.options.forEach((option, optionIndex) => auditBilingual(issues, phase, option, `quiz[${index}].options[${optionIndex}]`))
  })
  auditBilingual(issues, phase, phase.exam.title, 'exam.title')
  auditBilingual(issues, phase, phase.exam.scenario, 'exam.scenario')
  if (phase.exam.expectedOutput) auditBilingual(issues, phase, phase.exam.expectedOutput, 'exam.expectedOutput')
  phase.exam.testCases.forEach((testCase, index) => {
    auditBilingual(issues, phase, testCase.description, `exam.testCases[${index}].description`)
    if (testCase.expectedOutput) auditBilingual(issues, phase, testCase.expectedOutput, `exam.testCases[${index}].expectedOutput`)
  })
  for (const lang of ['en', 'pt'] as const) {
    const contracts = getVisibleExamContracts(phase.exam, lang)
    if (contracts.length === 0 || contracts.some(contract => !contract.expected.trim())) {
      push(issues, { severity: 'error', phaseId: phase.id, location: `exam.contract.${lang}`, message: 'Exam has no visible expected-output contract' })
    }
  }
  phase.exam.testCases.filter(testCase => !testCase.hidden).forEach((testCase, index) => {
    const canonical = testCase.expectedOutput?.en || phase.exam.expectedOutput?.en
    if (!canonical) return
    for (const check of testCase.checks) {
      if (!checkText(canonical, check)) push(issues, {
        severity: 'error', phaseId: phase.id, location: `exam.testCases[${index}].checks`,
        message: 'Published expected output does not satisfy the grader check', sample: `${check.type}: ${String(check.value ?? '')}`,
      })
    }
  })
  return issues
}

const start = Math.max(0, Number(process.env.HP_AUDIT_PHASE_START || 0))
const count = Math.max(1, Number(process.env.HP_AUDIT_PHASE_COUNT || ALL_PHASES.length))
const selected = ALL_PHASES.filter(phase => phase.id >= start && phase.id < start + count)
const issues = selected.flatMap(auditPhase)
const output = process.env.HP_AUDIT_CONTENT_OUTPUT || path.resolve('playwright-report/content-audit.json')
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, JSON.stringify({ generatedAt: new Date().toISOString(), start, count, phases: selected.map(p => p.id), issues }, null, 2))
console.log(`Content audit: ${selected.length} phase(s), ${issues.length} issue(s).`)
for (const issue of issues.slice(0, 20)) console.log(`${issue.severity.toUpperCase()} phase ${issue.phaseId} ${issue.location}: ${issue.message}`)
process.exitCode = issues.some(issue => issue.severity === 'error') ? 1 : 0
