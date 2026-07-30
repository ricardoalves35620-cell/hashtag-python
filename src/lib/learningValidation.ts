import type { CodeRequirement, Exercise, Lang } from '../data/types'
import { meetsCodeRequirement, normalizeAssessmentText, runCode, runExam, type PythonAnalysis, type TestResult } from './pyodide'
import { findPythonPlaceholders } from './placeholders'
import { personalize } from './learnerProfile'
import { describeRequirement } from './requirementLanguage'
import { describeFailure, describeIgnoredInput, gradeBehaviour, type BehaviourReport } from './behaviourGrading'

export interface ValidationItem {
  id: string
  label: string
  passed: boolean
  hidden: boolean
  detail?: string
  why?: string
  fix?: string
  concept?: string
}

export interface ExerciseGrade {
  passed: boolean
  message: string
  output: string
  error: string | null
  timedOut: boolean
  checks: ValidationItem[]
  /**
   * The Python runtime never started, so nothing about the learner's code was
   * actually assessed. Callers must not record an attempt or show failed checks —
   * this is an infrastructure problem, not a wrong answer.
   */
  runtimeUnavailable?: boolean
}

function normalize(value: string) {
  return normalizeAssessmentText(value.replace(/['"]/g, ''))
}

function meaningfulLines(value: string) {
  return value
    .split('\n')
    .map(line => normalize(line))
    .filter(line => line && !line.includes('...') && !line.includes('…'))
}

export function outputSimilarity(exercise: Exercise, lang: Lang, output: string) {
  if (!exercise.sampleOutput) return { passed: true, detail: '' }

  const normalizedOutput = normalize(output)
  const languages: Lang[] = lang === 'en' ? ['en', 'pt'] : ['pt', 'en']

  // A sample line may mark the part that legitimately varies with a placeholder, e.g.
  // "Running: {{file}}". Those lines are matched by pattern, so an exercise that tells
  // the learner to change a value does not then fail them for changing it.
  const lineMatches = (rawLine: string) => {
    // normalize() must be applied here too: it strips accents and quotes exactly as it
    // does for the learner's output. Comparing a raw "Após" against a normalized "apos"
    // fails every accented line, which in Portuguese is most of them.
    const line = normalize(personalize(rawLine))
    if (!line) return true
    if (!line.includes('{{')) return normalizedOutput.includes(line)
    const pattern = line
      .split(/\{\{[^}]*\}\}/)
      .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, match => '\\' + match))
      .join('.+')
    try {
      return new RegExp(pattern, 'i').test(normalizedOutput)
    } catch {
      return normalizedOutput.includes(personalize(line))
    }
  }

  const scores = languages.map(language => {
    const expected = (exercise.sampleOutput![language] || '')
      .replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean)
    if (expected.length === 0) return 1
    const matched = expected.filter(lineMatches).length
    return matched / expected.length
  })

  const numericTokens = Array.from(new Set(
    languages.flatMap(language => personalize(exercise.sampleOutput![language]).match(/-?\d+(?:[.,]\d+)?/g) || [])
  ))
  const hasNumbers = numericTokens.every(token => normalizedOutput.includes(token.replace(',', '.')) || normalizedOutput.includes(token))
  const expectedCount = (exercise.sampleOutput[lang] || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean).length
  const bestScore = Math.max(...scores)
  const threshold = expectedCount <= 2 ? 1 : 0.75

  return {
    passed: bestScore >= threshold && hasNumbers,
    detail: `${Math.round(bestScore * 100)}%`,
  }
}

export function baseValidation(code: string, lang: Lang): { passed: boolean; message: string } {
  const meaningfulCode = code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))

  if (meaningfulCode.length === 0 || meaningfulCode.every(line => line === 'pass')) {
    return { passed: false, message: lang === 'en' ? 'Write a solution before continuing.' : 'Escreva uma solução antes de continuar.' }
  }

  const placeholders = findPythonPlaceholders(code)
  if (placeholders.length > 0) {
    const first = placeholders[0]
    return {
      passed: false,
      message: lang === 'en'
        ? `${placeholders.length} placeholder${placeholders.length === 1 ? '' : 's'} remain. Start on line ${first.line}.`
        : `${placeholders.length} lacuna${placeholders.length === 1 ? '' : 's'} ainda precisa${placeholders.length === 1 ? '' : 'm'} ser preenchida${placeholders.length === 1 ? '' : 's'}. Comece pela linha ${first.line}.`,
    }
  }

  return { passed: true, message: '' }
}

