import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from './utils'

interface FieldShellProps {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  children: ReactNode
  className?: string
}

function FieldShell({ label, hint, error, required, children, className }: FieldShellProps) {
  return (
    <label className={cn('hp-field', className)}>
      {label && <span className="hp-field__label">{label}{required && <span aria-hidden="true"> *</span>}</span>}
      {children}
      {(error || hint) && <span className={cn('hp-field__helper', Boolean(error) && 'hp-field__helper--error')}>{error || hint}</span>}
    </label>
  )
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export function Input({ label, hint, error, required, className, ...props }: InputProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      <input className={cn('hp-input', Boolean(error) && 'hp-input--error', className)} aria-invalid={Boolean(error) || undefined} required={required} {...props} />
    </FieldShell>
  )
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export function Textarea({ label, hint, error, required, className, ...props }: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      <textarea className={cn('hp-input hp-textarea', Boolean(error) && 'hp-input--error', className)} aria-invalid={Boolean(error) || undefined} required={required} {...props} />
    </FieldShell>
  )
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export function Select({ label, hint, error, required, className, children, ...props }: SelectProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      <select className={cn('hp-input hp-select', Boolean(error) && 'hp-input--error', className)} aria-invalid={Boolean(error) || undefined} required={required} {...props}>{children}</select>
    </FieldShell>
  )
}
