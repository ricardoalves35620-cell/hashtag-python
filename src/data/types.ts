export type Lang = 'en' | 'pt'

export interface Bilingual {
  en: string
  pt: string
}

export interface LessonBlock {
  type: 'heading' | 'text' | 'code' | 'video' | 'tip' | 'warning'
  content?: Bilingual
  code?: string
  language?: string
  videoUrl?: string
  videoTitle?: Bilingual
  videoDuration?: string
  alternate?: Bilingual
}

export interface Exercise {
  id: string
  title: Bilingual
  description: Bilingual
  starterCode: string
  hints: Bilingual[]
  sampleOutput?: Bilingual
  grading?: ExerciseGrading
}

export interface ExerciseGrading {
  tests?: TestCase[]
  codeRequirements?: CodeRequirement[]
  timeoutMs?: number
}

export interface QuizQuestion {
  id: string
  question: Bilingual
  options: Bilingual[]
  correctIndex: number
  explanation: Bilingual
}

export type CheckType =
  | 'contains'
  | 'contains_any'
  | 'not_contains'
  | 'no_error'
  | 'equals'
  | 'matches'
  | 'line_count'
  | 'numeric_equals'

export type CheckTarget = 'output' | 'test_output'

export interface CodeRequirement {
  kind: 'node' | 'call' | 'function' | 'import' | 'assignment' | 'main_guard'
  value: string
  minCount?: number
}

export type TextComparisonMode = 'exact' | 'normalized'

export interface Check {
  type: CheckType
  value?: string | string[] | number
  caseSensitive?: boolean
  target?: CheckTarget
  tolerance?: number
  /** Defaults to normalized for human-facing text checks; exact preserves accents and spacing. */
  textMode?: TextComparisonMode
}

export interface TestCase {
  id: string
  description: Bilingual
  inputs: string[]           // fallback positional inputs
  inputMap?: Record<string, string>  // keyword→value for order-independent matching
  checks: Check[]
  points: number
  hidden?: boolean
  timeoutMs?: number
  setupCode?: string
  afterCode?: string
  codeRequirements?: CodeRequirement[]
}

export interface Exam {
  title: Bilingual
  scenario: Bilingual
  requirements: { en: string[]; pt: string[] }
  starterCode: string
  testCases: TestCase[]
}

export type CurriculumTrack = 'core' | 'ai-local'
export type PhaseStage = 'base' | 'professional' | 'advanced' | 'engineering' | 'ai-data' | 'ai-deep' | 'ai-local'

export interface Phase {
  id: number
  title: Bilingual
  description: Bilingual
  icon: string
  libraries: string[]
  track?: CurriculumTrack
  stage?: PhaseStage
  estimatedHours?: number
  desktopRequired?: boolean
  labPath?: string
  installCommand?: string
  lesson: {
    title: Bilingual
    blocks: LessonBlock[]
  }
  exercises: Exercise[]
  quiz: QuizQuestion[]
  exam: Exam
}

export interface UserProgress {
  phase_id: number
  user_id?: string
  lesson_done: boolean
  exercises_done: boolean
  quiz_done: boolean
  exam_done?: boolean
  exam_score: number | null
  exam_passed: boolean
  updated_at?: string
}