const PHASE_REQUIREMENTS: Record<number, CodeRequirement[]> = {
  1: [{ kind: 'call', value: 'print' }],
  2: [{ kind: 'node', value: 'BinOp' }],
  3: [{ kind: 'node', value: 'Assign' }],
  4: [{ kind: 'call', value: 'input' }],
  5: [{ kind: 'node', value: 'If' }],
  6: [{ kind: 'node', value: 'If' }],
  7: [{ kind: 'node', value: 'While' }],
  8: [{ kind: 'node', value: 'For' }],
  9: [{ kind: 'node', value: 'List' }],
  10: [{ kind: 'node', value: 'Dict' }],
  11: [{ kind: 'node', value: 'List' }, { kind: 'node', value: 'Dict' }],
  12: [{ kind: 'node', value: 'ListComp' }],
  13: [{ kind: 'node', value: 'FunctionDef' }],
  14: [{ kind: 'node', value: 'FunctionDef' }],
  15: [{ kind: 'node', value: 'FunctionDef' }],
  16: [{ kind: 'node', value: 'FunctionDef' }],
  17: [{ kind: 'call', value: 'open' }],
  18: [{ kind: 'call', value: 'open' }],
  19: [{ kind: 'import', value: 'json' }],
  20: [{ kind: 'import', value: 'datetime' }],
  21: [{ kind: 'import', value: 'random' }],
  22: [{ kind: 'import', value: 'math' }],
  23: [{ kind: 'node', value: 'Try' }],
  24: [{ kind: 'node', value: 'FunctionDef' }],
  25: [{ kind: 'node', value: 'FunctionDef' }],
  27: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Try' }],
}

const REQUIREMENT_LABELS: Record<string, { en: string; pt: string }> = {
  'call:print': { en: 'Uses print() to produce the result', pt: 'Usa print() para produzir o resultado' },
  'call:input': { en: 'Reads data with input()', pt: 'Lê dados com input()' },
  'call:open': { en: 'Uses Python file handling', pt: 'Usa manipulação de arquivos do Python' },
  'node:BinOp': { en: 'Performs a real calculation', pt: 'Realiza um cálculo de verdade' },
  'node:Assign': { en: 'Stores values in variables', pt: 'Armazena valores em variáveis' },
  'node:If': { en: 'Makes a decision with if', pt: 'Toma uma decisão com if' },
  'node:While': { en: 'Uses a while loop', pt: 'Usa um loop while' },
  'node:For': { en: 'Uses a for loop', pt: 'Usa um loop for' },
  'node:List': { en: 'Uses a list', pt: 'Usa uma lista' },
  'node:Dict': { en: 'Uses a dictionary', pt: 'Usa um dicionário' },
  'node:ListComp': { en: 'Uses a list comprehension', pt: 'Usa uma compreensão de lista' },
  'node:FunctionDef': { en: 'Defines a function', pt: 'Define uma função' },
  'node:Return': { en: 'Returns a value', pt: 'Retorna um valor' },
  'node:Try': { en: 'Handles errors with try/except', pt: 'Trata erros com try/except' },
  'import:json': { en: 'Imports and uses json', pt: 'Importa e usa json' },
  'import:datetime': { en: 'Imports date and time tools', pt: 'Importa ferramentas de data e hora' },
  'import:random': { en: 'Imports random', pt: 'Importa random' },
  'import:math': { en: 'Imports math', pt: 'Importa math' },
}

function requirementLabel(requirement: CodeRequirement, lang: Lang) {
  return REQUIREMENT_LABELS[`${requirement.kind}:${requirement.value}`]?.[lang]
    || (lang === 'en' ? `Uses required structure: ${requirement.value}` : `Usa a estrutura exigida: ${requirement.value}`)
}

/**
 * Says what was expected and what arrived, line by line, instead of announcing that
 * something unspecified went wrong. Only the FIRST differing line is reported: a wall
 * of diffs is as unhelpful as no diff at all.
 */
/**
 * Describe a failure against the FAILING TEST's own expectation.
 *
 * `describeDifference` below compares against the exercise's `sampleOutput`, which is the
 * right thing for an exercise graded on what the learner printed. It is the wrong thing
 * for phases 9-39, where the deliverable is a function and each test calls it with
 * different arguments: the sample describes one call, and the learner may have failed a
 * different one. Every test already carries its own `expected` and `actual`; nothing was
 * reading them.
 */
