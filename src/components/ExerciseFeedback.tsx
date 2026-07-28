import type { ValidationItem } from '../lib/learningValidation'
import type { Lang } from '../data/types'
import { Alert, Badge, Card } from './ui'

export default function ExerciseFeedback({
  checks,
  lang,
  /**
   * True when the learner has already satisfied this exercise.
   *
   * The guided first exercise passes on "ran without an error" rather than on
   * matching the published sample, because it asks the learner to CHANGE a value
   * (see the cycleComplete comment in Exercises.tsx). The strict check list still
   * reports the unmet ones, which meant the very first coding screen a beginner
   * sees showed "✓ Validated", a 40% progress bar and "Why it failed" all at once.
   *
   * When the exercise is already satisfied, the remaining checks describe what the
   * FINAL solution will need — they are a preview, not a failure.
   */
  satisfied = false,
}: { checks: ValidationItem[]; lang: Lang; satisfied?: boolean }) {
  const passed = checks.filter(item => item.passed)
  const failed = checks.filter(item => !item.passed)
  if (!checks.length) return null

  return (
    <div className="mt-3 space-y-3" aria-live="polite">
      {passed.length > 0 && (
        <Card variant="success" padding="md">
          <div className="mb-2 flex items-center justify-between gap-2">
            <strong>{lang === 'en' ? 'What you got right' : 'O que você acertou'}</strong>
            <Badge variant="success">{passed.length}/{checks.length}</Badge>
          </div>
          <ul className="space-y-2 text-sm">
            {passed.map(check => <li key={check.id} className="flex gap-2"><span aria-hidden="true">✓</span><span>{check.label}</span></li>)}
          </ul>
        </Card>
      )}

      {failed.length > 0 && satisfied && (
        <Card variant="subtle" padding="md" data-testid="exercise-feedback-preview">
          <div className="mb-2 flex items-center justify-between gap-2">
            <strong>{lang === 'en' ? 'What the full solution still needs' : 'O que a solução completa ainda pede'}</strong>
            <Badge variant="neutral">{lang === 'en' ? 'Not required yet' : 'Ainda não exigido'}</Badge>
          </div>
          <p className="mb-2 text-sm text-secondary">
            {lang === 'en'
              ? 'You have finished this step. These are the goals for the final version, not mistakes.'
              : 'Você concluiu esta etapa. Estas são as metas da versão final, não erros.'}
          </p>
          <ul className="space-y-2 text-sm">
            {failed.map(check => <li key={check.id} className="flex gap-2"><span aria-hidden="true">○</span><span>{check.label}</span></li>)}
          </ul>
        </Card>
      )}

      {!satisfied && failed.map(check => (
        <Card key={check.id} variant="danger" padding="md">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold">{check.hidden ? '🔒 ' : ''}{check.label}</div>
              {check.concept && <div className="mt-1"><Badge variant="danger">{check.concept}</Badge></div>}
            </div>
            <Badge variant="danger">{lang === 'en' ? 'Needs attention' : 'Precisa corrigir'}</Badge>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Alert variant="danger" title={lang === 'en' ? 'Why it failed' : 'Por que falhou'}>
              {check.why || check.detail || (lang === 'en' ? 'The expected behavior was not detected.' : 'O comportamento esperado não foi identificado.')}
            </Alert>
            <Alert variant="info" title={lang === 'en' ? 'How to correct it' : 'Como corrigir'}>
              {check.fix || (lang === 'en' ? 'Review the requirement, change one part at a time and run again.' : 'Revise o requisito, altere uma parte por vez e execute novamente.')}
            </Alert>
          </div>
          {check.detail && check.why && <div className="mt-3 text-sm text-secondary">{check.detail}</div>}
        </Card>
      ))}
    </div>
  )
}
