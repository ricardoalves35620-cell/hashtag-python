import type { Exercise, Lang } from '../data/types'
import { getVisibleExerciseContracts } from '../lib/exerciseContract'
import { describeRequirement } from '../lib/requirementLanguage'
import { personalize } from '../lib/learnerProfile'

export default function ExerciseExpectedOutput({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const contracts = getVisibleExerciseContracts(exercise, lang)
  const copy = lang === 'pt' ? {
    title: 'O que o seu programa deve mostrar',
    inputs: 'Valores usados como entrada',
    noInputs: 'Nenhuma entrada é necessária neste exercício.',
    output: 'Saída esperada',
    // Used when the exercise has no authored sample, so what follows is a
    // description of what counts as done — not text to reproduce.
    behaviorTitle: 'O que conta como concluído',
    exact: 'É exatamente isto que esperamos ver na tela. Pequenas diferenças de apresentação que não mudem o significado também são aceitas.',
    flexible: 'O corretor procura estes valores ou comportamentos e aceita diferenças na forma de apresentá-los.',
    alsoChecks: 'O corretor também verifica como você resolveu',
  } : {
    title: 'What your program should show',
    inputs: 'Values used as input',
    noInputs: 'No input is required for this exercise.',
    output: 'Expected output',
    behaviorTitle: 'What counts as done',
    exact: 'This is exactly what we expect to see on screen. Small differences in presentation that do not change the meaning are accepted too.',
    flexible: 'The grader looks for these values or behaviours, and accepts differences in how you present them.',
    alsoChecks: 'The grader also checks how you solved it',
  }

  return (
    <section
      data-testid="exercise-expected-output"
      className="mt-3 rounded-xl border p-3 sm:p-4"
      style={{ background: 'var(--c-success-bg)', borderColor: 'var(--c-success-border)' }}
    >
      <div className="mb-3 text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--c-success-text)' }}>
        ✓ {copy.title}
      </div>
      {/* Structural requirements shown BEFORE submitting. Without this a learner can
          produce the exact expected output and still fail, with no way to have known. */}
      {(exercise.grading?.codeRequirements || []).length > 0 && (
        <div className="mb-3 rounded-lg border border-line bg-surface p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{copy.alsoChecks}</div>
          <ul className="text-sm leading-6 text-ink-secondary">
            {(exercise.grading?.codeRequirements || []).map((requirement, index) => (
              <li key={`${requirement.kind}-${requirement.value}-${index}`}>
                • {describeRequirement(requirement.kind, String(requirement.value)).what[lang]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        {contracts.map((contract, index) => (
          <article key={contract.id} className="rounded-lg border border-line bg-surface p-3">
            {contracts.length > 1 && <div className="mb-2 text-sm font-semibold text-ink">{index + 1}. {personalize(contract.description)}</div>}
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{copy.inputs}</div>
            <div className="mb-3 font-mono text-sm leading-6 text-ink-secondary">
              {contract.inputs.length > 0
                ? contract.inputs.map((value, inputIndex) => <div key={`${contract.id}-input-${inputIndex}`}>{inputIndex + 1}. {personalize(value)}</div>)
                : <span>{copy.noInputs}</span>}
            </div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
              {contract.kind === 'behavior' ? copy.behaviorTitle : copy.output}
            </div>
            {/* Authored content stores {{file}} / {{folder}} / {{name}} so the
                curriculum audits keep seeing canonical text. Every other surface
                substitutes them at render time — this panel did not, so the very
                first exercise in the app told a beginner to expect the literal
                output "Running: {{file}}".

                The second case is an exercise with no authored sample. What lands
                here is then a sentence, not output — and rendering a sentence in
                terminal green under the heading "Expected output" invites a
                beginner to try to reproduce it literally. Prose is shown as prose. */}
            {contract.kind === 'behavior' ? (
              <p className="m-0 text-sm leading-6 text-ink-secondary">{personalize(contract.expected)}</p>
            ) : (
              <pre className="m-0 whitespace-pre-wrap break-words font-mono text-sm leading-6" style={{ color: 'var(--c-success-text)' }}>
                {personalize(contract.expected)}
              </pre>
            )}
            {contract.kind !== 'behavior' && (
              <p className="mb-0 mt-2 text-xs leading-5 text-muted">{contract.kind === 'exact' ? copy.exact : copy.flexible}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
