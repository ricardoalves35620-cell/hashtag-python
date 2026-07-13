import type { Exercise, Phase, QuizQuestion } from '../data/types'

export type PedagogySeverity = 'critical' | 'high' | 'medium' | 'low'
export type PedagogyCategory =
  | 'objective'
  | 'lesson-depth'
  | 'active-practice'
  | 'assessment'
  | 'feedback'
  | 'progression'
  | 'localization'

export interface PedagogyIssue {
  id: string
  phaseId: number
  severity: PedagogySeverity
  category: PedagogyCategory
  title: string
  detail: string
  recommendation: string
}

export interface PhasePedagogyAudit {
  phaseId: number
  title: string
  score: number
  classification: 'excellent' | 'adequate' | 'needs-review' | 'critical'
  strengths: string[]
  issues: PedagogyIssue[]
  metrics: {
    lessonBlocks: number
    codeBlocks: number
    exercises: number
    gradedExercises: number
    quizQuestions: number
    examTests: number
    hiddenExamTests: number
  }
}

export interface CurriculumPedagogyAudit {
  generatedAt: string
  phases: PhasePedagogyAudit[]
  summary: {
    totalPhases: number
    averageScore: number
    excellent: number
    adequate: number
    needsReview: number
    critical: number
    issueCount: number
    criticalIssues: number
    highIssues: number
  }
}

const activeReasoningTokens = [
  'predict', 'preveja', 'prediction', 'previsão', 'change', 'mude', 'modify', 'modifique',
  'explain', 'explique', 'compare', 'compare',
]

function hasMeaningfulText(value: string | undefined, minimum = 24) {
  return Boolean(value && value.trim().length >= minimum)
}

function includesAny(text: string, tokens: string[]) {
  const normalized = text.toLocaleLowerCase()
  return tokens.some(token => normalized.includes(token))
}

function exerciseText(exercise: Exercise) {
  return [
    exercise.title.en,
    exercise.title.pt,
    exercise.description.en,
    exercise.description.pt,
    ...(exercise.hints || []).flatMap(hint => [hint.en, hint.pt]),
  ].join(' ')
}

function hasUsefulExplanation(question: QuizQuestion) {
  return hasMeaningfulText(question.explanation.en, 20) && hasMeaningfulText(question.explanation.pt, 20)
}

function issue(
  phase: Phase,
  severity: PedagogySeverity,
  category: PedagogyCategory,
  suffix: string,
  title: string,
  detail: string,
  recommendation: string,
): PedagogyIssue {
  return {
    id: `phase-${phase.id}-${suffix}`,
    phaseId: phase.id,
    severity,
    category,
    title,
    detail,
    recommendation,
  }
}

function classify(score: number): PhasePedagogyAudit['classification'] {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'adequate'
  if (score >= 55) return 'needs-review'
  return 'critical'
}

