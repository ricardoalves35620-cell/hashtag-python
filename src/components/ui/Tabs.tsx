import type { ReactNode } from 'react'
import { cn } from './utils'

export interface TabItem<T extends string> {
  id: T
  label: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

interface TabsProps<T extends string> {
  items: Array<TabItem<T>>
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  className?: string
}

export function Tabs<T extends string>({ items, value, onChange, ariaLabel, className }: TabsProps<T>) {
  return (
    <div className={cn('hp-tabs', className)} role="tablist" aria-label={ariaLabel}>
      {items.map(item => (
        <button
          type="button"
          key={item.id}
          role="tab"
          aria-selected={value === item.id}
          disabled={item.disabled}
          className={cn('hp-tab', value === item.id && 'hp-tab--active')}
          onClick={() => onChange(item.id)}
        >
          <span>{item.label}</span>{item.badge && <span className="hp-tab__badge">{item.badge}</span>}
        </button>
      ))}
    </div>
  )
}