export function describeAgainstExpected(expected: string, actual: string, lang: Lang): string {
  const wanted = meaningfulLines(expected)
  const got = meaningfulLines(actual)

  if (!got.length) {
    return lang === 'en'
      ? 'Your function returned nothing for this case. Check that every path ends in a return.'
      : 'Sua função não retornou nada neste caso. Verifique se todos os caminhos terminam em return.'
  }
  if (wanted.length === 1 && got.length === 1) return describeLineDifference(wanted[0], got[0], lang)

  const missing = wanted.filter(line => !got.includes(line))
  const extra = got.filter(line => !wanted.includes(line))

  if (!missing.length && !extra.length) {
    return lang === 'en'
      ? `Every value is right — the order is not. This case expects: ${wanted.join(' → ')}.`
      : `Todos os valores estão certos — a ordem não. Este caso espera: ${wanted.join(' → ')}.`
  }
  if (missing.length && !extra.length) {
    return lang === 'en'
      ? `This case also expects ${missing.join(', ')}, which your result does not include.`
      : `Este caso também espera ${missing.join(', ')}, que seu resultado não inclui.`
  }
  if (extra.length && !missing.length) {
    return lang === 'en'
      ? `Your result includes ${extra.join(', ')}, which this case does not expect.`
      : `Seu resultado inclui ${extra.join(', ')}, que este caso não espera.`
  }
  return describeLineDifference(wanted[0], got[0], lang)
}

/**
 * What went wrong on a HIDDEN case, without handing over the answer.
 *
 * A hidden test used to say only "the solution worked for the visible example but failed
 * with another valid input" — true, and useless. The learner cannot see the input, cannot
 * see the expectation, and is left guessing which of their assumptions broke. That is the
 * exact complaint this app was failing on: having to ask someone else what went wrong.
 *
 * The values stay hidden. The SHAPE of the difference does not have to be: how many
 * results, what type, whether the order was the only problem. That is enough to point at
 * an edge case without revealing it.
 */
export function describeHiddenDifference(expected: string, actual: string, lang: Lang): string {
  const wanted = meaningfulLines(expected)
  const got = meaningfulLines(actual)

  if (!got.length) {
    return lang === 'en'
      ? 'On a different input your function returned nothing. An empty or boundary case is likely falling through without a return.'
      : 'Com outra entrada sua função não retornou nada. Um caso vazio ou de limite provavelmente termina sem return.'
  }

  const isNumber = (text: string) => /^-?\d+(\.\d+)?$/.test(text.trim())
  if (wanted.length === 1 && got.length === 1) {
    if (isNumber(wanted[0]) && isNumber(got[0])) {
      const off = Number(got[0]) - Number(wanted[0])
      // Equal as numbers, different as text: 0 against 0.0. Calling that "too low" sends
      // the learner hunting for an arithmetic error they did not make — the value is
      // right and the type is not.
      if (off === 0) {
        return lang === 'en'
          ? 'On a different input the number was right but its type was not — a whole number where a decimal was expected, or the reverse.'
          : 'Com outra entrada o número estava certo, mas o tipo não — um inteiro onde se esperava decimal, ou o contrário.'
      }
      return lang === 'en'
        ? `On a different input your number came out ${off > 0 ? 'too high' : 'too low'}. Check the boundary — an edge case is being counted the wrong way.`
        : `Com outra entrada seu número saiu ${off > 0 ? 'alto demais' : 'baixo demais'}. Verifique o limite — um caso de borda está sendo contado do jeito errado.`
    }
    if (isNumber(wanted[0]) !== isNumber(got[0])) {
      return lang === 'en'
        ? 'On a different input your function returned the wrong kind of value — a number where text was expected, or the reverse.'
        : 'Com outra entrada sua função retornou o tipo errado de valor — um número onde se esperava texto, ou o contrário.'
    }
    return lang === 'en'
      ? 'On a different input your function returned a different value than the rule requires. Re-read the rule and try the smallest input you can think of.'
      : 'Com outra entrada sua função retornou um valor diferente do que a regra exige. Releia a regra e teste a menor entrada que conseguir imaginar.'
  }

  if (wanted.length !== got.length) {
    return lang === 'en'
      ? `On a different input your function produced ${got.length} result${got.length === 1 ? '' : 's'} where ${wanted.length} ${wanted.length === 1 ? 'was' : 'were'} expected. Something is being included or skipped that should not be.`
      : `Com outra entrada sua função produziu ${got.length} resultado${got.length === 1 ? '' : 's'} onde se esperava ${wanted.length}. Algo está sendo incluído ou pulado indevidamente.`
  }
  if (wanted.every(line => got.includes(line))) {
    return lang === 'en'
      ? 'On a different input every value was right but the order was not. Check where the rule says the results are sorted.'
      : 'Com outra entrada todos os valores estavam certos, mas a ordem não. Verifique onde a regra diz que os resultados são ordenados.'
  }
  return lang === 'en'
    ? 'On a different input the number of results was right but at least one value was not. A branch is producing the wrong answer for part of the data.'
    : 'Com outra entrada a quantidade de resultados estava certa, mas ao menos um valor não. Algum caminho produz a resposta errada para parte dos dados.'
}

