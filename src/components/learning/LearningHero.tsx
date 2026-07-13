import type { ReactNode, RefObject } from 'react'
import { Progress } from '../ui/Progress'

interface LearningHeroProps {
  eyebrow: string
  title: string
  description: string
  icon?: string
  current: number
  total: number
  progress: number
  progressLabel: string
  secondaryLabel?: string
  action?: ReactNode
  titleRef?: RefObject<HTMLHeadingElement>
}

export default function LearningHero({
  eyebrow,
  title,
  description,
  icon,
  current,
  total,
  progress,
  progressLabel,
  secondaryLabel,
  action,
  titleRef,
}: LearningHeroProps) {
  return (
    <header className="learning-hero">
      <div className="learning-hero__topline">
        <div className="learning-hero__eyebrow">{eyebrow}</div>
        {action}
      </div>
      <div className="learning-hero__content">
        {icon && <div className="learning-hero__icon" aria-hidden="true">{icon}</div>}
        <div className="learning-hero__copy">
          <div className="learning-hero__position">{current}/{total}</div>
          <h1 ref={titleRef} tabIndex={-1} className="learning-hero__title">{title}</h1>
          <p className="learning-hero__description">{description}</p>
        </div>
      </div>
      <div className="learning-hero__progress-copy">
        <span>{progressLabel}</span>
        <strong>{Math.max(0, Math.min(100, progress))}%</strong>
      </div>
      <Progress value={progress} className="learning-hero__progress" />
      {secondaryLabel && <div className="learning-hero__secondary">{secondaryLabel}</div>}
    </header>
  )
}
