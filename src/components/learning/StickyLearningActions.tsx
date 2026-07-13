import type { ReactNode } from 'react'

interface StickyLearningActionsProps {
  previous?: ReactNode
  next: ReactNode
  status?: ReactNode
}

export default function StickyLearningActions({ previous, next, status }: StickyLearningActionsProps) {
  return (
    <div className="sticky-learning-actions" data-testid="sticky-learning-actions">
      {status && <div className="sticky-learning-actions__status">{status}</div>}
      <div className="sticky-learning-actions__buttons">
        {previous || <span />}
        {next}
      </div>
    </div>
  )
}
