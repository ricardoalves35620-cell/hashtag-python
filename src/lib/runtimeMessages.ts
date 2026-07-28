import { PythonUnavailableError } from './pyodide'
import type { Lang } from '../data/types'

/**
 * One place for "we could not load Python".
 *
 * Every screen that runs code used to print the raw failure straight into its
 * output panel, so a learner saw
 *
 *   ❌ Error: Failed to execute 'importScripts' on 'WorkerGlobalScope':
 *      The script at 'https://cdn.jsdelivr.net/pyodide/...' failed to load.
 *
 * in English, in a pt-BR session, in the same panel their own program's output
 * appears in. A beginner reads that as "I broke it". MiniProject was worse: it had
 * no catch at all, so the button simply stopped spinning and nothing happened.
 *
 * This is deliberately shared rather than duplicated per page — user-facing copy
 * that exists in four places drifts.
 */

export function isPythonUnavailable(error: unknown): boolean {
  if (error instanceof PythonUnavailableError) return true
  // Defensive: some paths surface the worker's own string rather than the typed
  // error. importScripts and the CDN host are the reliable markers.
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  return /importScripts|cdn\.jsdelivr\.net|Python worker (crashed|failed)|could not be loaded/i.test(message)
}

export interface RuntimeUnavailableCopy {
  title: string
  body: string
  hint: string
  retry: string
}

const COPY: Record<Lang, RuntimeUnavailableCopy> = {
  en: {
    title: 'Python could not be loaded',
    body: 'This is not a problem with your code — nothing was checked. Python is downloaded the first time you run it, so this usually means the connection dropped.',
    hint: 'Check your connection and try again. Once Python has loaded successfully one time, it works offline.',
    retry: 'Try again',
  },
  pt: {
    title: 'Não foi possível carregar o Python',
    body: 'Não é um problema no seu código — nada foi verificado. O Python é baixado na primeira execução, então normalmente isso significa que a conexão caiu.',
    hint: 'Verifique sua conexão e tente de novo. Depois que o Python carregar uma vez, ele funciona offline.',
    retry: 'Tentar de novo',
  },
}

export function runtimeUnavailableCopy(lang: Lang): RuntimeUnavailableCopy {
  return COPY[lang] ?? COPY.en
}

/** Single-line form for screens whose output area is plain text. */
export function runtimeUnavailableText(lang: Lang): string {
  const copy = COPY[lang] ?? COPY.en
  return `${copy.title}\n\n${copy.body}\n\n${copy.hint}`
}