/**
 * Pick the best account of a failing test.
 *
 * A test that knows what it expected can say how the answer differed. One that does not —
 * a `no_error` or a structural check — falls back to the exercise's sample. A hidden test
 * describes the shape of the difference and never the values.
 */
function explainTestFailure(exercise: Exercise, lang: Lang, result: TestResult): string {
  // `diagnosis` carries the pair even for a hidden test, where `feedback` withholds it.
  //
  // But a `matches` check pins a PATTERN, not an answer. Describing a difference against
  // it printed the raw regular expression at the learner — `Expected a line like
  // "(?=[\s\S]*quote\s+1:..."` — which is how phases 0-8 and 21-27 are graded, so it
  // hit the exercises a beginner sees first. Those fall back to the exercise's own
  // sampleOutput, which is readable and is what the pattern was built from anyway.
  const feedback = result.feedback?.[lang]
  const patterned = result.diagnosis?.kind === 'matches'
  const expected = patterned ? undefined : (result.diagnosis?.expected ?? feedback?.expected)
  const actual = result.diagnosis?.actual ?? feedback?.actual ?? result.output

  if (result.hidden) {
    return expected
      ? describeHiddenDifference(expected, actual || '', lang)
      : (lang === 'en'
        ? 'The solution worked for the visible example but failed with another valid input.'
        : 'A solução funcionou no exemplo visível, mas falhou com outra entrada válida.')
  }
  if (expected) return describeAgainstExpected(expected, actual || '', lang)
  return describeDifference(exercise, lang, result.output)
}

function describeDifference(exercise: Exercise, lang: Lang, actual: string): string {
  const generic = lang === 'en'
    ? 'One of the expected behaviors was not produced.'
    : 'Um dos comportamentos esperados não foi produzido.'

  const sample = exercise.sampleOutput?.[lang] || exercise.sampleOutput?.en
  if (!sample || !actual) return generic

  const expectedLines = meaningfulLines(personalize(sample))
  const actualLines = meaningfulLines(actual)
  const missing = expectedLines.find(line => !actualLines.some(candidate => candidate.includes(line)))

  // EVERY expected line is on screen. This is the case where the old message was worst:
  // it said "one of the expected behaviors was not produced" about output the learner
  // could read, line by line, and which was in fact correct. If something still failed
  // here it is the ORDER, and saying so is the whole difference between a verdict and a
  // lesson.
  if (!missing) {
    const wanted = expectedLines.join(' → ')
    return lang === 'en'
      ? `Every line the task asks for is there and the values are right — they are just printed in a different order. The task lists them as: ${wanted}.`
      : `Todas as linhas que o enunciado pede estão lá e os valores estão certos — só estão impressas em outra ordem. O enunciado lista assim: ${wanted}.`
  }

  const nearest = actualLines.find(candidate => {
    const head = missing.split(/[\s:]+/)[0]
    return head.length > 2 && candidate.includes(head)
  })

  if (nearest) return describeLineDifference(missing, nearest, lang)

  return lang === 'en'
    ? `Your output never contains "${missing}".`
    : `Sua saída não contém "${missing}".`
}

/**
 * Points AT the difference instead of printing two near-identical strings.
 *
 * Reported from the app: a learner produced "Average: 244.28571428571428" where
 * "Average: 244.28571428571428 seconds" was wanted, and read the two quoted strings as
 * identical — reasonably, since they differ by one word at the very end and both were
 * shown lower-cased. "Expected X, got Y" is only useful when X and Y look different.
 */
