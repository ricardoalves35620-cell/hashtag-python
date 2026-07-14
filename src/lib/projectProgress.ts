import { getSupabase } from './supabase'
import type { ProjectCheckpointId } from '../data/miniProjects'
import { emitSyncState } from './syncStatus'

export interface ProjectTestStatus {
  id: string
  passed: boolean
  details: string
}

export interface MiniProjectProgress {
  version: 1
  projectId: string
  currentCheckpoint: ProjectCheckpointId
  completedCheckpoints: ProjectCheckpointId[]
  understanding: {
    inputs: string
    output: string
    rules: string
    edgeCase: string
  }
  pseudocode: string
  code: string
  output: string
  testResults: ProjectTestStatus[]
  testedCode: string
  selectedRefactors: number[]
  completed: boolean
  updatedAt: string
}

const STORAGE_PREFIX = 'hp_mini_project_v1_'
const CHECKPOINT_ORDER: ProjectCheckpointId[] = ['understand', 'plan', 'build', 'test', 'refactor']

function storageKey(userId: string, projectId: string) {
  return `${STORAGE_PREFIX}${userId}_${projectId}`
}

export function createMiniProjectProgress(projectId: string, starterCode: string): MiniProjectProgress {
  return {
    version: 1,
    projectId,
    currentCheckpoint: 'understand',
    completedCheckpoints: [],
    understanding: { inputs: '', output: '', rules: '', edgeCase: '' },
    pseudocode: '',
    code: starterCode,
    output: '',
    testResults: [],
    testedCode: '',
    selectedRefactors: [],
    completed: false,
    updatedAt: new Date().toISOString(),
  }
}

export function loadLocalProjectProgress(userId: string, projectId: string, starterCode: string) {
  if (typeof localStorage === 'undefined') return createMiniProjectProgress(projectId, starterCode)
  try {
    const raw = localStorage.getItem(storageKey(userId, projectId))
    if (!raw) return createMiniProjectProgress(projectId, starterCode)
    const parsed = JSON.parse(raw) as Partial<MiniProjectProgress>
    if (parsed.version !== 1 || parsed.projectId !== projectId) return createMiniProjectProgress(projectId, starterCode)
    return {
      ...createMiniProjectProgress(projectId, starterCode),
      ...parsed,
      understanding: {
        ...createMiniProjectProgress(projectId, starterCode).understanding,
        ...(parsed.understanding || {}),
      },
      completedCheckpoints: Array.isArray(parsed.completedCheckpoints) ? parsed.completedCheckpoints : [],
      selectedRefactors: Array.isArray(parsed.selectedRefactors) ? parsed.selectedRefactors : [],
      testResults: Array.isArray(parsed.testResults) ? parsed.testResults : [],
      code: typeof parsed.code === 'string' ? parsed.code : starterCode,
    } as MiniProjectProgress
  } catch {
    return createMiniProjectProgress(projectId, starterCode)
  }
}

export function saveLocalProjectProgress(userId: string, progress: MiniProjectProgress) {
  if (typeof localStorage === 'undefined') return progress
  const next = { ...progress, updatedAt: progress.updatedAt || new Date().toISOString() }
  localStorage.setItem(storageKey(userId, progress.projectId), JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('hp:project-progress', { detail: next }))
  return next
}

function newestText(local: MiniProjectProgress, remote: MiniProjectProgress, field: 'pseudocode' | 'code' | 'output' | 'testedCode') {
  const localTime = Date.parse(local.updatedAt || '') || 0
  const remoteTime = Date.parse(remote.updatedAt || '') || 0
  return remoteTime > localTime ? remote[field] : local[field]
}

/**
 * Project progress is partly monotonic (completed checkpoints) and partly
 * editable (code and planning text). Monotonic evidence is unioned; editable
 * fields use the most recently saved device.
 */
