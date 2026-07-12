import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'hp-button',
        `hp-button--${variant}`,
        `hp-button--${size}`,
        fullWidth && 'hp-button--full',
        className,
      )}
      {...props}
    >
      {loading ? <span className="hp-spinner" aria-hidden="true" /> : leftIcon}
      <span className="hp-button__label">{children}</span>
      {!loading && rightIcon}
    </button>
  )
}
