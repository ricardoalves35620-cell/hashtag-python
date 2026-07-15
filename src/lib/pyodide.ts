import type { Check, CodeRequirement, TestCase } from '../data/types'

export interface PythonFunctionAnalysis {
  name: string
  arguments: string[]
  loadedNames: string[]
  returnLiterals: string[]
}

export interface PythonAnalysis {
  nodeCounts: Record<string, number>
  calls: string[]
  functionNames: string[]
  imports: string[]
  assignedNames: string[]
  literalPrintCalls: number
  literalPrintValues: string[]
  functionDetails: PythonFunctionAnalysis[]
  docstringFunctions: string[]
  hasMainGuard: boolean
}

export interface RunResult {
  output: string
  testOutput: string
  error: string | null
  testError: string | null
  analysis: PythonAnalysis | null
  timedOut: boolean
  durationMs: number
}

interface RunPayload {
  code: string
  inputs?: string[]
  inputMap?: Record<string, string>
  setupCode?: string
  afterCode?: string
}

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
  timer: number
}

const ENGINE_LOAD_TIMEOUT_MS = 90_000
export const DEFAULT_EXECUTION_TIMEOUT_MS = 6_000

class PythonWorkerClient {
  private worker: Worker | null = null
  private readyPromise: Promise<void> | null = null
  private requestSequence = 0
  private pending = new Map<number, PendingRequest>()

  private createWorker(): Worker {
    if (this.worker) return this.worker

    const worker = new Worker(`${import.meta.env.BASE_URL}python.worker.js`)
    worker.onmessage = event => this.handleMessage(event.data)
    worker.onerror = event => {
      this.rejectAll(new Error(event.message || 'Python worker crashed.'))
      this.terminate()
    }
    this.worker = worker
    return worker
  }

  private handleMessage(message: { type: string; requestId: number; result?: unknown; error?: string }) {
    if (message.type === 'status') return
    const pending = this.pending.get(message.requestId)
    if (!pending) return

    window.clearTimeout(pending.timer)
    this.pending.delete(message.requestId)

    if (message.type === 'failure') {
      pending.reject(new Error(message.error || 'Python worker failed.'))
      return
    }

    pending.resolve(message.type === 'ready' ? undefined : message.result)
  }

  private request<T>(type: 'init' | 'run' | 'analyze', payload: RunPayload | undefined, timeoutMs: number): Promise<T> {
    const worker = this.createWorker()
    const requestId = ++this.requestSequence

    return new Promise<T>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.pending.delete(requestId)
        this.terminate()
        reject(new PythonTimeoutError(type === 'init' ? 'Python took too long to load.' : 'Your program exceeded the execution time limit.'))
      }, timeoutMs)

      this.pending.set(requestId, { resolve: resolve as (value: unknown) => void, reject, timer })
      worker.postMessage({ type, requestId, payload })
    })
  }

  prepare(): Promise<void> {
    if (!this.readyPromise) {
      this.readyPromise = this.request<void>('init', undefined, ENGINE_LOAD_TIMEOUT_MS)
        .catch(error => {
          this.readyPromise = null
          throw error
        })
    }
    return this.readyPromise
  }

  async analyze(code: string): Promise<PythonAnalysis | null> {
    await this.prepare()
    const result = await this.request<RunResult>('analyze', { code }, DEFAULT_EXECUTION_TIMEOUT_MS)
    return result.analysis
  }

  async run(payload: RunPayload, timeoutMs = DEFAULT_EXECUTION_TIMEOUT_MS): Promise<RunResult> {
    const startedAt = performance.now()
    try {
      await this.prepare()
      const result = await this.request<Omit<RunResult, 'timedOut' | 'durationMs'>>('run', payload, timeoutMs)
      return { ...result, timedOut: false, durationMs: Math.round(performance.now() - startedAt) }
    } catch (error) {
      const timedOut = error instanceof PythonTimeoutError
      return {
        output: '', testOutput: '', analysis: null,
        error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        testError: null, timedOut,
        durationMs: Math.round(performance.now() - startedAt),
      }
    }
  }

  terminate() {
    this.worker?.terminate()
    this.worker = null
    this.readyPromise = null
    this.rejectAll(new Error('Python runtime restarted.'))
  }

  private rejectAll(error: Error) {
    for (const pending of this.pending.values()) {
      window.clearTimeout(pending.timer)
      pending.reject(error)
    }
    this.pending.clear()
  }
}

