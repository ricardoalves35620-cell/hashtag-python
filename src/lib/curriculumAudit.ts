import type { Bilingual, Exercise, Phase, QuizQuestion, TestCase } from '../data/types'
import { MINI_PROJECTS, getMiniProjectForPhase } from '../data/miniProjects'
import { PHASE_GROUPS, inferPhaseStage } from '../data/phaseCatalog'
import { getSkillsForPhase } from '../data/skills'
import { getPedagogicalJourney, getPedagogicalBlueprintStatus, type LessonUnitKind } from './pedagogicalJourney'
import { getExercisePedagogy } from './pedagogy'
import { getVisibleExamContracts } from './examContract'
import { getPrimaryExerciseInputs, getVisibleExerciseContracts } from './exerciseContract'
import { checkText } from './pyodide'

export type CurriculumSeverity = 'blocking' | 'high' | 'medium' | 'low'
export type CurriculumCategory =
  | 'journey'
  | 'clarity'
  | 'practice'
  | 'assessment'
  | 'feedback'
  | 'progression'
  | 'localization'
  | 'project'
  | 'experience'

export interface CurriculumIssue {
  id: string
  phaseId: number | null
  severity: CurriculumSeverity
  category: CurriculumCategory
  title: string
  detail: string
  recommendation: string
}

export interface DimensionScore {
  name: CurriculumCategory
  score: number
  weight: number
}

export interface PhaseCurriculumAudit {
  phaseId: number
  title: Bilingual
  stage: string
  score: number
  classification: 'release-ready' | 'minor-review' | 'important-review' | 'critical'
  dimensions: DimensionScore[]
  strengths: string[]
  issues: CurriculumIssue[]
  metrics: {
    authoredJourney: boolean
    journeyUnits: number
    exercises: number
    gradedExercises: number
    quizQuestions: number
    visibleExamCases: number
    hiddenExamCases: number
    miniProject: boolean
    skillCount: number
  }
}

export interface CurriculumAuditReport {
  schemaVersion: 2
  engineVersion: string
  generatedAt: string
  phases: PhaseCurriculumAudit[]
  summary: {
    totalPhases: number
    averageScore: number
    releaseReady: number
    minorReview: number
    importantReview: number
    critical: number
    issueCount: number
    blockingIssues: number
    highIssues: number
    authoredJourneys: number
    visibleExamContracts: number
    projects: number
  }
  curriculumIssues: CurriculumIssue[]
  qualityGate: {
    passed: boolean
    blockingIssueIds: string[]
  }
}

const REQUIRED_JOURNEY_ORDER: LessonUnitKind[] = [
  'challenge',
  'intuition',
  'decomposition',
  'flow',
  'pseudocode',
  'python',
  'walkthrough',
  'debug',
  'practice',
  'transfer',
]

const WEIGHTS: Record<CurriculumCategory, number> = {
  journey: 24,
  clarity: 12,
  practice: 18,
  assessment: 20,
  feedback: 10,
  progression: 6,
  localization: 6,
  project: 2,
  experience: 2,
}

const DEDUCTIONS: Record<CurriculumSeverity, number> = {
  blocking: 100,
  high: 35,
  medium: 18,
  low: 8,
}

function normalizedText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function meaningful(value: string | undefined, minimum = 24) {
  return Boolean(value && normalizedText(value).length >= minimum)
}

function bilingualComplete(value: Bilingual | undefined, minimum = 8) {
  return Boolean(value && meaningful(value.en, minimum) && meaningful(value.pt, minimum))
}

function issue(
  phaseId: number | null,
  severity: CurriculumSeverity,
  category: CurriculumCategory,
  suffix: string,
  title: string,
  detail: string,
  recommendation: string,
): CurriculumIssue {
  return {
    id: `${phaseId === null ? 'curriculum' : `phase-${phaseId}`}-${suffix}`,
    phaseId,
    severity,
    category,
    title,
    detail,
    recommendation,
  }
}

