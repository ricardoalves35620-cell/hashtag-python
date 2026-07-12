import type { HTMLAttributes } from 'react'
import { cn } from './utils'

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  mono?: boolean
}

export function Badge({ variant = 'neutral', mono = false, className, ...props }: BadgeProps) {
  return <span className={cn('hp-badge', `hp-badge--${variant}`, mono && 'hp-badge--mono', className)} {...props} />
}
