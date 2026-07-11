import type { Lang, QuizQuestion } from '../data/types'
import type { Phase } from '../data/types'
import { getSkill, getSkillsForPhase, SKILLS } from '../data/skills'

export type LearningActivity = 'exercise' | 'quiz' | 'exam' | 'diagnostic' | 'review'

export interface LearningAttemptInput {
  phaseId: number
  activity: LearningActivity
  itemId: string
  skillIds?: string[]
  score: number
  passed: boolean
  hintsUsed?: number
  errorCategory?: string | null
}

export interface LearningAttempt extends LearningAttemptInput {
  id: string
  timestamp: number
}

export interface SkillState {
  skillId: string
  mastery: number
  attempts: number
  successes: number
  streak: number
  intervalDays: number
  lastPracticedAt: number
  nextReviewAt: number
}

export interface LearningState {
  version: 1
  updatedAt: number
  diagnosticCompletedAt: number | null
  attempts: LearningAttempt[]
  skills: Record<string, SkillState>
}

export interface ReviewItem {
  id: string
  phaseId: number
  skillId: string
  question: QuizQuestion
}

const DAY_MS = 24 * 60 * 60 * 1000
const STORAGE_PREFIX = 'hp_learning_v1_'
const MAX_ATTEMPTS = 500

export function createEmptyLearningState(): LearningState {
  return { version: 1, updatedAt: Date.now(), diagnosticCompletedAt: null, attempts: [], skills: {} }
}

export function clampScore(score: number) {
  if (!Number.isFinite(score)) return 0
  return Math.max(0, Math.min(100, Math.round(score)))
}

function nextInterval(streak: number) {
  const intervals = [1, 3, 7, 14, 30, 60]
  return intervals[Math.min(Math.max(streak - 1, 0), intervals.length - 1)]
}

export function applyLearningAttempt(
  current: LearningState,
  input: LearningAttemptInput,
  now = Date.now(),
): LearningState {
  const score = clampScore(input.score)
  const skillIds = input.skillIds?.length ? input.skillIds : getSkillsForPhase(input.phaseId)
  const attempt: LearningAttempt = {
    ...input,
    score,
    skillIds,
    id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: now,
  }

  const skills = { ...current.skills }
  for (const skillId of skillIds) {
    const previous = skills[skillId]
    const successful = input.passed && score >= 80
    const hintsPenalty = Math.min((input.hintsUsed || 0) * 4, 16)
    const effectiveScore = Math.max(0, score - hintsPenalty)
    const attempts = (previous?.attempts || 0) + 1
    const successes = (previous?.successes || 0) + (successful ? 1 : 0)
    const mastery = previous
      ? Math.round(previous.mastery * 0.7 + effectiveScore * 0.3)
      : effectiveScore
    const streak = successful ? (previous?.streak || 0) + 1 : 0
    const intervalDays = successful ? nextInterval(streak) : 0

    skills[skillId] = {
      skillId,
      mastery,
      attempts,
      successes,
      streak,
      intervalDays,
      lastPracticedAt: now,
      nextReviewAt: now + intervalDays * DAY_MS,
    }
  }

  return {
    ...current,
    updatedAt: now,
    attempts: [...current.attempts, attempt].slice(-MAX_ATTEMPTS),
    skills,
  }
}

export function applyLearningAttempts(
  current: LearningState,
  inputs: LearningAttemptInput[],
  now = Date.now(),
): LearningState {
  return inputs.reduce((state, input, index) => applyLearningAttempt(state, input, now + index), current)
}

export function markDiagnosticComplete(current: LearningState, now = Date.now()): LearningState {
  return { ...current, diagnosticCompletedAt: now, updatedAt: now }
}

export function getDueSkillStates(state: LearningState, now = Date.now()): SkillState[] {
  return Object.values(state.skills)
    .filter(skill => skill.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt || a.mastery - b.mastery)
}