export class PythonTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

const client = new PythonWorkerClient()

export function preparePythonEngine(): Promise<void> {
  return client.prepare()
}

export function restartPythonEngine() {
  client.terminate()
}

export async function analyzeCode(code: string): Promise<PythonAnalysis | null> {
  return client.analyze(code)
}

export async function runCode(
  code: string,
  inputs: string[] = [],
  inputMap?: Record<string, string>,
  options?: { timeoutMs?: number; setupCode?: string; afterCode?: string }
): Promise<RunResult> {
  return client.run({ code, inputs, inputMap, setupCode: options?.setupCode, afterCode: options?.afterCode }, options?.timeoutMs)
}

export function normalizeAssessmentText(value: string, options?: {
  caseSensitive?: boolean
  preserveAccents?: boolean
  compact?: boolean
}): string {
  let normalized = value
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim()

  if (!options?.preserveAccents) {
    normalized = normalized
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  if (options?.compact) {
    normalized = normalized.replace(/[^a-zA-Z0-9]+/g, '')
  }

  return options?.caseSensitive ? normalized : normalized.toLocaleLowerCase('pt-BR')
}

export function checkText(value: string, check: Check): boolean {
  const exact = check.textMode === 'exact'
  const compact = check.textMode === 'compact'
  const raw = value.replace(/\r/g, '').trim()
  const candidate = normalizeAssessmentText(raw, {
    caseSensitive: check.caseSensitive,
    preserveAccents: exact,
    compact,
  })
  const expected = Array.isArray(check.value) ? check.value.map(String) : [String(check.value ?? '')]
  const values = expected.map(item => normalizeAssessmentText(item, {
    caseSensitive: check.caseSensitive,
    preserveAccents: exact,
    compact,
  }))

  switch (check.type) {
    case 'contains': return candidate.includes(values[0])
    case 'contains_any': return values.some(item => candidate.includes(item))
    case 'equals_any': return values.some(item => candidate === item)
    case 'not_contains': return !candidate.includes(values[0])
    case 'equals': return candidate === values[0]
    case 'matches': return new RegExp(String(check.value), check.caseSensitive ? '' : 'i').test(raw)
    case 'line_count': return raw ? raw.split('\n').length === Number(check.value) : Number(check.value) === 0
    case 'numeric_equals': {
      const number = Number(raw.match(/-?\d+(?:\.\d+)?/)?.[0])
      return Number.isFinite(number) && Math.abs(number - Number(check.value)) <= (check.tolerance ?? 0.000001)
    }
    case 'no_error': return true
    default: return false
  }
}

export function meetsCodeRequirement(analysis: PythonAnalysis | null, requirement: CodeRequirement): boolean {
  if (!analysis) return false
  const minimum = requirement.minCount ?? 1

  switch (requirement.kind) {
    case 'node': return (analysis.nodeCounts[requirement.value] ?? 0) >= minimum
    case 'call': return analysis.calls.some(call => call === requirement.value || call.endsWith(`.${requirement.value}`))
    case 'function': return analysis.functionNames.includes(requirement.value)
    case 'import': return analysis.imports.some(name => name === requirement.value || name.startsWith(`${requirement.value}.`))
    case 'assignment': return analysis.assignedNames.includes(requirement.value)
    case 'main_guard': return analysis.hasMainGuard
    default: return false
  }
}


export interface HardcodedAnswerFinding {
  kind: 'literal_print' | 'constant_function'
  expected: string
  requiredName: string
}

function expectedValuesForAntiFraud(testCase: TestCase): string[] {
  return testCase.checks
    .filter(check => ['equals', 'equals_any', 'contains', 'contains_any', 'numeric_equals'].includes(check.type))
    .flatMap(check => Array.isArray(check.value) ? check.value.map(String) : check.value === undefined ? [] : [String(check.value)])
    .map(value => value.trim())
    .filter(Boolean)
}

function assessmentValueMatches(actual: string, expected: string): boolean {
  const actualNumber = Number(actual)
  const expectedNumber = Number(expected)
  if (Number.isFinite(actualNumber) && Number.isFinite(expectedNumber)) {
    return Math.abs(actualNumber - expectedNumber) <= 0.000001
  }
  return normalizeAssessmentText(actual) === normalizeAssessmentText(expected)
}

/**
 * Detects two common answer-copying patterns without rejecting legitimate
 * solutions that merely contain the same words as the expected output.
 */
export function detectHardcodedAnswer(
  analysis: PythonAnalysis | null,
  testCase: TestCase,
): HardcodedAnswerFinding | null {
  if (!analysis) return null
  const expectedValues = expectedValuesForAntiFraud(testCase)
  if (!expectedValues.length) return null

  const requiredCalls = (testCase.codeRequirements || []).filter(requirement => requirement.kind === 'call')
  for (const requirement of requiredCalls) {
    const wasCalled = analysis.calls.some(call => call === requirement.value || call.endsWith(`.${requirement.value}`))
    if (wasCalled) continue
    const literal = analysis.literalPrintValues.find(value => expectedValues.some(expected => assessmentValueMatches(value, expected)))
    if (literal) return { kind: 'literal_print', expected: literal, requiredName: requirement.value }
  }

  const requiredFunctions = (testCase.codeRequirements || []).filter(requirement => requirement.kind === 'function')
  for (const requirement of requiredFunctions) {
    const detail = analysis.functionDetails.find(item => item.name === requirement.value)
    if (!detail || detail.arguments.length === 0) continue
    const usesAnArgument = detail.arguments.some(argument => detail.loadedNames.includes(argument))
    if (usesAnArgument) continue
    const literal = detail.returnLiterals.find(value => expectedValues.some(expected => assessmentValueMatches(value, expected)))
    if (literal) return { kind: 'constant_function', expected: literal, requiredName: requirement.value }
  }

  return null
}

export interface TestFeedbackText {
  summary: string
  whatWorked: string[]
  issue: string
  why: string
  fix: string
  expected?: string
  actual?: string
  concept: string
}

export interface TestFeedback {
  en: TestFeedbackText
  pt: TestFeedbackText
}

export interface TestResult {
  id: string
  description: { en: string; pt: string }
  passed: boolean
  points: number
  maxPoints: number
  output: string
  error: string | null
  hidden: boolean
  timedOut: boolean
  feedback: TestFeedback
}

function expectedFromCheck(check: Check | null): string | undefined {
  if (!check || check.value === undefined) return undefined
  if (Array.isArray(check.value)) return check.value.map(String).join(' / ')
  return String(check.value)
}

function buildFeedback(args: {
  passed: boolean
  hidden: boolean
  run: RunResult
  failedCheck: Check | null
  failedRequirement: CodeRequirement | null
  hardcodedAnswer: HardcodedAnswerFinding | null
}): TestFeedback {
  const { passed, hidden, run, failedCheck, failedRequirement, hardcodedAnswer } = args
  const actual = (failedCheck?.target === 'test_output' ? run.testOutput : run.output).replace(/\r/g, '').trim()
  const expected = expectedFromCheck(failedCheck)

  if (passed) {
    return {
      en: {
        summary: 'This verification passed.',
        whatWorked: ['Your code ran without errors', 'The result matched the expected behavior'],
        issue: '', why: '', fix: '', concept: 'Correct behavior',
      },
      pt: {
        summary: 'Esta verificação passou.',
        whatWorked: ['Seu código executou sem erros', 'O resultado correspondeu ao comportamento esperado'],
        issue: '', why: '', fix: '', concept: 'Comportamento correto',
      },
    }
  }

  if (run.timedOut) {
    return {
      en: {
        summary: 'The program did not finish in time.',
        whatWorked: ['The evaluator was able to start your code'],
        issue: 'Execution exceeded the time limit.',
        why: 'This usually happens with an infinite loop or a loop whose stopping condition is never reached.',
        fix: 'Review every while/for loop and confirm that its condition eventually becomes false.',
        concept: 'Loop control',
      },
      pt: {
        summary: 'O programa não terminou dentro do tempo limite.',
        whatWorked: ['O avaliador conseguiu iniciar seu código'],
        issue: 'A execução ultrapassou o limite de tempo.',
        why: 'Isso normalmente acontece em um loop infinito ou quando a condição de parada nunca é alcançada.',
        fix: 'Revise cada while/for e confirme que a condição eventualmente se torna falsa.',
        concept: 'Controle de repetição',
      },
    }
  }

  if (run.error || run.testError) {
    const raw = run.error || run.testError || ''
    return {
      en: {
        summary: 'The program stopped with an error.',
        whatWorked: ['Your solution was submitted and evaluated'],
        issue: raw.split('\n')[0].slice(0, 180),
        why: 'Python could not complete the program, so the expected result was never produced.',
        fix: 'Run the code first, read the indicated line, and correct the syntax, name, type, or operation mentioned in the error.',
        actual: hidden ? undefined : raw.slice(0, 260),
        concept: 'Debugging',
      },
      pt: {
        summary: 'O programa foi interrompido por um erro.',
        whatWorked: ['Sua solução foi enviada e avaliada'],
        issue: raw.split('\n')[0].slice(0, 180),
        why: 'O Python não conseguiu concluir o programa, então o resultado esperado não foi produzido.',
        fix: 'Execute o código primeiro, leia a linha indicada e corrija a sintaxe, nome, tipo ou operação mencionada no erro.',
        actual: hidden ? undefined : raw.slice(0, 260),
        concept: 'Depuração',
      },
    }
  }

  if (hardcodedAnswer) {
    const target = hardcodedAnswer.kind === 'constant_function'
      ? `function ${hardcodedAnswer.requiredName}`
      : `call ${hardcodedAnswer.requiredName}`
    return {
      en: {
        summary: 'The evaluator detected a copied answer instead of a calculation.',
        whatWorked: ['Your code is valid Python and was executed'],
        issue: `The expected value “${hardcodedAnswer.expected}” appears as a fixed literal while the required ${target} is not using the provided data.`,
        why: 'A fixed answer can pass one example but fails as soon as the input changes.',
        fix: 'Use the function arguments or required call to calculate the result. Then test with a different value before submitting again.',
        expected: hidden ? undefined : hardcodedAnswer.expected,
        concept: 'Generalization and anti-hardcoding',
      },
      pt: {
        summary: 'O avaliador detectou uma resposta copiada em vez de um cálculo.',
        whatWorked: ['Seu código é Python válido e foi executado'],
        issue: `O valor esperado “${hardcodedAnswer.expected}” aparece como literal fixo enquanto ${target} não usa os dados fornecidos.`,
        why: 'Uma resposta fixa pode passar em um exemplo, mas falha assim que a entrada muda.',
        fix: 'Use os argumentos da função ou a chamada obrigatória para calcular o resultado. Depois teste com outro valor antes de enviar novamente.',
        expected: hidden ? undefined : hardcodedAnswer.expected,
        concept: 'Generalização e antifraude',
      },
    }
  }

  if (failedRequirement) {
    const label = `${failedRequirement.kind}: ${failedRequirement.value}`
    return {
      en: {
        summary: 'The output may look right, but a required Python structure is missing.',
        whatWorked: ['Your code ran without a runtime error'],
        issue: `Missing required structure: ${label}.`,
        why: 'The exercise evaluates both the final output and the way the solution is built.',
        fix: `Use the required ${failedRequirement.kind} “${failedRequirement.value}” in the solution, then submit again.`,
        concept: 'Program structure',
      },
      pt: {
        summary: 'A saída pode parecer correta, mas falta uma estrutura obrigatória do Python.',
        whatWorked: ['Seu código executou sem erro de execução'],
        issue: `Estrutura obrigatória ausente: ${label}.`,
        why: 'O exercício avalia tanto o resultado final quanto a forma como a solução foi construída.',
        fix: `Use ${failedRequirement.kind} “${failedRequirement.value}” na solução e envie novamente.`,
        concept: 'Estrutura do programa',
      },
    }
  }

  if (hidden) {
    return {
      en: {
        summary: 'Your solution passed visible examples, but failed with another valid value.',
        whatWorked: ['The code ran without errors', 'Part of the requested behavior is correct'],
        issue: 'The logic is not general enough for different inputs.',
        why: 'A fixed number, fixed text, or assumption from the example may have been placed directly in the code.',
        fix: 'Replace fixed answers with variables and calculations. Ask: “Would this still work if the input changed?”',
        concept: 'Generalization',
      },
      pt: {
        summary: 'Sua solução passou nos exemplos visíveis, mas falhou com outro valor válido.',
        whatWorked: ['O código executou sem erros', 'Parte do comportamento solicitado está correta'],
        issue: 'A lógica ainda não funciona de forma geral para entradas diferentes.',
        why: 'Um número, texto ou suposição do exemplo pode ter sido colocado diretamente no código.',
        fix: 'Substitua respostas fixas por variáveis e cálculos. Pergunte: “Isso continuaria funcionando se a entrada mudasse?”',
        concept: 'Generalização',
      },
    }
  }

  const actualText = actual || '(no output)'
  const expectedText = expected
  const type = failedCheck?.type
  const details: Record<string, { en: [string, string, string]; pt: [string, string, string] }> = {
    equals_any: {
      en: ['The final output differs from every accepted exact form.', 'The result is close, but it does not match any complete accepted answer.', 'Compare the complete output, including line order and required values, then run again.'],
      pt: ['A saída final difere de todas as formas exatas aceitas.', 'O resultado está próximo, mas não corresponde a nenhuma resposta completa aceita.', 'Compare a saída completa, incluindo a ordem das linhas e os valores obrigatórios, e execute novamente.'],
    },
    contains: {
      en: ['The expected information was not found in the output.', 'The program printed something, but omitted a required value or text.', 'Print the calculated variable/result instead of unrelated or fixed content.'],
      pt: ['A informação esperada não apareceu na saída.', 'O programa imprimiu algo, mas deixou de mostrar um valor ou texto obrigatório.', 'Imprima a variável ou resultado calculado, em vez de conteúdo não relacionado ou fixo.'],
    },
    equals: {
      en: ['The final output is different from the expected output.', 'The calculation, formatting, or selected variable produced another result.', 'Compare each operation and print exactly the requested result.'],
      pt: ['A saída final é diferente da saída esperada.', 'O cálculo, a formatação ou a variável escolhida produziu outro resultado.', 'Compare cada operação e imprima exatamente o resultado solicitado.'],
    },
    numeric_equals: {
      en: ['The numeric result is incorrect.', 'At least one value or mathematical operation produced the wrong total.', 'Recalculate step by step and check parentheses and operator order.'],
      pt: ['O resultado numérico está incorreto.', 'Pelo menos um valor ou operação matemática produziu o total errado.', 'Refaça o cálculo passo a passo e confira parênteses e a ordem dos operadores.'],
    },
    line_count: {
      en: ['The number of output lines is different from requested.', 'The program printed too many or too few lines.', 'Review each print() and keep only the lines required by the scenario.'],
      pt: ['A quantidade de linhas da saída está diferente do solicitado.', 'O programa imprimiu linhas demais ou de menos.', 'Revise cada print() e mantenha somente as linhas exigidas pelo cenário.'],
    },
    not_contains: {
      en: ['The output contains information that should not be there.', 'An extra print or fixed value added unwanted content.', 'Remove the extra output and keep only what the requirement asks for.'],
      pt: ['A saída contém uma informação que não deveria aparecer.', 'Um print extra ou valor fixo adicionou conteúdo indevido.', 'Remova a saída extra e mantenha apenas o que o requisito solicita.'],
    },
    matches: {
      en: ['The output format does not match the required pattern.', 'The values may be present, but spacing, punctuation, or order is different.', 'Follow the requested format exactly and check punctuation and line order.'],
      pt: ['O formato da saída não corresponde ao padrão solicitado.', 'Os valores podem estar presentes, mas o espaço, pontuação ou ordem está diferente.', 'Siga exatamente o formato pedido e confira pontuação e ordem das linhas.'],
    },
  }
  const fallback = {
    en: ['The produced result did not satisfy this verification.', 'One part of the requested behavior is still missing or different.', 'Review the requirement, test smaller parts, and submit again.'] as [string, string, string],
    pt: ['O resultado produzido não atendeu a esta verificação.', 'Uma parte do comportamento solicitado ainda está ausente ou diferente.', 'Revise o requisito, teste partes menores e envie novamente.'] as [string, string, string],
  }
  const d = (type && details[type]) || fallback
  return {
    en: {
      summary: 'This verification found a specific difference.',
      whatWorked: ['Your code ran without a runtime error'],
      issue: d.en[0], why: d.en[1], fix: d.en[2],
      expected: expectedText, actual: actualText, concept: 'Output and logic',
    },
    pt: {
      summary: 'Esta verificação encontrou uma diferença específica.',
      whatWorked: ['Seu código executou sem erro de execução'],
      issue: d.pt[0], why: d.pt[1], fix: d.pt[2],
      expected: expectedText, actual: actualText, concept: 'Saída e lógica',
    },
  }
}

export async function runExam(
  code: string,
  testCases: TestCase[]
): Promise<{ results: TestResult[]; score: number; analysis: PythonAnalysis | null }> {
  const results: TestResult[] = []
  let sharedAnalysis: PythonAnalysis | null = null

  for (const [testIndex, testCase] of testCases.entries()) {
    const run = await runCode(code, testCase.inputs, testCase.inputMap, {
      timeoutMs: testCase.timeoutMs,
      setupCode: testCase.setupCode,
      afterCode: testCase.afterCode,
    })
    sharedAnalysis ||= run.analysis

    let passed = !run.error && !run.testError
    let failedRequirement: CodeRequirement | null = null
    let failedCheck: Check | null = null
    const hardcodedAnswer = passed ? detectHardcodedAnswer(run.analysis, testCase) : null
    if (hardcodedAnswer) passed = false

    if (passed && testCase.codeRequirements) {
      failedRequirement = testCase.codeRequirements.find(requirement => !meetsCodeRequirement(run.analysis, requirement)) || null
      passed = !failedRequirement
    }

    if (passed) {
      for (const check of testCase.checks) {
        if (check.type === 'no_error') continue
        const target = check.target === 'test_output' ? run.testOutput : run.output
        if (!checkText(target, check)) {
          failedCheck = check
          passed = false
          break
        }
      }
    }

    const isHidden = testCase.hidden ?? testIndex > 0
    const feedback = buildFeedback({ passed, hidden: isHidden, run, failedCheck, failedRequirement, hardcodedAnswer })

    results.push({
      id: testCase.id,
      description: testCase.description,
      passed,
      points: passed ? testCase.points : 0,
      maxPoints: testCase.points,
      output: isHidden ? '' : run.output,
      error: run.error || run.testError,
      hidden: isHidden,
      timedOut: run.timedOut,
      feedback,
    })
  }

  const totalPoints = testCases.reduce((sum, testCase) => sum + testCase.points, 0)
  const earnedPoints = results.reduce((sum, result) => sum + result.points, 0)
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  return { results, score, analysis: sharedAnalysis }
}
