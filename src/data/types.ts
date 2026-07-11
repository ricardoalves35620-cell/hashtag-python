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
}

export interface Exercise {
  id: string
  title: Bilingual
  description: Bilingual
  starterCode: string
  hints: Bilingual[]
  sampleOutput?: Bilingual
}

export interface QuizQuestion {
  id: string
  question: Bilingual
  options: Bilingual[]
  correctIndex: number
  explanation: Bilingual
}

export type CheckType = 'contains' | 'contains_any' | 'not_contains' | 'no_error'

export interface Check {
  type: CheckType
  value: string | string[]
  caseSensitive?: boolean
}

export interface TestCase {
  id: string
  description: Bilingual
  inputs: string[]           // fallback positional inputs
  inputMap?: Record<string, string>  // keyword→value for order-independent matching
  checks: Check[]
  points: number
}

export interface Exam {
  title: Bilingual
  scenario: Bilingual
  requirements: { en: string[]; pt: string[] }
  starterCode: string
  testCases: TestCase[]
}

export interface Phase {
  id: number
  title: Bilingual
  description: Bilingual
  icon: string
  libraries: string[]
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
}
