import { useEffect, useState } from 'react'
import { getPythonLoadProgress, subscribePythonLoadProgress, type PythonLoadProgress } from '../lib/pyodide'
import type { Lang } from '../data/types'
import { Progress } from './ui'

/**
 * What the learner sees while Python is downloading for the first time.
 *
 * The runtime is roughly 12 MB and is fetched once, the first time anyone runs
 * code. Previously this was a bare spinner: on a slow connection, minutes of
 * silence before the first line of Python they ever write, with no indication that
 * anything was happening or how long it would take. People assume the app is
 * broken and leave.
 *
 * Three things matter here, in order:
 *   1. Say that something is downloading, and how much.
 *   2. Say it happens once and then works offline — that reframes the wait as an
 *      investment rather than a recurring cost.
 *   3. Disappear entirely once it is ready. This is not a permanent fixture.
 */

const COPY: Record<Lang, {
  downloading: string
  starting: string
  once: string
  offline: string
}> = {
  en: {
    downloading: 'Downloading Python',
    starting: 'Starting Python',
    once: 'This happens only the first time.',
    offline: 'After this, running code works offline.',
  },
  pt: {
    downloading: 'Baixando o Python',
    starting: 'Iniciando o Python',
    once: 'Isso acontece só na primeira vez.',
    offline: 'Depois disso, executar código funciona offline.',
  },
}

function megabytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}

export default function PythonLoadingProgress({ lang }: { lang: Lang }) {
  const [progress, setProgress] = useState<PythonLoadProgress>(getPythonLoadProgress)

  useEffect(() => {
    setProgress(getPythonLoadProgress())
    return subscribePythonLoadProgress(setProgress)
  }, [])

  // Nothing to say before it starts, or once it is done.
  if (progress.stage === 'idle' || progress.stage === 'ready') return null

  const copy = COPY[lang] ?? COPY.en
  const downloading = progress.stage === 'downloading' && progress.total > 0
  const percent = downloading ? Math.min(100, Math.round((progress.loaded / progress.total) * 100)) : 100

  return (
    <div
      className="rounded-xl border border-line bg-surface p-3"
      data-testid="python-loading-progress"
      role="status"
      aria-live="polite"
    >
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-ink">
        <span>{downloading ? copy.downloading : copy.starting}</span>
        {downloading && (
          <span className="font-mono text-xs text-ink-secondary" data-testid="python-loading-bytes">
            {megabytes(progress.loaded)} / {megabytes(progress.total)} MB
          </span>
        )}
      </div>
      <Progress
        value={percent}
        max={100}
        // An indeterminate stage still shows a full bar rather than a stalled one.
        tone={downloading ? 'primary' : 'success'}
      />
      <p className="mt-2 mb-0 text-xs leading-relaxed text-ink-secondary">
        {copy.once} {copy.offline}
      </p>
    </div>
  )
}
