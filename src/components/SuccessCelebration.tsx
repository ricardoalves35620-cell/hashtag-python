import { useEffect, useState } from 'react'

interface SuccessCelebrationProps {
  active: boolean
  label?: string
}

const pieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${5 + ((index * 37) % 90)}%`,
  delay: `${(index % 6) * 70}ms`,
  duration: `${900 + (index % 5) * 120}ms`,
  rotation: `${(index * 53) % 180}deg`,
}))

export default function SuccessCelebration({ active, label = 'Achievement unlocked' }: SuccessCelebrationProps) {
  const [visible, setVisible] = useState(active)

  useEffect(() => {
    if (!active) return
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 1800)
    return () => window.clearTimeout(timer)
  }, [active])

  if (!visible) return null

  return (
    <div className="hp-celebration" aria-label={label} role="status">
      <div className="hp-celebration__halo" aria-hidden="true" />
      {pieces.map(piece => (
        <span
          key={piece.id}
          className={`hp-confetti hp-confetti--${(piece.id % 4) + 1}`}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            rotate: piece.rotation,
          }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}