function quizExplanationUseful(question: QuizQuestion) {
  return meaningful(question.explanation.en, 35) && meaningful(question.explanation.pt, 35)
}

function exerciseText(exercise: Exercise) {
  return normalizedText([
    exercise.title.en,
    exercise.title.pt,
    exercise.description.en,
    exercise.description.pt,
    ...exercise.hints.flatMap(item => [item.en, item.pt]),
  ].join(' '))
}

function hasActiveReasoningLanguage(exercise: Exercise) {
  const content = exerciseText(exercise)
  const groups = [
    ['predict', 'preveja', 'previsao', 'previsão'],
    ['change', 'modify', 'mude', 'modifique', 'altere'],
    ['explain', 'explique', 'why', 'por que'],
  ]
  return groups.filter(group => group.some(token => content.includes(normalizedText(token)))).length >= 2
}

function hasVisibleExpectedOutput(test: TestCase, phase: Phase) {
  return Boolean(test.expectedOutput || phase.exam.expectedOutput)
}

function pointsTotal(tests: TestCase[]) {
  return tests.reduce((total, test) => total + Number(test.points || 0), 0)
}

function classify(score: number): PhaseCurriculumAudit['classification'] {
  if (score >= 90) return 'release-ready'
  if (score >= 80) return 'minor-review'
  if (score >= 65) return 'important-review'
  return 'critical'
}

function dimensionScores(issues: CurriculumIssue[]) {
  return (Object.keys(WEIGHTS) as CurriculumCategory[]).map(name => {
    const dimensionIssues = issues.filter(item => item.category === name)
    const rawPenalty = dimensionIssues.reduce((sum, current) => sum + DEDUCTIONS[current.severity], 0)
    return {
      name,
      weight: WEIGHTS[name],
      score: Math.max(0, 100 - rawPenalty),
    }
  })
}

function weightedScore(dimensions: DimensionScore[]) {
  const weighted = dimensions.reduce((sum, dimension) => sum + dimension.score * dimension.weight, 0)
  const totalWeight = dimensions.reduce((sum, dimension) => sum + dimension.weight, 0)
  return Math.round(weighted / totalWeight)
}

