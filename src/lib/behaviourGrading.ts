import type { BehaviourCase, BehaviourSpec, Lang } from '../data/types'
import { runCode, type PythonAnalysis, type RunResult } from './pyodide'

/**
 * Grades what the learner's program DOES, by comparing it to a reference implementation
 * over inputs the learner never sees.
 *
 * The problem this replaces: one authored `sampleOutput`, compared once, against one
 * input. That has three failure modes, and this app has shipped all three.
 *
 *   1. It rejects correct answers that differ only in presentation.
 *   2. It accepts wrong answers on any input the author did not think of. A learner
 *      whose running total came to 3435 instead of 3535 was told "Produces the
 *      required result ✓".
 *   3. The expected value is prose an author typed, and nothing verifies it. That is
 *      how `Running: {{file}}` and a stale `Queue size: 3` reached the screen.
 *
 * Deriving the expected value by RUNNING a reference removes the third failure mode
 * structurally: there is no authored expectation left to be wrong. Checking several
 * inputs, including boundaries, addresses the second. Comparing behaviour rather than
 * text addresses the first.
 *
 * Everything runs in the Pyodide worker that already exists — offline, deterministic,
 * no API key, and the learner's code never leaves the device.
 */

export type { BehaviourCase, BehaviourSpec }

export interface BehaviourCaseResult {
  case: BehaviourCase
  passed: boolean
  expected: string
  actual: string
  /** Set when the learner's program raised. */
  error: string | null
}

export interface BehaviourReport {
  passed: boolean
  results: BehaviourCaseResult[]
  analysis: PythonAnalysis | null
  /** True when the runtime never loaded, so nothing was actually assessed. */
  runtimeUnavailable: boolean
}

/**
 * Presentation differences that do not change meaning.
 *
 * Trailing spaces and blank lines are invisible on screen, so failing a learner for
 * them teaches nothing. Everything else — values, labels, order, capitalisation — is
 * left alone, because those are the things the exercise is about.
 */
export function normaliseOutput(text: string): string {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.length > 0)
    .join('\n')
    .trim()
}

/**
 * input() echoes its prompt into stdout, so both runs carry the same prompt text. That
 * is fine for comparison — but only because BOTH sides get the same inputs. Never
 * compare a run made with the learner's own inputs against the reference's.
 */
export function outputsMatch(expected: string, actual: string): boolean {
  return normaliseOutput(expected) === normaliseOutput(actual)
}

async function runOnce(code: string, inputs: string[], timeoutMs?: number): Promise<RunResult> {
  return runCode(code, inputs, undefined, { timeoutMs })
}

export async function gradeBehaviour(spec: BehaviourSpec, learnerCode: string): Promise<BehaviourReport> {
  const results: BehaviourCaseResult[] = []
  let analysis: PythonAnalysis | null = null

  for (const item of spec.cases) {
    const inputs = item.inputs ?? []
    const expectedRun = await runOnce(spec.reference, inputs, spec.timeoutMs)

    // A reference that cannot run is an authoring bug, not a learner mistake. Failing
    // the learner for it would be the worst possible outcome, so the case is skipped
    // and the exercise falls back to the checks it had before.
    if (expectedRun.runtimeUnavailable) {
      return { passed: false, results, analysis, runtimeUnavailable: true }
    }
    if (expectedRun.error) continue

    const actualRun = await runOnce(learnerCode, inputs, spec.timeoutMs)
    if (actualRun.runtimeUnavailable) {
      return { passed: false, results, analysis, runtimeUnavailable: true }
    }
    analysis ||= actualRun.analysis

    results.push({
      case: item,
      passed: !actualRun.error && outputsMatch(expectedRun.output, actualRun.output),
      expected: expectedRun.output,
      actual: actualRun.output,
      error: actualRun.error,
    })
  }

  return {
    passed: results.length > 0 && results.every(r => r.passed),
    results,
    analysis,
    runtimeUnavailable: false,
  }
}

/**
 * What the learner is told. A hidden case names the concept, never the input — telling
 * them the value would turn every hidden case into a visible one.
 */
export function describeFailure(result: BehaviourCaseResult, lang: Lang): string {
  if (result.error) {
    return lang === 'pt'
      ? `Seu programa parou com ${result.error}`
      : `Your program stopped with ${result.error}`
  }
  if (result.case.visible) {
    return lang === 'pt'
      ? `No caso "${result.case.label.pt}", esperávamos:\n${normaliseOutput(result.expected)}\n\nVocê produziu:\n${normaliseOutput(result.actual)}`
      : `For "${result.case.label.en}", we expected:\n${normaliseOutput(result.expected)}\n\nYou produced:\n${normaliseOutput(result.actual)}`
  }
  return lang === 'pt'
    ? `Um caso que você não viu ainda não passa: ${result.case.label.pt}. Teste esse cenário você mesmo.`
    : `A case you have not seen does not pass yet: ${result.case.label.en}. Try that scenario yourself.`
}
