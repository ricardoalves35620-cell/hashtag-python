import type { Exercise, Lang, Phase } from '../data/types'
import { getSkill } from '../data/skills'
import { getSkillsForPhase } from '../data/skills'

export type ExerciseDifficulty = 'guided' | 'independent' | 'challenge'

export interface ExercisePedagogy {
  objective: string
  difficulty: ExerciseDifficulty
  estimatedMinutes: number
  skills: string[]
  successCriteria: string[]
  commonMistakes: string[]
  workplaceContext: string
}

const DIFFICULTY_LABELS: Record<ExerciseDifficulty, { en: string; pt: string }> = {
  guided: { en: 'Guided', pt: 'Guiado' },
  independent: { en: 'Independent', pt: 'Independente' },
  challenge: { en: 'Challenge', pt: 'Desafio' },
}

export function difficultyLabel(value: ExerciseDifficulty, lang: Lang) {
  return DIFFICULTY_LABELS[value][lang]
}

function inferDifficulty(index: number, total: number): ExerciseDifficulty {
  if (index === 0) return 'guided'
  if (index === total - 1 && total > 2) return 'challenge'
  return 'independent'
}

function requirementText(exercise: Exercise, lang: Lang): string[] {
  const items: string[] = []
  if (exercise.sampleOutput) items.push(lang === 'en' ? 'Produce the requested visible result.' : 'Produzir o resultado visível solicitado.')
  if (exercise.grading?.tests?.some(test => test.hidden)) items.push(lang === 'en' ? 'Work with values beyond the visible example.' : 'Funcionar com valores além do exemplo visível.')
  if (exercise.grading?.codeRequirements?.length) items.push(lang === 'en' ? 'Use the Python structure taught in this phase.' : 'Usar a estrutura Python ensinada nesta fase.')
  items.push(lang === 'en' ? 'Finish without syntax or runtime errors.' : 'Terminar sem erros de sintaxe ou execução.')
  return [...new Set(items)]
}

export function getExercisePedagogy(phase: Phase, exercise: Exercise, index: number, lang: Lang): ExercisePedagogy {
  const difficulty = exercise.difficulty || inferDifficulty(index, phase.exercises.length)
  const skillIds = exercise.skillIds?.length ? exercise.skillIds : getSkillsForPhase(phase.id)
  const skills = skillIds.map(id => getSkill(id)?.title[lang]).filter((value): value is string => Boolean(value)).slice(0, 4)
  const defaults = requirementText(exercise, lang)

  return {
    objective: exercise.objective?.[lang] || exercise.description[lang],
    difficulty,
    estimatedMinutes: exercise.estimatedMinutes || (difficulty === 'guided' ? 8 : difficulty === 'independent' ? 12 : 18),
    skills,
    successCriteria: exercise.successCriteria?.[lang] || defaults,
    commonMistakes: exercise.commonMistakes?.[lang] || [
      lang === 'en' ? 'Copying the visible answer instead of using variables.' : 'Copiar a resposta visível em vez de usar variáveis.',
      lang === 'en' ? 'Changing several parts before testing one hypothesis.' : 'Alterar várias partes antes de testar uma hipótese.',
      lang === 'en' ? 'Ignoring the first useful line of the traceback.' : 'Ignorar a primeira linha útil do traceback.',
    ],
    workplaceContext: exercise.workplaceContext?.[lang] || (lang === 'en'
      ? 'This practice builds the habit of turning a requirement into behavior that can be tested and reviewed.'
      : 'Esta prática desenvolve o hábito de transformar um requisito em comportamento testável e revisável.'),
  }
}