export function auditPhasePedagogy(phase: Phase): PhasePedagogyAudit {
  const issues: PedagogyIssue[] = []
  const strengths: string[] = []
  const lessonBlocks = phase.lesson.blocks.length
  const codeBlocks = phase.lesson.blocks.filter(block => block.type === 'code').length
  const gradedExercises = phase.exercises.filter(exercise => (exercise.grading?.tests?.length || 0) > 0).length
  const examTests = phase.exam.testCases.length
  const hiddenExamTests = phase.exam.testCases.filter(test => test.hidden).length

  if (!hasMeaningfulText(phase.description.en) || !hasMeaningfulText(phase.description.pt)) {
    issues.push(issue(
      phase, 'high', 'objective', 'weak-description',
      'Phase purpose is too vague',
      'The phase description does not clearly communicate a meaningful learning goal in both languages.',
      'Rewrite the description as an observable capability the learner should demonstrate.',
    ))
  } else {
    strengths.push('Clear bilingual phase purpose')
  }

  if (lessonBlocks < 8) {
    issues.push(issue(
      phase, 'high', 'lesson-depth', 'short-lesson',
      'Lesson is too shallow',
      `The lesson has ${lessonBlocks} blocks; the quality baseline is at least 8 purposeful blocks.`,
      'Add a mental model, worked example, common mistake, professional use and mastery summary.',
    ))
  }

  if (codeBlocks < 2 && phase.id !== 0) {
    issues.push(issue(
      phase, 'medium', 'lesson-depth', 'few-code-examples',
      'Insufficient worked code',
      `Only ${codeBlocks} code block(s) are present.`,
      'Include a minimal example and a realistic professional example with an explanation of the difference.',
    ))
  } else if (codeBlocks >= 2) {
    strengths.push('Multiple worked code examples')
  }

  const hasWarning = phase.lesson.blocks.some(block => block.type === 'warning')
  const hasTip = phase.lesson.blocks.some(block => block.type === 'tip')
  if (!hasWarning || !hasTip) {
    issues.push(issue(
      phase, 'low', 'feedback', 'missing-mistake-or-tip',
      'Lesson lacks preventive guidance',
      'The lesson should contain both a common-mistake warning and a practical best-practice tip.',
      'Add one realistic failure mode and one concrete professional habit.',
    ))
  }

  if (phase.exercises.length < 3) {
    issues.push(issue(
      phase, 'critical', 'active-practice', 'too-few-exercises',
      'Not enough deliberate practice',
      `The phase contains ${phase.exercises.length} exercise(s).`,
      'Provide at least three levels: guided reasoning, independent implementation and challenge/hardening.',
    ))
  }

  const firstExercise = phase.exercises[0]
  if (firstExercise) {
    const text = exerciseText(firstExercise)
    const activeTokenCount = activeReasoningTokens.filter(token => text.toLocaleLowerCase().includes(token)).length
    if (activeTokenCount < 3) {
      issues.push(issue(
        phase, 'high', 'active-practice', 'passive-first-exercise',
        'First exercise permits passive execution',
        'The first exercise does not clearly require prediction, a meaningful code change and an explanation.',
        'Use the sequence Predict → Run → Change → Run again → Explain, and prevent completion after a single unchanged run.',
      ))
    } else {
      strengths.push('First exercise requires active reasoning')
    }
  }

  if (gradedExercises < Math.min(2, phase.exercises.length)) {
    issues.push(issue(
      phase, 'high', 'assessment', 'weak-exercise-grading',
      'Too little verified practice',
      `${gradedExercises} of ${phase.exercises.length} exercises have automated behavioral tests.`,
      'At least the independent and challenge exercises should use visible and hidden behavioral tests.',
    ))
  } else {
    strengths.push('Independent practice is behaviorally graded')
  }

  const exercisesWithoutHints = phase.exercises.filter(exercise => !exercise.hints || exercise.hints.length < 2)
  if (exercisesWithoutHints.length > 0) {
    issues.push(issue(
      phase, 'medium', 'feedback', 'weak-hints',
      'Hints are insufficiently scaffolded',
      `${exercisesWithoutHints.length} exercise(s) have fewer than two hints.`,
      'Provide progressive hints: concept reminder first, structural next step second, never the complete answer.',
    ))
  }

  if (phase.quiz.length < 3) {
    issues.push(issue(
      phase, 'high', 'assessment', 'short-quiz',
      'Quiz samples too little knowledge',
      `The quiz contains ${phase.quiz.length} question(s).`,
      'Use at least three questions covering concept, code reading and error diagnosis.',
    ))
  }

  const weakQuizExplanations = phase.quiz.filter(question => !hasUsefulExplanation(question))
  if (weakQuizExplanations.length > 0) {
    issues.push(issue(
      phase, 'medium', 'feedback', 'weak-quiz-explanations',
      'Quiz feedback does not teach enough',
      `${weakQuizExplanations.length} question(s) lack a meaningful bilingual explanation.`,
      'Explain why the correct option works and why the most tempting wrong option fails.',
    ))
  } else if (phase.quiz.length > 0) {
    strengths.push('Quiz answers include bilingual explanations')
  }

  if (examTests < 2) {
    issues.push(issue(
      phase, 'critical', 'assessment', 'weak-exam',
      'Exam does not prove generalization',
      `The exam has ${examTests} behavioral test(s).`,
      'Use at least one visible scenario and one materially different hidden scenario.',
    ))
  }

  if (hiddenExamTests < 1) {
    issues.push(issue(
      phase, 'high', 'assessment', 'no-hidden-exam-test',
      'Exam can be solved by memorizing the example',
      'No hidden behavioral scenario is present.',
      'Add a hidden case that changes values and edge conditions while preserving the same contract.',
    ))
  } else {
    strengths.push('Exam includes hidden generalization checks')
  }

  const allLocalized = [
    phase.title,
    phase.description,
    phase.lesson.title,
    phase.exam.title,
    phase.exam.scenario,
  ].every(value => hasMeaningfulText(value.en, 2) && hasMeaningfulText(value.pt, 2))

  if (!allLocalized) {
    issues.push(issue(
      phase, 'high', 'localization', 'missing-core-translation',
      'Core instructional text is missing a translation',
      'At least one core phase field is empty in English or Portuguese.',
      'Complete both languages before release.',
    ))
  }

  const deductions: Record<PedagogySeverity, number> = {
    critical: 25,
    high: 12,
    medium: 6,
    low: 3,
  }
  const score = Math.max(0, 100 - issues.reduce((total, current) => total + deductions[current.severity], 0))

  return {
    phaseId: phase.id,
    title: phase.title.en,
    score,
    classification: classify(score),
    strengths,
    issues,
    metrics: {
      lessonBlocks,
      codeBlocks,
      exercises: phase.exercises.length,
      gradedExercises,
      quizQuestions: phase.quiz.length,
      examTests,
      hiddenExamTests,
    },
  }
}

export function auditCurriculumPedagogy(phases: Phase[]): CurriculumPedagogyAudit {
  const audited = phases.map(auditPhasePedagogy)
  const issues = audited.flatMap(phase => phase.issues)
  const averageScore = audited.length
    ? Math.round((audited.reduce((total, phase) => total + phase.score, 0) / audited.length) * 10) / 10
    : 0

  return {
    generatedAt: new Date().toISOString(),
    phases: audited,
    summary: {
      totalPhases: audited.length,
      averageScore,
      excellent: audited.filter(phase => phase.classification === 'excellent').length,
      adequate: audited.filter(phase => phase.classification === 'adequate').length,
      needsReview: audited.filter(phase => phase.classification === 'needs-review').length,
      critical: audited.filter(phase => phase.classification === 'critical').length,
      issueCount: issues.length,
      criticalIssues: issues.filter(item => item.severity === 'critical').length,
      highIssues: issues.filter(item => item.severity === 'high').length,
    },
  }
}
