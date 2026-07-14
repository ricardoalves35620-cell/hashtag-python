import type { Exercise, Lang } from '../data/types'
import { getVisibleExerciseContracts } from '../lib/exerciseContract'

export default function ExerciseExpectedOutput({ exercise, lang }: { exercise: Exercise; lang: Lang }) {
  const contracts = getVisibleExerciseContracts(exercise, lang)
  const copy = lang === 'pt' ? {
    title: 'Contrato visível do exercício',
    inputs: 'Valores usados como entrada',
    noInputs: 'Nenhuma entrada é necessária neste exercício.',
    output: 'Saída esperada',
    exact: 'Esta é a forma canônica esperada. O corretor pode aceitar variações de apresentação que não mudem o significado.',
    flexible: 'O corretor verifica estes valores ou comportamentos e aceita diferenças de apresentação que não mudem o resultado.',
  } : {
    title: 'Visible exercise contract',
    inputs: 'Values used as input',
    noInputs: 'No input is required for this exercise.',
    output: 'Expected output',
    exact: 'This is the canonical expected form. The grader may accept presentation differences that do not change the meaning.',
    flexible: 'The grader checks these values or behaviors and accepts presentation differences that do not change the result.',
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
      <div className="space-y-3">
        {contracts.map((contract, index) => (
          <article key={contract.id} className="rounded-lg border border-line bg-surface p-3">
            {contracts.length > 1 && <div className="mb-2 text-sm font-semibold text-ink">{index + 1}. {contract.description}</div>}
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{copy.inputs}</div>
            <div className="mb-3 font-mono text-sm leading-6 text-ink-secondary">
              {contract.inputs.length > 0
                ? contract.inputs.map((value, inputIndex) => <div key={`${contract.id}-input-${inputIndex}`}>{inputIndex + 1}. {value}</div>)
                : <span>{copy.noInputs}</span>}
            </div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{copy.output}</div>
            <pre className="m-0 whitespace-pre-wrap break-words font-mono text-sm leading-6" style={{ color: 'var(--c-success-text)' }}>
              {contract.expected}
            </pre>
            <p className="mb-0 mt-2 text-xs leading-5 text-muted">{contract.kind === 'exact' ? copy.exact : copy.flexible}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
