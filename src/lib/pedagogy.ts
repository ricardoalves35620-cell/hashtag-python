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


function stageDefaults(phase: Phase, lang: Lang) {
  const stage = phase.stage || 'base'
  const values = {
    base: {
      mistakes: {
        en: ['Changing several things before checking one prediction.', 'Ignoring the first useful traceback line.', 'Printing a fixed answer instead of calculating from variables.'],
        pt: ['Alterar várias coisas antes de verificar uma previsão.', 'Ignorar a primeira linha útil do traceback.', 'Imprimir uma resposta fixa em vez de calcular com variáveis.'],
      },
      context: {
        en: 'This practice builds the habit of predicting, testing one change and explaining the result with concrete evidence.',
        pt: 'Esta prática desenvolve o hábito de prever, testar uma alteração e explicar o resultado com evidências concretas.',
      },
    },
    professional: {
      mistakes: {
        en: ['Coding before defining the input and output contract.', 'Mixing validation, business rules and presentation in one block.', 'Handling only the visible example.'],
        pt: ['Programar antes de definir o contrato de entrada e saída.', 'Misturar validação, regras e apresentação em um único bloco.', 'Tratar apenas o exemplo visível.'],
      },
      context: {
        en: 'This practice turns a written requirement into small responsibilities that can be reviewed, tested and maintained by a team.',
        pt: 'Esta prática transforma um requisito escrito em responsabilidades pequenas que uma equipe consegue revisar, testar e manter.',
      },
    },
    advanced: {
      mistakes: {
        en: ['Choosing an advanced technique without measuring its trade-offs.', 'Ignoring complexity or memory behavior.', 'Testing only the happy path.'],
        pt: ['Escolher uma técnica avançada sem medir seus trade-offs.', 'Ignorar complexidade ou uso de memória.', 'Testar apenas o caminho feliz.'],
      },
      context: {
        en: 'This practice trains you to justify an implementation with complexity, failure behavior and measurable evidence.',
        pt: 'Esta prática treina você a justificar uma implementação com complexidade, comportamento de falha e evidências mensuráveis.',
      },
    },
    engineering: {
      mistakes: {
        en: ['Treating logs, tests and deployment as work for later.', 'Hiding failures instead of making recovery explicit.', 'Coupling infrastructure details to domain rules.'],
        pt: ['Tratar logs, testes e deploy como trabalho para depois.', 'Esconder falhas em vez de explicitar a recuperação.', 'Acoplar detalhes de infraestrutura às regras de domínio.'],
      },
      context: {
        en: 'This practice develops production habits: stable boundaries, useful diagnostics, repeatable tests and safe change.',
        pt: 'Esta prática desenvolve hábitos de produção: fronteiras estáveis, diagnósticos úteis, testes repetíveis e mudanças seguras.',
      },
    },
    'ai-data': {
      mistakes: {
        en: ['Training before checking data shape and leakage.', 'Evaluating on data seen during training.', 'Ignoring missing or imbalanced cases.'],
        pt: ['Treinar antes de verificar formato e vazamento de dados.', 'Avaliar com dados vistos no treino.', 'Ignorar casos ausentes ou desbalanceados.'],
      },
      context: {
        en: 'This practice treats preprocessing, splits, metrics and the model as one versioned data product.',
        pt: 'Esta prática trata pré-processamento, divisões, métricas e modelo como um único produto de dados versionado.',
      },
    },
    'ai-deep': {
      mistakes: {
        en: ['Losing track of tensor shapes.', 'Assuming lower loss means better real-world behavior.', 'Ignoring numerical stability and compute cost.'],
        pt: ['Perder o controle dos formatos dos tensores.', 'Assumir que loss menor significa comportamento real melhor.', 'Ignorar estabilidade numérica e custo computacional.'],
      },
      context: {
        en: 'This practice connects tensor behavior, optimization, evaluation and hardware cost instead of treating training as a black box.',
        pt: 'Esta prática conecta comportamento dos tensores, otimização, avaliação e custo de hardware em vez de tratar o treino como caixa-preta.',
      },
    },
    'ai-local': {
      mistakes: {
        en: ['Ignoring privacy, licenses or hardware limits.', 'Allowing tools to act without explicit permissions.', 'Generating an answer when evidence is insufficient.'],
        pt: ['Ignorar privacidade, licenças ou limites do hardware.', 'Permitir ações de ferramentas sem permissões explícitas.', 'Gerar uma resposta quando a evidência é insuficiente.'],
      },
      context: {
        en: 'This practice builds local AI that is private, measurable, permission-aware and honest about uncertainty.',
        pt: 'Esta prática constrói IA local privada, mensurável, consciente de permissões e honesta sobre incerteza.',
      },
    },
  } as const

  return values[stage]
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
  const stage = stageDefaults(phase, lang)

  return {
    objective: exercise.objective?.[lang] || exercise.description[lang],
    difficulty,
    estimatedMinutes: exercise.estimatedMinutes || (difficulty === 'guided' ? 8 : difficulty === 'independent' ? 12 : 18),
    skills,
    successCriteria: exercise.successCriteria?.[lang] || defaults,
    commonMistakes: exercise.commonMistakes?.[lang] || [...stage.mistakes[lang]],
    workplaceContext: exercise.workplaceContext?.[lang] || stage.context[lang],
  }
}
