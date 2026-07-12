import { cn } from './utils'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  tone?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Progress({ value, max = 100, label, showValue = false, tone = 'primary', size = 'md', className }: ProgressProps) {
  const safeMax = max > 0 ? max : 100
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100))
  return (
    <div className={cn('hp-progress', className)}>
      {(label || showValue) && <div className="hp-progress__meta"><span>{label}</span>{showValue && <span>{Math.round(percentage)}%</span>}</div>}
      <div className={cn('hp-progress__track', `hp-progress__track--${size}`)} role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={Math.min(safeMax, Math.max(0, value))} aria-label={label}>
        <div className={cn('hp-progress__bar', `hp-progress__bar--${tone}`)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