export function describeLineDifference(expected: string, actual: string, lang: Lang): string {
  let at = 0
  while (at < expected.length && at < actual.length && expected[at] === actual[at]) at += 1
  const shared = expected.slice(0, at)
  const expectedRest = expected.slice(at)
  const actualRest = actual.slice(at)

  if (expectedRest && !actualRest) {
    return lang === 'en'
      ? `Your line matches up to "${shared}" and then stops. It is missing "${expectedRest}" at the end.`
      : `Sua linha está igual até "${shared}" e para aí. Falta "${expectedRest}" no final.`
  }
  if (!expectedRest && actualRest) {
    return lang === 'en'
      ? `Your line is correct up to "${shared}", then has "${actualRest}" extra at the end.`
      : `Sua linha está correta até "${shared}" e depois tem "${actualRest}" a mais no final.`
  }
  if (shared) {
    return lang === 'en'
      ? `The two match up to "${shared}". After that the task expects "${expectedRest}" and yours has "${actualRest}".`
      : `As duas coincidem até "${shared}". Depois disso o enunciado espera "${expectedRest}" e a sua tem "${actualRest}".`
  }
  return lang === 'en'
    ? `Expected a line like "${expected}" but yours reads "${actual}".`
    : `Esperava uma linha como "${expected}", mas a sua é "${actual}".`
}

