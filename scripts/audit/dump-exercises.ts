import { ALL_PHASES } from '../../src/data/phases'

/**
 * Exports every exercise in phases 0-20 with the facts the parity report needs:
 * what is graded, how it is graded, and how much the learner was told.
 */
const out = ALL_PHASES
  .filter(phase => phase.id <= 20)
  .sort((a, b) => a.id - b.id)
  .flatMap(phase => phase.exercises.map(ex => ({
    phase: phase.id,
    id: ex.id,
    difficulty: ex.difficulty ?? null,
    desc: ex.description.en,
    descPt: ex.description.pt,
    starter: typeof ex.starterCode === 'string' ? ex.starterCode : (ex.starterCode as { en?: string })?.en,
    sample: ex.sampleOutput?.en,
    hints: (ex.hints || []).map(h => h.en),
    behaviourCases: ex.behaviour ? ex.behaviour.cases.length : 0,
    behaviourReference: ex.behaviour
      ? (typeof ex.behaviour.reference === 'string' ? ex.behaviour.reference : ex.behaviour.reference.en)
      : null,
    codeRequirements: (ex.grading?.codeRequirements || []).map(r => ({ kind: r.kind, value: String(r.value) })),
    tests: (ex.grading?.tests || []).map(test => ({
      hidden: !!test.hidden,
      inputs: test.inputs || [],
      afterCode: (test as { afterCode?: string }).afterCode ?? null,
      checks: (test.checks || []).map(check => ({
        type: String(check.type),
        value: (check as { value?: unknown }).value ?? null,
      })),
    })),
  })))

console.log(JSON.stringify(out, null, 1))
