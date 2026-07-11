import type { Exercise, Lang } from '../data/types'

function normalize(value: string) {
  return value
    .replace(/\r/g, '')
    .replace(/['"]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .toLowerCase()
}

function expectedLineSets(exercise: Exercise, lang: Lang) {
  if (!exercise.sampleOutput) return []
  const languages: Lang[] = lang === 'en' ? ['en', 'pt'] : ['pt', 'en']
  return languages.map(language => exercise.sampleOutput![language]
    .split('\n')
    .map(line => normalize(line))
    .filter(line => line && !line.includes('...') && !line.includes('…'))
  ).filter(lines => lines.length > 0)
}

export function validateExerciseRun(exercise: Exercise, lang: Lang, code: string, output: string, error: string | null) {
  if (error) {
    return { passed: false, message: lang === 'en' ? 'Fix the error before continuing.' : 'Corrija o erro antes de continuar.' }
  }

  const meaningfulCode = code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))

  if (meaningfulCode.length === 0 || meaningfulCode.every(line => line === 'pass')) {
    return { passed: false, message: lang === 'en' ? 'Write a solution before continuing.' : 'Escreva uma solução antes de continuar.' }
  }

  if (/___|\bTODO\b|YOUR CODE HERE/i.test(code)) {
    return { passed: false, message: lang === 'en' ? 'Complete every placeholder before continuing.' : 'Complete todos os espaços antes de continuar.' }
  }

  const lineSets = expectedLineSets(exercise, lang)
  if (lineSets.length > 0) {
    const normalizedOutput = normalize(output)
    const matchesOneLanguage = lineSets.some(lines => lines.every(line => normalizedOutput.includes(line)))
    if (!matchesOneLanguage) {
      return {
        passed: false,
        message: lang === 'en'
          ? 'The code ran, but the result still differs from the expected output.'
          : 'O código executou, mas o resultado ainda difere da saída esperada.'
      }
    }
  }

  return {
    passed: true,
    message: lang === 'en' ? 'Exercise validated. You can continue.' : 'Exercício validado. Você pode continuar.'
  }
}

interface StructureRule {
  minPhase: number
  patterns: RegExp[]
  message: { en: string; pt: string }
}

const STRUCTURE_RULES: Record<number, StructureRule> = {
  4: { minPhase: 4, patterns: [/\binput\s*\(/], message: { en: 'Use input() as required by this phase.', pt: 'Use input() como exigido nesta fase.' } },
  5: { minPhase: 5, patterns: [/\bif\b/, /\belse\s*:/], message: { en: 'Your solution must make a real if/else decision.', pt: 'Sua solução precisa tomar uma decisão real com if/else.' } },
  6: { minPhase: 6, patterns: [/\belif\b/], message: { en: 'Use elif to represent the multiple cases.', pt: 'Use elif para representar os vários casos.' } },
  7: { minPhase: 7, patterns: [/\bwhile\b/], message: { en: 'Use a while loop in this exam.', pt: 'Use um loop while neste exame.' } },
  8: { minPhase: 8, patterns: [/\bfor\b/, /\bin\b/], message: { en: 'Use a for loop to process the collection.', pt: 'Use um loop for para processar a coleção.' } },
  10: { minPhase: 10, patterns: [/\{[\s\S]*:/], message: { en: 'Represent the data with a dictionary.', pt: 'Represente os dados com um dicionário.' } },
  12: { minPhase: 12, patterns: [/\[[^\]]+\bfor\b[^\]]+\]/s], message: { en: 'Use a real list comprehension.', pt: 'Use uma compreensão de lista real.' } },
  13: { minPhase: 13, patterns: [/\bdef\s+[a-zA-Z_]\w*\s*\(/], message: { en: 'Create and call a function instead of printing fixed answers.', pt: 'Crie e chame uma função em vez de imprimir respostas fixas.' } },
  15: { minPhase: 15, patterns: [/def[\s\S]+(?:"""|''')/], message: { en: 'Document the function with a docstring.', pt: 'Documente a função com uma docstring.' } },
  17: { minPhase: 17, patterns: [/\bopen\s*\(/], message: { en: 'Use Python file handling in this exam.', pt: 'Use manipulação de arquivos Python neste exame.' } },
  18: { minPhase: 18, patterns: [/\bopen\s*\(/], message: { en: 'Use Python file handling in this exam.', pt: 'Use manipulação de arquivos Python neste exame.' } },
  19: { minPhase: 19, patterns: [/\bjson\b/], message: { en: 'Use the json module as required.', pt: 'Use o módulo json como exigido.' } },
  20: { minPhase: 20, patterns: [/\b(?:datetime|date|timedelta)\b/], message: { en: 'Use the datetime tools taught in this phase.', pt: 'Use as ferramentas de data e hora ensinadas nesta fase.' } },
  21: { minPhase: 21, patterns: [/\brandom\b/], message: { en: 'Use the random module as required.', pt: 'Use o módulo random como exigido.' } },
  22: { minPhase: 22, patterns: [/\bmath\b/], message: { en: 'Use the math module as required.', pt: 'Use o módulo math como exigido.' } },
  23: { minPhase: 23, patterns: [/\btry\s*:/, /\bexcept\b/], message: { en: 'Handle failures with try/except.', pt: 'Trate falhas com try/except.' } },
  24: { minPhase: 24, patterns: [/\bdef\s+[a-zA-Z_]\w*\s*\(/], message: { en: 'The project must be organized into functions.', pt: 'O projeto precisa estar organizado em funções.' } },
  25: { minPhase: 25, patterns: [/\bdef\s+[a-zA-Z_]\w*\s*\(/, /(?:\[|\{)/], message: { en: 'Use functions and a collection for the CRUD project.', pt: 'Use funções e uma coleção no projeto CRUD.' } },
  27: { minPhase: 27, patterns: [/\bdef\s+[a-zA-Z_]\w*\s*\(/, /\btry\s*:/, /\bexcept\b/], message: { en: 'The capstone must use functions and error handling.', pt: 'O capstone precisa usar funções e tratamento de erros.' } }
}

export function validateExamStructure(phaseId: number, code: string, lang: Lang) {
  const rule = STRUCTURE_RULES[phaseId]
  if (!rule) return { passed: true, message: '' }
  const passed = rule.patterns.every(pattern => pattern.test(code))
  return { passed, message: passed ? '' : rule.message[lang] }
}