export function getWeakestSkillStates(state: LearningState, limit = 3): SkillState[] {
  return Object.values(state.skills)
    .sort((a, b) => a.mastery - b.mastery || b.attempts - a.attempts)
    .slice(0, limit)
}

export function masteryLabel(mastery: number, lang: Lang) {
  if (mastery >= 85) return lang === 'en' ? 'Strong' : 'Forte'
  if (mastery >= 70) return lang === 'en' ? 'Developing' : 'Em desenvolvimento'
  if (mastery >= 40) return lang === 'en' ? 'Needs practice' : 'Precisa praticar'
  return lang === 'en' ? 'Starting' : 'Começando'
}

function questionForSkill(skillId: string, phases: Phase[], offset: number) {
  const definition = getSkill(skillId)
  if (!definition) return null
  const questions = definition.phaseIds.flatMap(phaseId => {
    const phase = phases.find(item => item.id === phaseId)
    return phase?.quiz.map(question => ({ phaseId, question })) || []
  })
  if (!questions.length) return null
  return questions[offset % questions.length]
}

export function buildReviewQueue(
  state: LearningState,
  phases: Phase[],
  maxItems = 8,
  now = Date.now(),
): ReviewItem[] {
  const due = getDueSkillStates(state, now)
  const fallback = getWeakestSkillStates(state, Math.max(maxItems, 3))
  const candidates = due.length ? due : fallback
  const result: ReviewItem[] = []

  candidates.forEach((skill, index) => {
    if (result.length >= maxItems) return
    const found = questionForSkill(skill.skillId, phases, skill.attempts + index)
    if (!found) return
    result.push({
      id: `review-${skill.skillId}-${found.question.id}-${index}`,
      phaseId: found.phaseId,
      skillId: skill.skillId,
      question: found.question,
    })
  })

  return result
}

export function buildDiagnosticQueue(phases: Phase[], maxItems = 10): ReviewItem[] {
  const preferredPhaseIds = [1, 2, 3, 4, 5, 7, 8, 9, 10, 13]
  const result: ReviewItem[] = []
  for (const phaseId of preferredPhaseIds) {
    if (result.length >= maxItems) break
    const phase = phases.find(item => item.id === phaseId)
    const question = phase?.quiz[0]
    const skillId = getSkillsForPhase(phaseId)[0]
    if (question && skillId) {
      result.push({ id: `diagnostic-${phaseId}-${question.id}`, phaseId, skillId, question })
    }
  }
  return result
}

export function getLearningSummary(state: LearningState) {
  const practiced = Object.values(state.skills)
  const averageMastery = practiced.length
    ? Math.round(practiced.reduce((sum, skill) => sum + skill.mastery, 0) / practiced.length)
    : 0
  return {
    practicedSkills: practiced.length,
    totalSkills: SKILLS.length,
    averageMastery,
    totalAttempts: state.attempts.length,
    successfulAttempts: state.attempts.filter(attempt => attempt.passed).length,
  }
}

export function extractErrorCategory(error: string | null | undefined, timedOut = false) {
  if (timedOut) return 'TimeoutError'
  if (!error) return null
  const match = error.match(/^([A-Za-z]+Error):/)
  return match?.[1] || 'RuntimeError'
}

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`
}

export function loadLearningState(userId: string): LearningState {
  if (typeof localStorage === 'undefined') return createEmptyLearningState()
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return createEmptyLearningState()
    const parsed = JSON.parse(raw) as Partial<LearningState>
    if (parsed.version !== 1) return createEmptyLearningState()
    return {
      version: 1,
      updatedAt: parsed.updatedAt || Date.now(),
      diagnosticCompletedAt: parsed.diagnosticCompletedAt || null,
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts.slice(-MAX_ATTEMPTS) as LearningAttempt[] : [],
      skills: parsed.skills && typeof parsed.skills === 'object' ? parsed.skills as Record<string, SkillState> : {},
    }
  } catch {
    return createEmptyLearningState()
  }
}

export function saveLearningState(userId: string, state: LearningState) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(storageKey(userId), JSON.stringify(state))
}
