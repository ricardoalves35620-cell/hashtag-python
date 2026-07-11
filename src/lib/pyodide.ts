import type { Check, CodeRequirement, TestCase } from '../data/types'

export interface PythonAnalysis {
  nodeCounts: Record<string, number>
  calls: string[]
  functionNames: string[]
  imports: string[]
  assignedNames: string[]
  literalPrintCalls: number
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

function normalize(value: string) {
  return value.replace(/\r/g, '').trim()
}

function checkText(value: string, check: Check): boolean {
  const raw = normalize(value)
  const candidate = check.caseSensitive ? raw : raw.toLowerCase()
  const expected = Array.isArray(check.value) ? check.value.map(String) : [String(check.value ?? '')]
  const values = check.caseSensitive ? expected : expected.map(item => item.toLowerCase())

  switch (check.type) {
    case 'contains': return candidate.includes(values[0])
    case 'contains_any': return values.some(item => candidate.includes(item))
    case 'not_contains': return !candidate.includes(values[0])
    case 'equals': return candidate === values[0].trim()
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

export interface TestResult {
  id: string
  description: { en: string; pt: string }
  passed: boolean
  points: number
  output: string
  error: string | null
  hidden: boolean
  timedOut: boolean
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
    if (passed && testCase.codeRequirements) {
      passed = testCase.codeRequirements.every(requirement => meetsCodeRequirement(run.analysis, requirement))
    }

    if (passed) {
      for (const check of testCase.checks) {
        if (check.type === 'no_error') continue
        const target = check.target === 'test_output' ? run.testOutput : run.output
        if (!checkText(target, check)) {
          passed = false
          break
        }
      }
    }

    const isHidden = testCase.hidden ?? testIndex > 0

    results.push({
      id: testCase.id,
      description: testCase.description,
      passed,
      points: passed ? testCase.points : 0,
      output: isHidden ? '' : run.output,
      error: run.error || run.testError,
      hidden: isHidden,
      timedOut: run.timedOut,
    })
  }

  const totalPoints = testCases.reduce((sum, testCase) => sum + testCase.points, 0)
  const earnedPoints = results.reduce((sum, result) => sum + result.points, 0)
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  return { results, score, analysis: sharedAnalysis }
}