export async function gradeExercise(
  exercise: Exercise,
  phaseId: number,
  lang: Lang,
  code: string,
  inputs: string[]
): Promise<ExerciseGrade> {
  const base = baseValidation(code, lang)
  if (!base.passed) {
    return { passed: false, message: base.message, output: '', error: null, timedOut: false, checks: [] }
  }

  const run = await runCode(code, inputs, undefined, { timeoutMs: exercise.grading?.timeoutMs })

  // Python never started — offline, blocked CDN, jsDelivr outage. Grading anything
  // here would mark the learner wrong for a network problem and feed a false
  // failure into their skill model.
  if (run.runtimeUnavailable) {
    return {
      passed: false,
      message: lang === 'en'
        ? 'Python could not be loaded, so your code was not checked.'
        : 'Não foi possível carregar o Python, então seu código não foi verificado.',
      output: '',
      error: null,
      timedOut: run.timedOut,
      checks: [],
      runtimeUnavailable: true,
    }
  }

  const checks: ValidationItem[] = [
    {
      id: 'execution',
      label: lang === 'en' ? 'Program finishes without an error' : 'O programa termina sem erro',
      passed: !run.error,
      hidden: false,
      detail: run.timedOut ? (lang === 'en' ? 'Time limit exceeded' : 'Tempo limite excedido') : undefined,
      why: run.timedOut ? (lang === 'en' ? 'A loop or operation did not reach its end before the safety limit.' : 'Um loop ou operação não chegou ao fim antes do limite de segurança.') : run.error ? run.error : undefined,
      fix: run.timedOut ? (lang === 'en' ? 'Check whether loop variables change and whether the stop condition can become true.' : 'Verifique se as variáveis do loop mudam e se a condição de parada pode ser alcançada.') : undefined,
      concept: lang === 'en' ? 'Program execution' : 'Execução do programa',
    },
  ]

  if (!run.error) {
    // An exercise whose own tests never pin the output (only no_error, line_count,
    // structural checks) is deliberately tolerant about presentation. The sample is
    // then illustrative, and this heuristic must not impose a stricter standard than
    // the author wrote — otherwise the app rejects answers that are genuinely correct.
    const CONTENT_CHECKS = new Set(['equals', 'equals_any', 'contains', 'contains_any', 'matches', 'numeric_equals'])
    const contentChecks = (exercise.grading?.tests || []).flatMap(test =>
      (test.checks || []).filter(check => CONTENT_CHECKS.has(String(check.type))))

    // `target: 'test_output'` means the check reads what the GRADER's afterCode printed,
    // not what the learner's program printed. Phases 9-20 ask for a function and call it
    // from afterCode, so a correct solution prints nothing at all.
    //
    // Treating those checks as "the author pinned the output" made this compare the
    // learner's empty stdout against the sample and fail every correct answer in twelve
    // phases: both real tests green, and still "Produces the required result ✗ — the
    // visible result does not match the requested output", at 83%, under a padlock
    // reading "Run this exercise successfully to continue". Found by working through the
    // phases in the browser; no amount of checking the exercise DATA could see it,
    // because the data was right.
    const studentOutputChecks = contentChecks.filter(check => check.target !== 'test_output')
    const gradedByAfterCode = contentChecks.length > 0 && studentOutputChecks.length === 0
    const authorPinsOutput = studentOutputChecks.length > 0

    // The sample describes the run made with the exercise's OWN input values. If the
    // learner typed their own, their output is different and still correct, so the
    // comparison says nothing. The authored tests below run with fixed inputs and
    // remain the real check.
    const canonical = (exercise as { suggestedInputs?: string[] }).suggestedInputs || []
    const usedCanonicalInputs = canonical.length === 0
      || (inputs.length === canonical.length && inputs.every((value, index) => value.trim() === canonical[index].trim()))

    // Whether the output was actually compared against anything.
    const comparedToExpected = authorPinsOutput && usedCanonicalInputs
    const similarity = comparedToExpected
      ? outputSimilarity(exercise, lang, run.output)
      : { passed: Boolean(run.output && run.output.trim()), detail: '' }

    // Nothing to say about stdout when stdout was never the deliverable. Skipping the
    // check is right rather than passing it: a green tick for something unexamined is
    // the same lie in the other direction.
    if (!gradedByAfterCode) checks.push({
      id: 'expected-output',
      // When nothing pins the output — every observation exercise, and any run with
      // the learner's own inputs — the fallback only asks whether anything was
      // printed. Labelling that "Produces the required result" told a learner whose
      // total was 3435 instead of 3535 that their result was required and correct.
      // A check may be lenient; it may not claim to have verified what it never read.
      label: comparedToExpected
        ? (lang === 'en' ? 'Produces the required result' : 'Produz o resultado solicitado')
        : (lang === 'en' ? 'The program produced visible output' : 'O programa produziu saída visível'),
      passed: similarity.passed,
      hidden: false,
      detail: exercise.sampleOutput && comparedToExpected ? similarity.detail : undefined,
      why: similarity.passed
        ? (comparedToExpected ? undefined : (lang === 'en'
            ? 'This step is about observing what the code does, so the result was not compared with an expected output. Check it against the goal yourself.'
            : 'Esta etapa é sobre observar o que o código faz, então o resultado não foi comparado com uma saída esperada. Confira você mesmo com o objetivo.'))
        : (comparedToExpected
            ? (lang === 'en' ? 'The program ran, but the visible result does not match the requested output.' : 'O programa executou, mas o resultado visível não corresponde à saída solicitada.')
            : (lang === 'en' ? 'The program ran but printed nothing, so there is nothing to observe.' : 'O programa executou mas não imprimiu nada, então não há o que observar.')),
      fix: similarity.passed ? undefined : (comparedToExpected
        ? (lang === 'en' ? 'Compare labels, values, line breaks and calculations with the expected output.' : 'Compare rótulos, valores, quebras de linha e cálculos com a saída esperada.')
        : (lang === 'en' ? 'Add a print() so you can see what the code is doing.' : 'Adicione um print() para ver o que o código está fazendo.')),
      concept: lang === 'en' ? 'Output and result' : 'Saída e resultado',
    })
  }

  // ── behavioural grading, PILOT ────────────────────────────────────────────
  //
  // Runs alongside the existing checks and does NOT decide whether the learner passes.
  // The point of the pilot is the disagreement log: every case where the two graders
  // differ is either a bad reference or a bad authored expectation, and both are worth
  // knowing before this replaces anything.
  //
  // Reported as an ordinary ValidationItem so the feedback panel, the skill model and
  // the attempt recorder need no changes. `hidden` keeps it out of the pass ratio.
  if (exercise.behaviour && !run.error) {
    let report: BehaviourReport | null = null
    try {
      report = await gradeBehaviour(exercise.behaviour, code, lang)
    } catch {
      // A broken pilot must never block a learner. Silence here is deliberate.
      report = null
    }

    if (report && !report.runtimeUnavailable && report.results.length > 0) {
      const failed = report.results.filter(item => !item.passed)
      checks.push({
        id: 'behaviour-pilot',
        label: lang === 'en'
          ? 'Works on every case, not only the example'
          : 'Funciona em todos os casos, não só no exemplo',
        passed: report.passed,
        hidden: true,
        // A report can fail with no failing CASE: `ignoresInput` means every case was
        // individually satisfiable but the program never varied. Without this branch the
        // learner is marked wrong and told nothing.
        why: report.ignoresInput
          ? describeIgnoredInput(lang)
          : (failed.length ? describeFailure(failed[0], lang) : undefined),
        fix: (failed.length || report.ignoresInput)
          ? (lang === 'en'
            ? 'Check the boundary values, not just the example in the task.'
            : 'Confira os valores de limite, não apenas o exemplo do enunciado.')
          : undefined,
        concept: lang === 'en' ? 'Correctness across inputs' : 'Correção em vários casos',
      })
    }
  }

  const requirements = exercise.grading?.codeRequirements || PHASE_REQUIREMENTS[phaseId] || []
  for (const requirement of requirements) {
    checks.push({
      id: `structure-${requirement.kind}-${requirement.value}`,
      label: requirementLabel(requirement, lang),
      passed: meetsCodeRequirement(run.analysis, requirement),
      hidden: true,
      why: meetsCodeRequirement(run.analysis, requirement) ? undefined : (lang === 'en' ? `Your solution is missing ${describeRequirement(requirement.kind, String(requirement.value)).what.en}.` : `Falta na sua solução ${describeRequirement(requirement.kind, String(requirement.value)).what.pt}.`),
      fix: meetsCodeRequirement(run.analysis, requirement) ? undefined : describeRequirement(requirement.kind, String(requirement.value)).how[lang],
      concept: requirementLabel(requirement, lang),
    })
  }

  if (phaseId === 15) {
    checks.push({
      id: 'structure-docstring',
      label: lang === 'en' ? 'Documents a function with a real docstring' : 'Documenta uma função com uma docstring real',
      passed: Boolean(run.analysis?.docstringFunctions.length),
      hidden: true,
    })
  }

  let explicitResults: TestResult[] = []
  if (!run.error && exercise.grading?.tests?.length) {
    const graded = await runExam(code, exercise.grading.tests)
    explicitResults = graded.results
    for (const result of explicitResults) {
      checks.push({
        id: `test-${result.id}`,
        label: result.hidden
          ? (lang === 'en' ? 'Passes a hidden behavior test' : 'Passa em um teste oculto de comportamento')
          : result.description[lang],
        passed: result.passed,
        hidden: result.hidden,
        // Naming the difference beats naming the failure. A learner who is told only
        // that "a behaviour was not produced" has to guess which one, and how it differed.
        // Every test carries its own expected and actual. Reading the exercise's
        // sampleOutput instead described the wrong call whenever a phase 9-39 exercise
        // failed a case other than the one the sample shows.
        why: result.passed ? undefined : explainTestFailure(exercise, lang, result),
        fix: result.passed ? undefined : (result.hidden
          ? (lang === 'en' ? 'Do not aim at the example. Write the rule the task states, then try the smallest and the emptiest input you can.' : 'Não mire no exemplo. Escreva a regra que o enunciado descreve e teste a menor entrada e a entrada vazia.')
          : (lang === 'en' ? 'Review the test description and compare the expected behavior with your output.' : 'Revise a descrição do teste e compare o comportamento esperado com sua saída.')),
        concept: lang === 'en' ? 'Generalization and behavior' : 'Generalização e comportamento',
      })
    }
  }

  const passed = checks.length > 0 && checks.every(check => check.passed)
  const failedCount = checks.filter(check => !check.passed).length
  const message = passed
    ? (lang === 'en' ? 'Exercise validated by behavior and code structure.' : 'Exercício validado pelo comportamento e pela estrutura do código.')
    : (lang === 'en'
      ? `${failedCount} validation check${failedCount === 1 ? '' : 's'} still need attention.`
      // Portuguese does not pluralise by appending. "verificação" becomes
      // "verificações" — the stem changes — so `verificação` + `ões` produced
      // "2 verificaçãoões" on every failed exercise with more than one open check.
      : `${failedCount} verificaç${failedCount === 1 ? 'ão' : 'ões'} ainda precisa${failedCount === 1 ? '' : 'm'} de atenção.`)

  return {
    passed,
    message,
    output: run.output,
    error: run.error || run.testError,
    timedOut: run.timedOut || explicitResults.some(result => result.timedOut),
    checks,
  }
}