export function mergeProjectProgress(local: MiniProjectProgress, remote: MiniProjectProgress | null) {
  if (!remote || remote.version !== 1 || remote.projectId !== local.projectId) return local
  const localTime = Date.parse(local.updatedAt || '') || 0
  const remoteTime = Date.parse(remote.updatedAt || '') || 0
  const newest = remoteTime > localTime ? remote : local
  const completedCheckpoints = [...new Set([...local.completedCheckpoints, ...remote.completedCheckpoints])]
    .sort((a, b) => CHECKPOINT_ORDER.indexOf(a) - CHECKPOINT_ORDER.indexOf(b))

  return {
    ...newest,
    version: 1,
    projectId: local.projectId,
    completedCheckpoints,
    understanding: newest.understanding,
    pseudocode: newestText(local, remote, 'pseudocode'),
    code: newestText(local, remote, 'code'),
    output: newestText(local, remote, 'output'),
    testedCode: newestText(local, remote, 'testedCode'),
    testResults: newest.testResults,
    selectedRefactors: [...new Set([...local.selectedRefactors, ...remote.selectedRefactors])],
    completed: local.completed || remote.completed,
    currentCheckpoint: newest.currentCheckpoint,
    updatedAt: new Date(Math.max(localTime, remoteTime)).toISOString(),
  } satisfies MiniProjectProgress
}

export async function fetchRemoteProjectProgress(userId: string, projectId: string): Promise<MiniProjectProgress | null> {
  if (userId === 'guest') return null
  const { data, error } = await getSupabase()
    .from('learning_project_progress')
    .select('state, updated_at')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .maybeSingle()

  if (error) {
    console.warn('Could not fetch mini-project progress. Run supabase/cross-device-sync-v2.sql.', error)
    return null
  }
  if (!data?.state) return null
  const state = data.state as MiniProjectProgress
  return { ...state, updatedAt: data.updated_at || state.updatedAt }
}

export async function syncProjectProgress(userId: string, local: MiniProjectProgress) {
  if (userId === 'guest' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    emitSyncState('pending', 'Project saved locally while offline')
    return local
  }

  emitSyncState('syncing')
  try {
    const remote = await fetchRemoteProjectProgress(userId, local.projectId)
    const merged = mergeProjectProgress(local, remote)
    const timestamped = { ...merged, updatedAt: new Date().toISOString() }
    const { error } = await getSupabase().from('learning_project_progress').upsert({
      user_id: userId,
      project_id: timestamped.projectId,
      state: timestamped,
      completed: timestamped.completed,
      updated_at: timestamped.updatedAt,
    }, { onConflict: 'user_id,project_id' })

    if (error) throw error
    saveLocalProjectProgress(userId, timestamped)
    emitSyncState('synced')
    return timestamped
  } catch (error) {
    console.warn('Could not sync mini-project progress. Run supabase/cross-device-sync-v2.sql.', error)
    emitSyncState('pending', 'Project is waiting to sync')
    return local
  }
}

const projectTimers = new Map<string, ReturnType<typeof setTimeout>>()
const pendingProjects = new Map<string, MiniProjectProgress>()

export function scheduleProjectProgressSync(userId: string, progress: MiniProjectProgress) {
  if (userId === 'guest') return
  const key = `${userId}:${progress.projectId}`
  const previous = pendingProjects.get(key)
  pendingProjects.set(key, previous ? mergeProjectProgress(progress, previous) : progress)
  const timer = projectTimers.get(key)
  if (timer) clearTimeout(timer)
  projectTimers.set(key, setTimeout(async () => {
    projectTimers.delete(key)
    const next = pendingProjects.get(key)
    pendingProjects.delete(key)
    if (next) await syncProjectProgress(userId, next)
  }, 750))
}

export function isMiniProjectComplete(userId: string | null, projectId: string, starterCode: string) {
  if (!userId) return false
  return loadLocalProjectProgress(userId, projectId, starterCode).completed
}
