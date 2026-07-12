import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './utils'

type CardVariant = 'default' | 'raised' | 'interactive' | 'subtle' | 'success' | 'warning' | 'danger' | 'info'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
}

export function Card({ variant = 'default', padding = 'md', className, ...props }: CardProps) {
  return <div className={cn('hp-ui-card', `hp-ui-card--${variant}`, `hp-ui-card--pad-${padding}`, className)} {...props} />
}

export function CardHeader({ title, description, action, className }: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('hp-ui-card__header', className)}>
      <div className="min-w-0 flex-1">
        <div className="hp-ui-card__title">{title}</div>
        {description && <div className="hp-ui-card__description">{description}</div>}
      </div>
      {action && <div className="hp-ui-card__action">{action}</div>}
    </div>
  )
}
