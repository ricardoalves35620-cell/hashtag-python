import type { ReactNode } from 'react'

export interface LearningStageItem {
  id: string
  icon: ReactNode
  title: string
  description?: string
  done?: boolean
  active?: boolean
  available?: boolean
}

interface LearningStageRailProps {
  items: LearningStageItem[]
  currentId: string
  onSelect?: (id: string) => void
  label: string
  compactLabel?: string
}

export default function LearningStageRail({ items, currentId, onSelect, label, compactLabel }: LearningStageRailProps) {
  return (
    <nav className="learning-stage-rail" aria-label={label}>
      <div className="learning-stage-rail__heading">
        <span>{compactLabel || label}</span>
        <span>{items.findIndex(item => item.id === currentId) + 1}/{items.length}</span>
      </div>
      <div className="learning-stage-rail__track">
        {items.map((item, index) => {
          const active = item.id === currentId
          const available = item.available ?? item.done ?? index === 0
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => available && onSelect?.(item.id)}
              disabled={!available}
              aria-current={active ? 'step' : undefined}
              className={`learning-stage-rail__item${active ? ' is-active' : ''}${item.done ? ' is-done' : ''}`}
            >
              <span className="learning-stage-rail__marker" aria-hidden="true">
                {item.done && !active ? '✓' : item.icon}
              </span>
              <span className="learning-stage-rail__copy">
                <span className="learning-stage-rail__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="learning-stage-rail__title">{item.title}</span>
                {item.description && <span className="learning-stage-rail__description">{item.description}</span>}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
