import type { ExercisePedagogy } from '../lib/pedagogy'
import { difficultyLabel } from '../lib/pedagogy'
import type { Lang } from '../data/types'
import { Badge, Card } from './ui'

export default function LearningBrief({ brief, lang }: { brief: ExercisePedagogy; lang: Lang }) {
  return (
    <Card padding="md" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{lang === 'en' ? 'Learning objective' : 'Objetivo de aprendizagem'}</div>
          <p className="mt-1 text-sm leading-6 text-ink-secondary">{brief.objective}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={brief.difficulty === 'challenge' ? 'warning' : brief.difficulty === 'guided' ? 'info' : 'neutral'}>{difficultyLabel(brief.difficulty, lang)}</Badge>
          <Badge variant="neutral">≈ {brief.estimatedMinutes} min</Badge>
        </div>
      </div>

      {brief.skills.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{lang === 'en' ? 'Skills practiced' : 'Habilidades praticadas'}</div>
          <div className="mt-2 flex flex-wrap gap-2">{brief.skills.map(skill => <Badge key={skill} variant="primary">{skill}</Badge>)}</div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{lang === 'en' ? 'Evidence of success' : 'Evidências de sucesso'}</div>
          <ul className="mt-2 space-y-2 text-sm text-ink-secondary">{brief.successCriteria.map(item => <li key={item} className="flex gap-2"><span className="text-success">✓</span><span>{item}</span></li>)}</ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{lang === 'en' ? 'Watch out for' : 'Erros comuns'}</div>
          <ul className="mt-2 space-y-2 text-sm text-ink-secondary">{brief.commonMistakes.slice(0, 3).map(item => <li key={item} className="flex gap-2"><span className="text-warning">!</span><span>{item}</span></li>)}</ul>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-canvas p-3 text-sm leading-6 text-ink-secondary">
        <strong className="text-ink">{lang === 'en' ? 'Why this matters at work: ' : 'Por que isso importa no trabalho: '}</strong>{brief.workplaceContext}
      </div>
    </Card>
  )
}
