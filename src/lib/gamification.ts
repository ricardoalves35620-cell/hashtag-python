import type { LearningState } from './learningEngine'

export interface GamificationSummary {
  xp: number
  level: number
  currentLevelXp: number
  nextLevelXp: number
  progressPercent: number
  streak: number
  badges: string[]
}

function dateKey(value: number) {
  return new Date(value).toISOString().slice(0, 10)
}

export function calculateGamification(state: LearningState): GamificationSummary {
  const xp = state.attempts.reduce((total, attempt) => {
    const base = Math.max(5, Math.round(attempt.score / 5))
    const passBonus = attempt.passed ? 15 : 0
    const activityBonus = attempt.activity === 'exam' ? 20 : attempt.activity === 'review' ? 10 : 0
    return total + base + passBonus + activityBonus
  }, 0)

  const level = Math.floor(xp / 250) + 1
  const currentLevelXp = xp % 250
  const nextLevelXp = 250
  const progressPercent = Math.round((currentLevelXp / nextLevelXp) * 100)

  const uniqueDays = [...new Set(state.attempts.map(attempt => dateKey(attempt.timestamp)))].sort().reverse()
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  for (const day of uniqueDays) {
    const expected = cursor.toISOString().slice(0, 10)
    if (day === expected) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else if (streak === 0) {
      cursor.setDate(cursor.getDate() - 1)
      if (day === cursor.toISOString().slice(0, 10)) {
        streak = 1
        cursor.setDate(cursor.getDate() - 1)
      } else break
    } else break
  }

  const passed = state.attempts.filter(attempt => attempt.passed)
  const badges: string[] = []
  if (state.attempts.length > 0) badges.push('first-step')
  if (passed.length >= 10) badges.push('consistent')
  if (state.attempts.some(attempt => attempt.activity === 'exam' && attempt.score === 100)) badges.push('perfect-exam')
  if (streak >= 3) badges.push('three-day-streak')
  if (Object.values(state.skills).some(skill => skill.mastery >= 90)) badges.push('skill-master')

  return { xp, level, currentLevelXp, nextLevelXp, progressPercent, streak, badges }
}
