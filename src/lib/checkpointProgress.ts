/**
 * Checkpoint answers, synced across devices.
 *
 * A checkpoint asks the learner to commit before moving on, so the answer has to
 * persist — walking back and finding your reasoning erased teaches nothing. Answers
 * are never scored: a wrong one still counts as answered, and can be changed later.
 */

import type { LessonBlock } from '../data/types'
import { readState, writeState } from './syncedStore'

const KEY = 'checkpoints'

/** Checkpoints carry no id, so derive a stable one from the snippet they show. */
export function checkpointId(block: LessonBlock): string {
  const source = block.checkpoint?.code || ''
  let hash = 0
  for (let index = 0; index < source.length; index += 1) hash = (hash * 31 + source.charCodeAt(index)) | 0
  return `cp${hash.toString(36)}`
}

export type CheckpointAnswers = Record<string, number>

export function loadCheckpointAnswers(learnerId: string): CheckpointAnswers {
  const stored = readState<Record<string, unknown>>(learnerId, KEY, {})
  return Object.fromEntries(
    Object.entries(stored).filter(([, value]) => typeof value === 'number'),
  ) as CheckpointAnswers
}

export function saveCheckpointAnswer(learnerId: string, id: string, chosen: number) {
  if (!learnerId) return
  writeState<CheckpointAnswers>(learnerId, KEY, { [id]: chosen })
}

/** True when every checkpoint in these blocks has been answered, right or wrong. */
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

export { subscribeState as subscribeCheckpoints, getStateVersion as getCheckpointVersion } from './syncedStore'
