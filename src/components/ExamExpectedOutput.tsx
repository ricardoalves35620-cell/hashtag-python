import type { Exam, Lang } from '../data/types'
import { getVisibleExamContracts } from '../lib/examContract'
import { describeRequirement } from '../lib/requirementLanguage'

export default function ExamExpectedOutput({ exam, lang, compact = false }: { exam: Exam; lang: Lang; compact?: boolean }) {
  const contracts = getVisibleExamContracts(exam, lang)
  const copy = lang === 'pt' ? {
    title: 'Saída esperada', input: 'Entradas usadas na correção', noInput: 'Nenhuma entrada necessária',
    exact: 'Forma canônica mostrada ao aluno. Pequenas variações só são aceitas quando o contrato do exame permitir.',
    flexible: 'O validador procura estes valores ou comportamentos e aceita variações de apresentação que não alterem o significado.',
    alsoChecks: 'O corretor também verifica como você resolveu',
  } : {
    title: 'Expected output', input: 'Inputs used for grading', noInput: 'No input required',
    exact: 'Canonical form shown to the learner. Small variations are accepted only when the exam contract allows them.',
    flexible: 'The grader checks these values or behaviors and accepts presentation differences that do not change their meaning.',
    alsoChecks: 'The grader also checks how you solved it',
  }

  return (
    <section data-testid="exam-expected-output" style={{ background: 'var(--c-success-bg)', border: '1px solid var(--c-success-border)', borderRadius: 12, padding: compact ? 12 : 16, marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--c-success-text)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 800, marginBottom: 10 }}>✓ {copy.title}</div>
      {(() => {
        // Structural requirements, shown before submitting. Otherwise a learner can
        // produce the exact expected output and still fail with no way to have known.
        const requirements = [
          ...((exam as any).codeRequirements || []),
          ...(((exam as any).testCases || []).flatMap((testCase: any) => testCase.codeRequirements || [])),
        ]
        const seen = new Set<string>()
        const unique = requirements.filter((requirement: any) => {
          const id = `${requirement.kind}:${requirement.value}`
          if (seen.has(id)) return false
          seen.add(id)
          return true
        })
        if (unique.length === 0) return null
        return (
          <div style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>{copy.alsoChecks}</div>
            <ul style={{ fontSize: 13, color: 'var(--c-text2)', lineHeight: 1.7, margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {unique.map((requirement: any, index: number) => (
                <li key={`${requirement.kind}-${requirement.value}-${index}`}>• {describeRequirement(requirement.kind, String(requirement.value)).what[lang]}</li>
              ))}
            </ul>
          </div>
        )
      })()}

      <div style={{ display: 'grid', gap: 10 }}>
        {contracts.map((contract, index) => (
          <article key={contract.id} style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 10, padding: 12 }}>
            {contracts.length > 1 && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text)', marginBottom: 8 }}>{index + 1}. {contract.description}</div>}
            <div style={{ fontSize: 10, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>{copy.input}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-text2)', lineHeight: 1.65, marginBottom: 10 }}>
              {contract.inputs.length === 0 && contract.inputMap.length === 0
                ? <span>{copy.noInput}</span>
                : <>
                    {contract.inputs.map((value, inputIndex) => <div key={`input-${inputIndex}`}>{inputIndex + 1}. {value}</div>)}
                    {contract.inputMap.map(item => <div key={item.label}>{item.label}: {item.value}</div>)}
                  </>}
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: 'var(--font-mono)', fontSize: compact ? 12 : 13, lineHeight: 1.7, color: 'var(--c-success-text)' }}>{contract.expected}</pre>
            <p style={{ margin: '9px 0 0', fontSize: 11, lineHeight: 1.5, color: 'var(--c-muted)' }}>{contract.kind === 'exact' ? copy.exact : copy.flexible}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
