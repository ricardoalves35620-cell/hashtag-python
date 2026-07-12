import type { ErrorExplanation } from '../lib/errorExplainer'
import type { Lang } from '../data/types'
import { Alert, Button, Card } from './ui'

interface Props { explanation: ErrorExplanation; lang: Lang; rawError: string; showRaw: boolean; onToggleRaw: () => void }

export default function ErrorExplainer({ explanation, lang, rawError, showRaw, onToggleRaw }: Props) {
  const t = { en: { why: 'What happened', fix: 'How to fix', tip: 'Pro tip', raw: 'Show technical error', hideRaw: 'Hide technical error', problem: 'Problematic line' }, pt: { why: 'O que aconteceu', fix: 'Como corrigir', tip: 'Dica pro', raw: 'Ver erro técnico', hideRaw: 'Esconder erro técnico', problem: 'Linha problemática' } }[lang]
  return (
    <Card variant="danger" padding="md" className="space-y-4">
      <div className="flex items-start gap-3"><span className="hp-alert__icon" aria-hidden="true">×</span><div><div className="font-bold">{explanation.title[lang]}</div><div className="mt-1 text-xs opacity-80">{explanation.type} · {explanation.where[lang]}</div></div></div>
      {explanation.badCode && <div><div className="mb-2 text-caption font-bold uppercase tracking-wide">{t.problem}</div><pre className="m-0 overflow-x-auto rounded-hp bg-canvas p-3 font-mono text-xs text-danger-text border border-danger-border">{explanation.badCode}</pre></div>}
      <Alert variant="danger" title={t.why}>{explanation.why[lang]}</Alert>
      <Alert variant="success" title={t.fix}><pre className="m-0 whitespace-pre-wrap font-inherit text-sm">{explanation.fix[lang]}</pre></Alert>
      <Alert variant="info" title={t.tip}>{explanation.tip[lang]}</Alert>
      <Button variant="ghost" size="sm" onClick={onToggleRaw}>{showRaw ? t.hideRaw : t.raw}</Button>
      {showRaw && <pre className="m-0 max-h-40 overflow-auto whitespace-pre-wrap rounded-hp bg-canvas p-3 text-xs text-ink-muted border border-line">{rawError}</pre>}
    </Card>
  )
}
