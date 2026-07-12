import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

const defaultIcons: Record<AlertVariant, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  danger: '×',
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  title?: ReactNode
  icon?: ReactNode
}

export function Alert({ variant = 'info', title, icon, children, className, ...props }: AlertProps) {
  return (
    <div role={variant === 'danger' ? 'alert' : 'status'} className={cn('hp-alert', `hp-alert--${variant}`, className)} {...props}>
      <span className="hp-alert__icon" aria-hidden="true">{icon ?? defaultIcons[variant]}</span>
      <div className="hp-alert__content">
        {title && <div className="hp-alert__title">{title}</div>}
        <div className="hp-alert__body">{children}</div>
      </div>
    </div>
  )
}
