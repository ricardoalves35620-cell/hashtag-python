export type BaseZeroModuleId = 'files' | 'downloads' | 'local-cloud' | 'terminal' | 'hardware'

export interface BaseZeroState {
  version: 1
  completed: BaseZeroModuleId[]
  readinessScore: number | null
  updatedAt: number
}

export const BASE_ZERO_MODULE_IDS: BaseZeroModuleId[] = ['files', 'downloads', 'local-cloud', 'terminal', 'hardware']

export function createBaseZeroState(): BaseZeroState {
  return { version: 1, completed: [], readinessScore: null, updatedAt: Date.now() }
}

function key(learnerId: string) {
  return `hp_base_zero_v1_${learnerId}`
}

export function loadBaseZeroState(learnerId: string): BaseZeroState {
  if (typeof localStorage === 'undefined') return createBaseZeroState()
  try {
    const raw = localStorage.getItem(key(learnerId))
    if (!raw) return createBaseZeroState()
    const parsed = JSON.parse(raw) as Partial<BaseZeroState>
    return {
      version: 1,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id): id is BaseZeroModuleId => BASE_ZERO_MODULE_IDS.includes(id as BaseZeroModuleId)) : [],
      readinessScore: typeof parsed.readinessScore === 'number' ? parsed.readinessScore : null,
      updatedAt: parsed.updatedAt || Date.now(),
    }
  } catch {
    return createBaseZeroState()
  }
}

export function saveBaseZeroState(learnerId: string, state: BaseZeroState) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(key(learnerId), JSON.stringify({ ...state, updatedAt: Date.now() }))
}

export function completeBaseZeroModule(state: BaseZeroState, moduleId: BaseZeroModuleId): BaseZeroState {
  return { ...state, completed: [...new Set([...state.completed, moduleId])], updatedAt: Date.now() }
}

export function setReadinessScore(state: BaseZeroState, score: number): BaseZeroState {
  return { ...state, readinessScore: Math.max(0, Math.min(100, Math.round(score))), updatedAt: Date.now() }
}

export function isBaseZeroComplete(state: BaseZeroState) {
  return BASE_ZERO_MODULE_IDS.every(id => state.completed.includes(id))
}


export function migrateGuestBaseZeroState(userId: string) {
  if (typeof localStorage === 'undefined') return
  const guest = loadBaseZeroState('guest')
  const account = loadBaseZeroState(userId)
  const completed = [...new Set([...account.completed, ...guest.completed])]
  const readinessScore = Math.max(account.readinessScore || 0, guest.readinessScore || 0) || null
  saveBaseZeroState(userId, { version: 1, completed, readinessScore, updatedAt: Date.now() })
}

export function validateFileChallenge(folderName: string, fileName: string) {
  const folder = folderName.trim().toLocaleLowerCase().replace(/\s+/g, '')
  const file = fileName.trim().toLocaleLowerCase()
  return folder === 'projetospython' && file === 'meu_primeiro.py'
}

export const INSTALL_SEQUENCE = ['download', 'open', 'path', 'install', 'verify'] as const
export type InstallStep = typeof INSTALL_SEQUENCE[number]

export function validateInstallSequence(sequence: InstallStep[]) {
  return sequence.length === INSTALL_SEQUENCE.length && sequence.every((step, index) => step === INSTALL_SEQUENCE[index])
}

export const LOCAL_CLOUD_ANSWERS: Record<string, 'local' | 'cloud'> = {
  'downloads-folder': 'local',
  'google-drive': 'cloud',
  'desktop-file': 'local',
  'onedrive-web': 'cloud',
}

export function scoreClassification(answers: Record<string, 'local' | 'cloud'>) {
  const keys = Object.keys(LOCAL_CLOUD_ANSWERS)
  const correct = keys.filter(key => answers[key] === LOCAL_CLOUD_ANSWERS[key]).length
  return Math.round((correct / keys.length) * 100)
}

export const HARDWARE_ANSWERS: Record<string, string> = {
  calculate: 'cpu',
  temporary: 'ram',
  permanent: 'storage',
  parallel: 'gpu',
}

export function scoreHardware(answers: Record<string, string>) {
  const keys = Object.keys(HARDWARE_ANSWERS)
  const correct = keys.filter(key => answers[key] === HARDWARE_ANSWERS[key]).length
  return Math.round((correct / keys.length) * 100)
}
