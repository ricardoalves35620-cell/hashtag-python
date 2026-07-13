import { getSupabase } from './supabase'
import type { ProjectCheckpointId } from '../data/miniProjects'

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
  const next = { ...progress, updatedAt: new Date().toISOString() }
  localStorage.setItem(storageKey(userId, progress.projectId), JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('hp:project-progress', { detail: next }))
  return next
}

export function mergeProjectProgress(local: MiniProjectProgress, remote: MiniProjectProgress | null) {
  if (!remote) return local
  const localTime = Date.parse(local.updatedAt || '') || 0
  const remoteTime = Date.parse(remote.updatedAt || '') || 0
  return remoteTime > localTime ? remote : local
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
    console.warn('Could not fetch mini-project progress. Run supabase/learning-project-progress.sql.', error)
    return null
  }
  if (!data?.state) return null
  const state = data.state as MiniProjectProgress
  return { ...state, updatedAt: data.updated_at || state.updatedAt }
}

export async function syncProjectProgress(userId: string, progress: MiniProjectProgress) {
  if (userId === 'guest' || (typeof navigator !== 'undefined' && !navigator.onLine)) return false
  const { error } = await getSupabase().from('learning_project_progress').upsert({
    user_id: userId,
    project_id: progress.projectId,
    state: progress,
    completed: progress.completed,
    updated_at: progress.updatedAt,
  }, { onConflict: 'user_id,project_id' })

  if (error) {
    console.warn('Could not sync mini-project progress. Run supabase/learning-project-progress.sql.', error)
    return false
  }
  return true
}

export function isMiniProjectComplete(userId: string | null, projectId: string, starterCode: string) {
  if (!userId) return false
  return loadLocalProjectProgress(userId, projectId, starterCode).completed
}
