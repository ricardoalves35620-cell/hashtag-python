import type { Lang } from '../data/types'

/**
 * Renders a task description with its structure intact.
 *
 * Descriptions are plain text — the app prints them literally, so no markdown. But a
 * task written as Goal / numbered groups / bullets reads far better when those parts
 * are actually laid out, rather than run together in one paragraph.
 *
 * Four line shapes are recognised:
 *   "Goal:" / "Objetivo:"                 → a small label
 *   "Program requirements"                → a small label
 *   "1. Gather input"                     → a group heading
 *   "- The member's name"                 → a bullet under that group
 *   "Example result:" then output lines   → a label plus a monospace block
 *
 * Anything that does not match falls through as ordinary prose, so a description
 * written in any other shape still renders correctly.
 */

type Line =
  | { kind: 'label'; text: string }
  | { kind: 'group'; text: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'output'; text: string }
  | { kind: 'prose'; text: string }

const LABEL = /^(goal|objetivo|program requirements|requisitos do programa|requisitos)\s*:?\s*$/i
const EXAMPLE = /^(example[^:]*|exemplo[^:]*)\s*:\s*$/i
const GROUP = /^\d+\.\s+\S/
const BULLET = /^[-•]\s+\S/

function parse(text: string): Line[] {
  const out: Line[] = []
  let inExample = false

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) { inExample = false; continue }

    if (EXAMPLE.test(line)) { out.push({ kind: 'label', text: line.replace(/:\s*$/, '') }); inExample = true; continue }
    if (inExample) { out.push({ kind: 'output', text: line }); continue }
    if (LABEL.test(line)) { out.push({ kind: 'label', text: line.replace(/:\s*$/, '') }); continue }
    if (GROUP.test(line)) { out.push({ kind: 'group', text: line }); continue }
    if (BULLET.test(line)) { out.push({ kind: 'bullet', text: line.replace(BULLET, '').trim() }); continue }
    out.push({ kind: 'prose', text: line })
  }
  return out
}

export default function TaskDescription({ text, lang }: { text: string; lang?: Lang }) {
  void lang
  const lines = parse(text)
  const structured = lines.some(l => l.kind === 'group' || l.kind === 'bullet' || l.kind === 'label')

  // Nothing recognisable — render exactly as written, line breaks and all.
  if (!structured) {
    return <p className="mt-1 whitespace-pre-line text-sm leading-6 text-ink-secondary">{text}</p>
  }

  const nodes: React.ReactNode[] = []
  let bullets: string[] = []
  let outputs: string[] = []

  const flushBullets = (key: string) => {
    if (!bullets.length) return
    nodes.push(
      <ul key={`b${key}`} className="mb-3 ml-4 list-disc space-y-0.5 text-sm leading-6 text-ink-secondary">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>,
    )
    bullets = []
  }
  const flushOutputs = (key: string) => {
    if (!outputs.length) return
    nodes.push(
      <pre key={`o${key}`} className="mb-3 overflow-x-auto rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs leading-5 text-ink-secondary">
        {outputs.join('\n')}
      </pre>,
    )
    outputs = []
  }

  lines.forEach((line, index) => {
    const key = String(index)
    if (line.kind !== 'bullet') flushBullets(key)
    if (line.kind !== 'output') flushOutputs(key)

    switch (line.kind) {
      case 'label':
        nodes.push(
          <p key={key} className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted first:mt-0">
            {line.text}
          </p>,
        )
        break
      case 'group':
        nodes.push(<p key={key} className="mb-1 mt-2 text-sm font-semibold text-ink">{line.text}</p>)
        break
      case 'bullet':
        bullets.push(line.text)
        break
      case 'output':
        outputs.push(line.text)
        break
      default:
        nodes.push(<p key={key} className="mb-2 text-sm leading-6 text-ink-secondary">{line.text}</p>)
    }
  })
  flushBullets('end')
  flushOutputs('end')

  return <div className="mt-1">{nodes}</div>
}
