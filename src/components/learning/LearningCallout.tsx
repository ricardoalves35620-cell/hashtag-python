import type { ReactNode } from 'react'

type LearningCalloutVariant = 'idea' | 'observe' | 'warning' | 'professional' | 'remember'

const META: Record<LearningCalloutVariant, { icon: string; className: string }> = {
  idea: { icon: '💡', className: 'is-idea' },
  observe: { icon: '👀', className: 'is-observe' },
  warning: { icon: '⚠️', className: 'is-warning' },
  professional: { icon: '🧭', className: 'is-professional' },
  remember: { icon: '📌', className: 'is-remember' },
}

interface LearningCalloutProps {
  variant: LearningCalloutVariant
  title: string
  children: ReactNode
}

export default function LearningCallout({ variant, title, children }: LearningCalloutProps) {
  const meta = META[variant]
  return (
    <aside className={`learning-callout ${meta.className}`}>
      <div className="learning-callout__icon" aria-hidden="true">{meta.icon}</div>
      <div>
        <div className="learning-callout__title">{title}</div>
        <div className="learning-callout__content">{children}</div>
      </div>
    </aside>
  )
}
