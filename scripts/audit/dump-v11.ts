import { ALL_PHASES } from '../../src/data/phases'

/**
 * Exports the factory-built exercises so verify-expectations.py can run a reference
 * solution against each afterCode. Kept separate from the checker because the data
 * lives in TypeScript and the execution has to happen in Python.
 */
const out = ALL_PHASES
  .filter(phase => phase.id >= 9 && phase.id <= 20)
  .sort((a, b) => a.id - b.id)
  .flatMap(phase => phase.exercises.map(ex => ({
    phase: phase.id,
    id: ex.id,
    desc: ex.description.en,
    starter: typeof ex.starterCode === 'string' ? ex.starterCode : (ex.starterCode as { en?: string })?.en,
    sample: ex.sampleOutput?.en,
    tests: (ex.grading?.tests || []).map(test => ({
      hidden: !!test.hidden,
      afterCode: (test as { afterCode?: string }).afterCode,
      expected: (test.checks || [])
        .flatMap(check => Array.isArray((check as { value?: unknown }).value)
          ? (check as { value: unknown[] }).value
          : [(check as { value?: unknown }).value])
        .filter(Boolean),
    })),
  })))

console.log(JSON.stringify(out, null, 1))