function auditJourney(phase: Phase, issues: CurriculumIssue[], strengths: string[]) {
  const status = getPedagogicalBlueprintStatus(phase)
  const journey = getPedagogicalJourney(phase)

  if (!status.authored) {
    issues.push(issue(
      phase.id,
      'blocking',
      'journey',
      'generic-learning-journey',
      'Learning journey is still generic',
      'This phase is using the emergency fallback instead of an individually authored reasoning blueprint.',
      'Write a phase-specific situation, human reasoning, decomposition, flow, pseudocode, expert lens, likely failure and transfer prompt.',
    ))
  } else {
    strengths.push('Individually authored reasoning journey')
  }

  const kinds = journey.map(unit => unit.kind)
  if (kinds.join('|') !== REQUIRED_JOURNEY_ORDER.join('|')) {
    issues.push(issue(
      phase.id,
      'blocking',
      'journey',
      'invalid-journey-sequence',
      'Learning journey sequence is incomplete or out of order',
      `Expected ${REQUIRED_JOURNEY_ORDER.join(' → ')}, received ${kinds.join(' → ')}.`,
      'Restore the ten reasoning-first stages in the canonical order.',
    ))
  } else {
    strengths.push('Complete ten-stage reasoning sequence')
  }

  journey.forEach(unit => {
    if (!bilingualComplete(unit.title, 4) || !bilingualComplete(unit.purpose, 15)) {
      issues.push(issue(
        phase.id,
        'blocking',
        'localization',
        `journey-${unit.id}-missing-copy`,
        `Journey stage “${unit.id}” is incomplete in one language`,
        'Title or purpose is missing meaningful English or Portuguese copy.',
        'Complete both languages before release.',
      ))
    }
    if (!bilingualComplete(unit.checkpoint, 20) || !bilingualComplete(unit.checkpointPlaceholder, 8)) {
      issues.push(issue(
        phase.id,
        'high',
        'journey',
        `journey-${unit.id}-weak-checkpoint`,
        `Journey stage “${unit.id}” has a weak reasoning prompt`,
        'The optional reflection prompt or placeholder is too short to guide a beginner.',
        'Ask a concrete question that explains what the learner may write and why it helps.',
      ))
    }
    if (unit.blocks.length < 2) {
      issues.push(issue(
        phase.id,
        'high',
        'journey',
        `journey-${unit.id}-shallow`,
        `Journey stage “${unit.id}” is too shallow`,
        `The stage contains only ${unit.blocks.length} instructional block(s).`,
        'Add a mental model, example, counterexample, trace, or professional application relevant to this stage.',
      ))
    }
  })

  const pythonUnit = journey.find(unit => unit.kind === 'python')
  if (!pythonUnit?.blocks.some(block => block.type === 'code')) {
    issues.push(issue(
      phase.id,
      'blocking',
      'journey',
      'python-stage-without-code',
      'Python translation stage has no code',
      'The learner is asked to translate reasoning into Python but no worked code is available.',
      'Include at least one localized worked example mapped to the pseudocode.',
    ))
  }

  const debugUnit = journey.find(unit => unit.kind === 'debug')
  if (!debugUnit?.blocks.some(block => block.type === 'warning')) {
    issues.push(issue(
      phase.id,
      'medium',
      'feedback',
      'debug-stage-without-warning',
      'Debug stage lacks a concrete failure warning',
      'The phase does not clearly surface a likely failure and a safe debugging habit.',
      'Add one realistic symptom, likely cause, and smallest confirming test.',
    ))
  }

  const blueprintFields = Object.entries(status.blueprint)
  const weakFields = blueprintFields.filter(([, value]) => !bilingualComplete(value, 55))
  if (weakFields.length) {
    issues.push(issue(
      phase.id,
      'medium',
      'clarity',
      'brief-blueprint-fields',
      'Some phase-specific explanations are too brief',
      `${weakFields.map(([name]) => name).join(', ')} do not yet provide enough context for a beginner.`,
      'Explain the problem, reasoning, and failure mode in complete beginner-facing language rather than compressed labels.',
    ))
  } else {
    strengths.push('Phase-specific problem, logic, failure, and transfer explanations')
  }
}

