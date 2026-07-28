import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const exercises = read('./pages/Exercises.tsx')
const feedback = read('./components/ExerciseFeedback.tsx')

/**
 * Found by driving the app in a real browser with a real Pyodide runtime, not by
 * reading code. These guard learner-facing behaviour that looked correct in the
 * source but read as broken on screen.
 */
describe('the first coding screen does not contradict itself', () => {
  it('does not show a failure percentage for an exercise the learner has passed', () => {
    // Observed: "Validation progress 40%" sitting directly above "✓ Validated".
    // Exercise 1 passes on completing the predict/run/change cycle, not on matching
    // the sample, so the strict-check ratio is not a score here.
    expect(exercises).toContain('value={currentValidated ? checks.length : passedChecks}')
  })

  it('frames unmet checks as goals, not mistakes, once the step is done', () => {
    // Observed: "✓ Validated" and "Why it failed" rendered at the same time.
    expect(exercises).toContain('satisfied={currentValidated}')
    expect(feedback).toContain('satisfied = false')
    expect(feedback).toContain('!satisfied && failed.map')
    expect(feedback).toMatch(/What the full solution still needs/)
    expect(feedback).toMatch(/O que a solução completa ainda pede/)
  })

  it('keeps the diagnostic failure detail for exercises that are genuinely wrong', () => {
    // The teaching value of "Why it failed" / "How to correct it" must survive.
    expect(feedback).toMatch(/Why it failed/)
    expect(feedback).toMatch(/How to correct it/)
  })
})

describe('the observation step reads the same on every phase', () => {
  it('has its own tone instead of inheriting pass/fail', () => {
    // Observed across ten phases: the identical correct action — run the starter and
    // watch — showed "✓ Validated" on phases 0/1/2/5/30/45/60 and "⚠ Keep improving"
    // on 9/13/21, purely because those starters print nothing until the learner
    // writes code. Same instruction, same compliance, opposite feedback.
    expect(exercises).toContain('messageTone')
    expect(exercises).toContain("setMessageTone('info')")
    expect(exercises).toMatch(/Observation complete/)
    expect(exercises).toMatch(/Observação concluída/)
  })

  it('still warns when the learner genuinely has not changed anything', () => {
    expect(exercises).toMatch(/t\.notChangedYet\)\s*\n?\s*setMessageTone\('warning'\)/)
  })

  it('resets the tone at the start of each run', () => {
    // A stale tone would carry a previous result's framing into the next one.
    const runStart = exercises.indexOf('const handleRun = async () => {')
    const reset = exercises.indexOf("setMessageTone('warning')", runStart)
    const firstAwait = exercises.indexOf('await preparePythonEngine()', runStart)
    expect(reset).toBeGreaterThan(runStart)
    expect(reset).toBeLessThan(firstAwait)
  })
})

describe('the first Python download is explained, not silent', () => {
  const progress = read('./components/PythonLoadingProgress.tsx')
  const pyodide = read('./lib/pyodide.ts')

  it('shows real byte progress rather than an indefinite spinner', () => {
    // ~12 MB on first use. loadPyodide() reports nothing, so the worker streams the
    // two large assets itself and posts byte counts.
    expect(progress).toContain('data-testid="python-loading-bytes"')
    expect(progress).toContain('megabytes')
    expect(pyodide).toContain('subscribePythonLoadProgress')
  })

  it('tells the learner it is one-time and then works offline', () => {
    expect(progress).toMatch(/only the first time/)
    expect(progress).toMatch(/works offline/)
    expect(progress).toMatch(/só na primeira vez/)
  })

  it('disappears once the runtime is ready', () => {
    expect(progress).toContain("progress.stage === 'idle' || progress.stage === 'ready'")
  })

  it('never spends a metered or 2G connection unasked', () => {
    expect(pyodide).toContain('canWarmPythonAutomatically')
    expect(pyodide).toContain('connection.saveData')
    expect(pyodide).toMatch(/slow-2g/)
    expect(exercises).toContain('canWarmPythonAutomatically()')
  })
})

describe('an unreachable Python runtime is never blamed on the learner', () => {
  it('shows a dedicated panel instead of writing into the console output', () => {
    expect(exercises).toContain('data-testid="python-unavailable"')
    expect(exercises).toContain('setRuntimeUnavailable(true)')
  })

  it('offers a retry, because the usual cause is a dropped connection', () => {
    expect(exercises).toContain('data-testid="python-unavailable-retry"')
  })

  it('records no attempt when nothing was actually assessed', () => {
    // A CDN outage must not enter the learner's skill model as a failed exercise.
    const runtimeGuard = exercises.indexOf('grade.runtimeUnavailable')
    const recordCall = exercises.indexOf('recordLearningAttempt({')
    expect(runtimeGuard).toBeGreaterThan(-1)
    expect(runtimeGuard, 'the runtime check must short-circuit before an attempt is recorded').toBeLessThan(recordCall)
  })

  it('is handled on every screen that runs Python', () => {
    for (const page of ['./pages/Exam.tsx', './pages/FastTrackDay.tsx', './pages/MiniProject.tsx']) {
      expect(read(page), `${page} must handle an unavailable runtime`).toContain('isPythonUnavailable')
    }
  })

  it('gives MiniProject the catch it never had', () => {
    // runBuild and runTests previously had only a finally, so a failure stopped the
    // spinner and produced nothing at all — a silently dead button.
    const miniProject = read('./pages/MiniProject.tsx')
    expect(miniProject.match(/catch \(error\)/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
  })
})
