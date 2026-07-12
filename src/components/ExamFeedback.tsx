import type { ReactNode } from 'react'
import type { Lang } from '../data/types'
import type { TestResult } from '../lib/pyodide'

function FeedbackSection({ label, children, tone = 'neutral' }: {
  label: string
  children: ReactNode
  tone?: 'neutral' | 'success' | 'danger' | 'info'
}) {
  const palette = {
    neutral: ['var(--c-card2)', 'var(--c-border)', 'var(--c-text2)'],
    success: ['var(--c-success-bg)', 'var(--c-success-border)', 'var(--c-success-text)'],
    danger: ['var(--c-danger-bg)', 'var(--c-danger-border)', 'var(--c-danger-text)'],
    info: ['var(--color-info-bg)', 'var(--color-info-border)', 'var(--color-info-text)'],
  }[tone]

  return (
    <div style={{ background: palette[0], border: `1px solid ${palette[1]}`, borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: palette[2], marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 12, lineHeight: 1.6, color: palette[2], whiteSpace: 'pre-wrap' }}>{children}</div>
    </div>
  )
}

export default function ExamFeedback({ result, lang }: { result: TestResult; lang: Lang }) {
  const feedback = result.feedback[lang]
  const copy = lang === 'pt' ? {
    correct: 'O que você acertou',
    wrong: 'O que precisa corrigir',
    why: 'Por que aconteceu',
    how: 'Como corrigir',
    expected: 'Esperado',
    actual: 'Seu resultado',
    concept: 'Conceito avaliado',
    earned: 'pontos conquistados',
  } : {
    correct: 'What you got right',
    wrong: 'What needs correction',
    why: 'Why it happened',
    how: 'How to fix it',
    expected: 'Expected',
    actual: 'Your result',
    concept: 'Skill checked',
    earned: 'points earned',
  }

  return (
    <article className={result.passed ? 'hp-success-card' : 'hp-danger-card'} style={{ borderRadius: 14, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span aria-hidden style={{ fontSize: 18, lineHeight: 1.2 }}>{result.passed ? '✓' : '!'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, color: 'inherit', fontWeight: 750 }}>
                {result.hidden ? (lang === 'pt' ? 'Verificação automática' : 'Automatic verification') : result.description[lang]}
              </div>
              <div style={{ fontSize: 12, color: 'inherit', opacity: .9, lineHeight: 1.5, marginTop: 3 }}>{feedback.summary}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'inherit', whiteSpace: 'nowrap' }}>
              {result.points}/{result.maxPoints}pt
            </span>
          </div>

          {!result.passed && (
            <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              {feedback.whatWorked.length > 0 && (
                <FeedbackSection label={copy.correct} tone="success">
                  {feedback.whatWorked.map(item => <div key={item}>✓ {item}</div>)}
                </FeedbackSection>
              )}
              <FeedbackSection label={copy.wrong} tone="danger">{feedback.issue}</FeedbackSection>
              <FeedbackSection label={copy.why} tone="info">{feedback.why}</FeedbackSection>
              <FeedbackSection label={copy.how} tone="neutral">{feedback.fix}</FeedbackSection>

              {(feedback.expected !== undefined || feedback.actual !== undefined) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
                  {feedback.expected !== undefined && (
                    <FeedbackSection label={copy.expected} tone="success">
                      <code style={{ fontFamily: 'var(--font-mono)', overflowWrap: 'anywhere' }}>{feedback.expected}</code>
                    </FeedbackSection>
                  )}
                  {feedback.actual !== undefined && (
                    <FeedbackSection label={copy.actual} tone="danger">
                      <code style={{ fontFamily: 'var(--font-mono)', overflowWrap: 'anywhere' }}>{feedback.actual}</code>
                    </FeedbackSection>
                  )}
                </div>
              )}

              <div style={{ fontSize: 11, fontWeight: 700, color: 'inherit', opacity: .9 }}>
                {copy.concept}: {feedback.concept}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
