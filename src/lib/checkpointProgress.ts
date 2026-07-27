/**
 * Checkpoint answers, kept so they survive navigation.
 *
 * A checkpoint exists to make the learner commit to an answer before moving on. Two
 * things follow from that: the answer has to persist (walking back to a lesson and
 * finding your reasoning erased teaches nothing), and an unanswered checkpoint should
 * hold the "next" button — otherwise it is trivially skipped and adds nothing.
 *
 * Answers are never scored. Getting one wrong still counts as answered; the point is
 * to have committed and read the explanation.
 */

import type { LessonBlock } from '../data/types'

const KEY_PREFIX = 'hp_checkpoint_'

function key(learnerId: string) {
  return `${KEY_PREFIX}${learnerId}`
}

/** Checkpoints carry no id, so derive a stable one from the snippet they show. */
export function checkpointId(block: LessonBlock): string {
  const source = block.checkpoint?.code || ''
  let hash = 0
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) | 0
  }
  return `cp${hash.toString(36)}`
}

export type CheckpointAnswers = Record<string, number>

export function loadCheckpointAnswers(learnerId: string): CheckpointAnswers {
  if (!learnerId || typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(key(learnerId))
    const parsed = raw ? JSON.parse(raw) : null
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => typeof value === 'number'),
    ) as CheckpointAnswers
  } catch {
    return {}
  }
}

export function saveCheckpointAnswer(learnerId: string, id: string, chosen: number) {
  if (!learnerId || typeof localStorage === 'undefined') return
  try {
    const current = loadCheckpointAnswers(learnerId)
    current[id] = chosen
    localStorage.setItem(key(learnerId), JSON.stringify(current))
  } catch {
    // Storage blocked. The answer still stands for this session.
  }
  notify()
}

/** True when every checkpoint in these blocks has been answered. */
export function areCheckpointsAnswered(learnerId: string, blocks: LessonBlock[]): boolean {
  const checkpoints = blocks.filter(block => block.type === 'checkpoint' && block.checkpoint)
  if (checkpoints.length === 0) return true
  const answers = loadCheckpointAnswers(learnerId)
  return checkpoints.every(block => typeof answers[checkpointId(block)] === 'number')
}

export function countUnansweredCheckpoints(learnerId: string, blocks: LessonBlock[]): number {
  const checkpoints = blocks.filter(block => block.type === 'checkpoint' && block.checkpoint)
  if (checkpoints.length === 0) return 0
  const answers = loadCheckpointAnswers(learnerId)
  return checkpoints.filter(block => typeof answers[checkpointId(block)] !== 'number').length
}

export function isCheckpointProgressKey(storageKey: string) {
  return storageKey.startsWith(KEY_PREFIX)
}

// ── Change notification, so a gate re-evaluates the moment an answer lands ──
let version = 0
const listeners = new Set<() => void>()

function notify() {
  version += 1
  listeners.forEach(listener => listener())
}

export function subscribeCheckpoints(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function getCheckpointVersion(): number {
  return version
}