interface StructureRule {
  requirements: CodeRequirement[]
  message: { en: string; pt: string }
  extra?: (analysis: PythonAnalysis) => boolean
}

const EXAM_STRUCTURE_RULES: Record<number, StructureRule> = {
  4: { requirements: [{ kind: 'call', value: 'input' }], message: { en: 'Use input() as required by this phase.', pt: 'Use input() como exigido nesta fase.' } },
  5: { requirements: [{ kind: 'node', value: 'If' }], message: { en: 'Your solution must make a real decision.', pt: 'Sua solução precisa tomar uma decisão real.' } },
  6: { requirements: [{ kind: 'node', value: 'If', minCount: 2 }], message: { en: 'Represent multiple decision paths, including elif.', pt: 'Represente vários caminhos de decisão, incluindo elif.' } },
  7: { requirements: [{ kind: 'node', value: 'While' }], message: { en: 'Use a while loop in this exam.', pt: 'Use um loop while neste exame.' } },
  8: { requirements: [{ kind: 'node', value: 'For' }], message: { en: 'Use a for loop to process the collection.', pt: 'Use um loop for para processar a coleção.' } },
  10: { requirements: [{ kind: 'node', value: 'Dict' }], message: { en: 'Represent the data with a dictionary.', pt: 'Represente os dados com um dicionário.' } },
  12: { requirements: [{ kind: 'node', value: 'ListComp' }], message: { en: 'Use a real list comprehension.', pt: 'Use uma compreensão de lista real.' } },
  13: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'Create and call a function instead of printing fixed answers.', pt: 'Crie e chame uma função em vez de imprimir respostas fixas.' } },
  15: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'Create a documented function.', pt: 'Crie uma função documentada.' }, extra: analysis => analysis.docstringFunctions.length > 0 },
  17: { requirements: [{ kind: 'call', value: 'split' }, { kind: 'node', value: 'For' }], message: { en: 'Parse every CSV row with split() inside a loop.', pt: 'Interprete cada linha CSV com split() dentro de um loop.' } },
  18: { requirements: [{ kind: 'call', value: 'open' }], message: { en: 'Use Python file handling in this exam.', pt: 'Use manipulação de arquivos Python neste exame.' } },
  19: { requirements: [{ kind: 'import', value: 'json' }], message: { en: 'Use the json module as required.', pt: 'Use o módulo json como exigido.' } },
  20: { requirements: [{ kind: 'import', value: 'datetime' }], message: { en: 'Use the datetime tools taught in this phase.', pt: 'Use as ferramentas de data e hora ensinadas nesta fase.' } },
  21: { requirements: [{ kind: 'import', value: 'random' }], message: { en: 'Use the random module as required.', pt: 'Use o módulo random como exigido.' } },
  22: { requirements: [{ kind: 'import', value: 'math' }], message: { en: 'Use the math module as required.', pt: 'Use o módulo math como exigido.' } },
  23: { requirements: [{ kind: 'node', value: 'Try' }], message: { en: 'Handle failures with try/except.', pt: 'Trate falhas com try/except.' } },
  24: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'The project must be organized into functions.', pt: 'O projeto precisa estar organizado em funções.' } },
  25: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'Use functions for the CRUD project.', pt: 'Use funções no projeto CRUD.' } },
  26: { requirements: [{ kind: 'call', value: 'sum' }, { kind: 'call', value: 'min' }, { kind: 'call', value: 'max' }], message: { en: 'Calculate the report from the dataset instead of printing fixed statistics.', pt: 'Calcule o relatório a partir dos dados em vez de imprimir estatísticas fixas.' } },
  27: { requirements: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Try' }], message: { en: 'The capstone must use functions and error handling.', pt: 'O capstone precisa usar funções e tratamento de erros.' } },
}

export function validateExamStructure(phaseId: number, analysis: PythonAnalysis | null, lang: Lang) {
  const rule = EXAM_STRUCTURE_RULES[phaseId]
  if (!rule) return { passed: true, message: '' }
  if (!analysis) return { passed: false, message: lang === 'en' ? 'The code could not be analyzed.' : 'O código não pôde ser analisado.' }

  const passed = rule.requirements.every(requirement => meetsCodeRequirement(analysis, requirement))
    && (rule.extra ? rule.extra(analysis) : true)
  return { passed, message: passed ? '' : rule.message[lang] }
}
