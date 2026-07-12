import type { ReactNode } from 'react'

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="hp-empty-state">
      {icon && <div className="hp-empty-state__icon" aria-hidden="true">{icon}</div>}
      <div className="hp-empty-state__title">{title}</div>
      {description && <div className="hp-empty-state__description">{description}</div>}
      {action && <div className="hp-empty-state__action">{action}</div>}
    </div>
  )
}