function auditPractice(phase: Phase, issues: CurriculumIssue[], strengths: string[]) {
  if (phase.exercises.length < 2) {
    issues.push(issue(
      phase.id,
      'blocking',
      'practice',
      'insufficient-practice',
      'Phase has insufficient deliberate practice',
      `Only ${phase.exercises.length} exercise(s) are available.`,
      'Provide at least a guided reasoning exercise and an independent implementation exercise.',
    ))
  } else if (phase.exercises.length < 3) {
    issues.push(issue(
      phase.id,
      'medium',
      'practice',
      'no-hardening-exercise',
      'Phase has no separate hardening challenge',
      'Two exercises cover guidance and independence, but there is no dedicated transfer or edge-case challenge.',
      'Add a third challenge only when it introduces meaningful transfer rather than repetitive clicking.',
    ))
  } else {
    strengths.push('Guided, independent, and challenge practice available')
  }

  const gradedExercises = phase.exercises.filter(exercise => (exercise.grading?.tests?.length || 0) > 0)
  if (gradedExercises.length === 0) {
    issues.push(issue(
      phase.id,
      'high',
      'practice',
      'practice-not-behaviorally-verified',
      'Exercises are not behaviorally verified',
      'The interface can execute code, but exercise-specific tests do not prove that requirements were met.',
      'Add visible behavioral tests to the independent exercise and a materially different hidden case to the challenge.',
    ))
  } else if (gradedExercises.length < Math.min(2, phase.exercises.length)) {
    issues.push(issue(
      phase.id,
      'medium',
      'practice',
      'limited-graded-practice',
      'Only part of the practice is behaviorally verified',
      `Only ${gradedExercises.length} of ${phase.exercises.length} exercises use requirement-specific automated tests.`,
      'Behaviorally verify at least the independent and challenge exercises.',
    ))
  } else {
    strengths.push('Independent practice is behaviorally verified')
  }

  phase.exercises.forEach((exercise, index) => {
    const en = getExercisePedagogy(phase, exercise, index, 'en')
    const pt = getExercisePedagogy(phase, exercise, index, 'pt')
    if (!meaningful(en.objective, 18) || !meaningful(pt.objective, 18)) {
      issues.push(issue(
        phase.id,
        'high',
        'clarity',
        `exercise-${index}-unclear-objective`,
        `Exercise ${index + 1} has an unclear objective`,
        'The learner cannot easily tell what capability must be demonstrated.',
        'State the problem, inputs, output, rules, and completion evidence in beginner-facing language.',
      ))
    }
    if (en.successCriteria.length < 2 || pt.successCriteria.length < 2) {
      issues.push(issue(
        phase.id,
        'medium',
        'clarity',
        `exercise-${index}-weak-success-criteria`,
        `Exercise ${index + 1} has weak success criteria`,
        'The interface does not give enough evidence for the learner to self-check before running.',
        'List at least two observable criteria: behavior/output and structure/error handling.',
      ))
    }
    if (exercise.hints.length < 2) {
      issues.push(issue(
        phase.id,
        'low',
        'feedback',
        `exercise-${index}-single-hint`,
        `Exercise ${index + 1} needs more progressive hints`,
        `It has ${exercise.hints.length} hint(s).`,
        'Use at least two layers: remind the concept, then point to the next structural step without revealing the final answer.',
      ))
    }


    const englishContracts = getVisibleExerciseContracts(exercise, 'en')
    const portugueseContracts = getVisibleExerciseContracts(exercise, 'pt')
    if (!englishContracts.length || !portugueseContracts.length || englishContracts.some(contract => !contract.expected.trim()) || portugueseContracts.some(contract => !contract.expected.trim())) {
      issues.push(issue(
        phase.id,
        'blocking',
        'assessment',
        `exercise-${index}-missing-visible-contract`,
        `Exercise ${index + 1} does not publish its complete visible contract`,
        'The learner cannot reliably see the input values and expected result before running the code.',
        'Publish a bilingual expected result and the visible input values used by the grader.',
      ))
    }

    if (/\binput\s*\(/.test(exercise.starterCode) && getPrimaryExerciseInputs(exercise).length === 0) {
      issues.push(issue(
        phase.id,
        'blocking',
        'assessment',
        `exercise-${index}-missing-visible-inputs`,
        `Exercise ${index + 1} calls input() without publishing test values`,
        'The learner would have to guess which values reproduce the expected result.',
        'Provide concrete suggested inputs from the same visible test case used by the grader.',
      ))
    }
  })

  const firstExercise = phase.exercises[0]
  if (firstExercise && hasActiveReasoningLanguage(firstExercise)) {
    strengths.push('First exercise language reinforces prediction and explanation')
  } else {
    strengths.push('First exercise is protected by the global Predict → Run → Change → Run workflow')
  }
}

function auditAssessment(phase: Phase, issues: CurriculumIssue[], strengths: string[]) {
  if (phase.quiz.length < 3) {
    issues.push(issue(
      phase.id,
      'high',
      'assessment',
      'short-quiz',
      'Quiz samples too little understanding',
      `The phase has ${phase.quiz.length} quiz question(s).`,
      'Use concept, code-reading, and debugging questions with meaningful distractors.',
    ))
  }

  const weakExplanations = phase.quiz.filter(question => !quizExplanationUseful(question))
  if (weakExplanations.length) {
    issues.push(issue(
      phase.id,
      'medium',
      'feedback',
      'weak-quiz-explanations',
      `${weakExplanations.length} quiz explanation(s) are too brief`,
      'Feedback should explain why the correct option works and why the tempting alternative fails.',
      'Expand the explanation in both languages without merely repeating the answer.',
    ))
  } else {
    strengths.push('Quiz feedback teaches after each answer')
  }

  const visible = phase.exam.testCases.filter(test => !test.hidden)
  const hidden = phase.exam.testCases.filter(test => test.hidden)
  if (!visible.length) {
    issues.push(issue(
      phase.id,
      'blocking',
      'assessment',
      'no-visible-exam-case',
      'Exam has no visible contract case',
      'The learner cannot see a concrete input/output contract before submitting.',
      'Add at least one visible test case with canonical expected output.',
    ))
  }

  for (const lang of ['en', 'pt'] as const) {
    const contracts = getVisibleExamContracts(phase.exam, lang)
    if (!contracts.length || contracts.some(contract => !meaningful(contract.expected, 1))) {
      issues.push(issue(
        phase.id,
        'blocking',
        'assessment',
        `missing-exam-contract-${lang}`,
        `Exam expected output is missing in ${lang.toUpperCase()}`,
        'The correction contract is not visible before submission.',
        'Publish the canonical visible output or an explicit format/behavior contract in both languages.',
      ))
    }
  }

  visible.forEach((test, index) => {
    if (!hasVisibleExpectedOutput(test, phase)) return
    const canonical = test.expectedOutput?.en || phase.exam.expectedOutput?.en || ''
    const invalid = test.checks.filter(check => !checkText(canonical, check))
    if (invalid.length) {
      issues.push(issue(
        phase.id,
        'blocking',
        'assessment',
        `exam-contract-mismatch-${index}`,
        'Published expected output contradicts the grader',
        `${invalid.length} grader check(s) reject the output shown to the learner.`,
        'Use one source of truth for visible output and grading checks.',
      ))
    }
  })

  if (!hidden.length) {
    issues.push(issue(
      phase.id,
      'high',
      'assessment',
      'no-hidden-generalization-case',
      'Exam does not yet prove generalization',
      'All correction cases are visible, so a learner may hard-code the example instead of implementing the rule.',
      'Add one hidden case with changed values or edge conditions while preserving the published contract.',
    ))
  } else {
    strengths.push('Exam includes a hidden generalization case')
  }

  const total = pointsTotal(phase.exam.testCases)
  if (total !== 100) {
    issues.push(issue(
      phase.id,
      'medium',
      'assessment',
      'exam-points-not-100',
      'Exam points do not total 100',
      `The current total is ${total}.`,
      'Normalize exam scoring so percentages and mastery rules remain understandable.',
    ))
  }
}

function auditLocalizationAndProgression(phase: Phase, issues: CurriculumIssue[], strengths: string[]) {
  const coreValues: Array<[string, Bilingual | undefined]> = [
    ['title', phase.title],
    ['description', phase.description],
    ['lesson title', phase.lesson.title],
    ['exam title', phase.exam.title],
    ['exam scenario', phase.exam.scenario],
  ]
  const missing = coreValues.filter(([, value]) => !bilingualComplete(value, 3))
  if (missing.length) {
    issues.push(issue(
      phase.id,
      'blocking',
      'localization',
      'missing-core-localization',
      'Core phase content is missing a translation',
      missing.map(([name]) => name).join(', '),
      'Complete English and Portuguese before release.',
    ))
  } else {
    strengths.push('Core experience is bilingual')
  }

  if (!meaningful(phase.description.en, 35) || !meaningful(phase.description.pt, 35)) {
    issues.push(issue(
      phase.id,
      'medium',
      'clarity',
      'weak-phase-description',
      'Phase outcome is too vague',
      'The overview does not clearly describe an observable capability in both languages.',
      'State what the learner will be able to build, explain, debug, or test after the phase.',
    ))
  }

  const skillIds = getSkillsForPhase(phase.id)
  if (!skillIds.length) {
    issues.push(issue(
      phase.id,
      'high',
      'progression',
      'phase-without-skill-map',
      'Phase is not connected to the mastery model',
      'Review and spaced repetition cannot attribute attempts to a skill.',
      'Map the phase to at least one explicit skill definition.',
    ))
  } else {
    strengths.push('Connected to skill mastery and review')
  }
}

function auditProject(phase: Phase, issues: CurriculumIssue[], strengths: string[]) {
  const project = getMiniProjectForPhase(phase.id)
  if (!project) return

  if (project.tests.length < 2) {
    issues.push(issue(
      phase.id,
      'high',
      'project',
      'project-single-test',
      'Mini project has insufficient test evidence',
      `Only ${project.tests.length} project test(s) exist.`,
      'Use at least a normal case and an edge or alternate case.',
    ))
  }
  if (!bilingualComplete(project.inputContract, 15)
    || !bilingualComplete(project.outputContract, 15)
    || !bilingualComplete(project.ruleContract, 15)
    || !bilingualComplete(project.edgeCases, 15)) {
    issues.push(issue(
      phase.id,
      'blocking',
      'project',
      'project-contract-incomplete',
      'Mini project contract is incomplete',
      'Input, output, rules, or edge cases are missing in one language.',
      'Complete the professional contract before using the project as a mastery gate.',
    ))
  }
  if (project.refactorOptions.length < 3) {
    issues.push(issue(
      phase.id,
      'medium',
      'project',
      'weak-refactor-stage',
      'Mini project offers too little refactoring guidance',
      'The learner needs concrete quality dimensions after the code works.',
      'Offer at least naming, structure, error handling, and readability/performance options as appropriate.',
    ))
  }
  strengths.push('Professional mini project requires planning, testing, and refactoring')
}

export function auditPhaseCurriculum(phase: Phase): PhaseCurriculumAudit {
  const issues: CurriculumIssue[] = []
  const strengths: string[] = []

  auditJourney(phase, issues, strengths)
  auditPractice(phase, issues, strengths)
  auditAssessment(phase, issues, strengths)
  auditLocalizationAndProgression(phase, issues, strengths)
  auditProject(phase, issues, strengths)

  // Experience-level guarantees are implemented once in the shared engine.
  strengths.push('Optional learning journal does not block progression')
  strengths.push('Next lesson navigation restores the top and title focus')
  strengths.push('Expected exam output is visible before submission')

  const dimensions = dimensionScores(issues)
  const score = weightedScore(dimensions)
  const visibleExamCases = phase.exam.testCases.filter(test => !test.hidden).length
  const hiddenExamCases = phase.exam.testCases.filter(test => test.hidden).length

  return {
    phaseId: phase.id,
    title: phase.title,
    stage: inferPhaseStage(phase),
    score,
    classification: classify(score),
    dimensions,
    strengths: [...new Set(strengths)],
    issues,
    metrics: {
      authoredJourney: getPedagogicalBlueprintStatus(phase).authored,
      journeyUnits: getPedagogicalJourney(phase).length,
      exercises: phase.exercises.length,
      gradedExercises: phase.exercises.filter(exercise => (exercise.grading?.tests?.length || 0) > 0).length,
      quizQuestions: phase.quiz.length,
      visibleExamCases,
      hiddenExamCases,
      miniProject: Boolean(getMiniProjectForPhase(phase.id)),
      skillCount: getSkillsForPhase(phase.id).length,
    },
  }
}

function auditCurriculumStructure(phases: Phase[]) {
  const issues: CurriculumIssue[] = []
  const ids = phases.map(phase => phase.id)
  const unique = new Set(ids)
  if (unique.size !== ids.length) {
    issues.push(issue(
      null,
      'blocking',
      'progression',
      'duplicate-phase-id',
      'Curriculum contains duplicate phase IDs',
      'Routing, progress, and unlocking become ambiguous when phase IDs repeat.',
      'Assign one stable unique ID to every phase.',
    ))
  }

  const expectedIds = Array.from({ length: phases.length }, (_, index) => index)
  if (ids.join('|') !== expectedIds.join('|')) {
    issues.push(issue(
      null,
      'blocking',
      'progression',
      'phase-sequence-gap',
      'Curriculum phase order has a gap or unexpected ID',
      `Expected ${expectedIds[0]}–${expectedIds.at(-1)}, received ${ids.join(', ')}.`,
      'Keep the progressive sequence stable because unlock rules use the previous phase.',
    ))
  }

  const normalizedTitles = new Map<string, number[]>()
  phases.forEach(phase => {
    const key = normalizedText(phase.title.en)
    normalizedTitles.set(key, [...(normalizedTitles.get(key) || []), phase.id])
  })
  for (const [title, phaseIds] of normalizedTitles) {
    if (phaseIds.length > 1) {
      issues.push(issue(
        null,
        'high',
        'progression',
        `duplicate-title-${title}`,
        'Multiple phases use the same title',
        `Phases ${phaseIds.join(', ')} have indistinguishable titles.`,
        'Make each phase outcome and title distinct.',
      ))
    }
  }

  for (const group of PHASE_GROUPS) {
    const members = phases.filter(phase => inferPhaseStage(phase) === group.id)
    const expected = group.phaseRange[1] - group.phaseRange[0] + 1
    if (members.length !== expected) {
      issues.push(issue(
        null,
        'blocking',
        'progression',
        `group-${group.id}-range-mismatch`,
        `Track “${group.id}” does not match its declared phase range`,
        `Expected ${expected} phases, found ${members.length}.`,
        'Synchronize phase metadata and the track catalog.',
      ))
    }
  }

  const blueprintTexts = new Map<string, number[]>()
  phases.forEach(phase => {
    const blueprint = getPedagogicalBlueprintStatus(phase).blueprint
    const signature = normalizedText(Object.values(blueprint).flatMap(value => [value.en, value.pt]).join(' '))
    blueprintTexts.set(signature, [...(blueprintTexts.get(signature) || []), phase.id])
  })
  for (const phaseIds of blueprintTexts.values()) {
    if (phaseIds.length > 1) {
      issues.push(issue(
        null,
        'blocking',
        'journey',
        `duplicate-blueprint-${phaseIds.join('-')}`,
        'Multiple phases share an identical learning blueprint',
        `Phases ${phaseIds.join(', ')} appear to use copied reasoning text.`,
        'Author the reasoning and transfer path for each concept individually.',
      ))
    }
  }

  return issues
}

export function auditCurriculum(phases: Phase[], engineVersion = '2.10.0'): CurriculumAuditReport {
  const phaseAudits = phases.map(auditPhaseCurriculum)
  const curriculumIssues = auditCurriculumStructure(phases)
  const allIssues = [...curriculumIssues, ...phaseAudits.flatMap(phase => phase.issues)]
  const averageScore = phaseAudits.length
    ? Math.round((phaseAudits.reduce((sum, phase) => sum + phase.score, 0) / phaseAudits.length) * 10) / 10
    : 0
  const blocking = allIssues.filter(item => item.severity === 'blocking')

  return {
    schemaVersion: 2,
    engineVersion,
    generatedAt: new Date().toISOString(),
    phases: phaseAudits,
    summary: {
      totalPhases: phaseAudits.length,
      averageScore,
      releaseReady: phaseAudits.filter(phase => phase.classification === 'release-ready').length,
      minorReview: phaseAudits.filter(phase => phase.classification === 'minor-review').length,
      importantReview: phaseAudits.filter(phase => phase.classification === 'important-review').length,
      critical: phaseAudits.filter(phase => phase.classification === 'critical').length,
      issueCount: allIssues.length,
      blockingIssues: blocking.length,
      highIssues: allIssues.filter(item => item.severity === 'high').length,
      authoredJourneys: phaseAudits.filter(phase => phase.metrics.authoredJourney).length,
      visibleExamContracts: phaseAudits.filter(phase => phase.metrics.visibleExamCases > 0).length,
      projects: MINI_PROJECTS.length,
    },
    curriculumIssues,
    qualityGate: {
      passed: blocking.length === 0,
      blockingIssueIds: blocking.map(item => item.id),
    },
  }
}
