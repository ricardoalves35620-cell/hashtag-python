export const PHASE_COUNT = 69
export const AUDIT_ENVIRONMENT_COUNT = 12

export type AuditMode = 'smart' | 'full' | 'smoke'
export type AuditDepth = 'smoke' | 'standard' | 'deep'

export interface AuditPlanEntry {
  id: string
  phaseIds: number[]
  environmentIndex: number
  depth: AuditDepth
  reason: 'core-curriculum' | 'sentinel-matrix' | 'full-matrix' | 'smoke-matrix' | 'confirm-new-issue'
  confirmFingerprints?: string[]
}

export const SMART_SENTINEL_PHASES = [0, 1, 4, 8, 12, 18, 24, 32, 39, 46, 54, 61, 68] as const
export const SMOKE_SENTINEL_PHASES = [0, 12, 39, 54, 68] as const

function chunk<T>(values: readonly T[], size: number): T[][] {
  const result: T[][] = []
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size))
  }
  return result
}

function rotateEnvironment(index: number, offset: number) {
  return (index + offset) % AUDIT_ENVIRONMENT_COUNT
}

function interleave(entriesByEnvironment: AuditPlanEntry[][]) {
  const result: AuditPlanEntry[] = []
  const max = Math.max(...entriesByEnvironment.map(entries => entries.length), 0)
  for (let round = 0; round < max; round += 1) {
    for (const entries of entriesByEnvironment) {
      const entry = entries[round]
      if (entry) result.push(entry)
    }
  }
  return result
}

function makeEntry(
  mode: AuditMode,
  environmentIndex: number,
  phaseIds: number[],
  depth: AuditDepth,
  reason: AuditPlanEntry['reason'],
  sequence: number,
): AuditPlanEntry {
  return {
    id: `${mode}-${environmentIndex}-${sequence}-${phaseIds.join('.')}`,
    phaseIds,
    environmentIndex,
    depth,
    reason,
  }
}

export function buildAuditPlan(mode: AuditMode, requestedBatch: number, environmentOffset = 0): AuditPlanEntry[] {
  const batch = Math.max(1, Math.min(PHASE_COUNT, requestedBatch))
  const allPhases = Array.from({ length: PHASE_COUNT }, (_, index) => index)
  const normalizedOffset = ((environmentOffset % AUDIT_ENVIRONMENT_COUNT) + AUDIT_ENVIRONMENT_COUNT) % AUDIT_ENVIRONMENT_COUNT

  if (mode === 'full') {
    const perEnvironment = Array.from({ length: AUDIT_ENVIRONMENT_COUNT }, (_, logicalIndex) => {
      const environmentIndex = rotateEnvironment(logicalIndex, normalizedOffset)
      return chunk(allPhases, batch).map((phaseIds, sequence) =>
        makeEntry(mode, environmentIndex, phaseIds, 'deep', 'full-matrix', sequence),
      )
    })
    return interleave(perEnvironment)
  }

  if (mode === 'smoke') {
    const smokeBatch = Math.max(batch, SMOKE_SENTINEL_PHASES.length)
    const perEnvironment = Array.from({ length: AUDIT_ENVIRONMENT_COUNT }, (_, logicalIndex) => {
      const environmentIndex = rotateEnvironment(logicalIndex, normalizedOffset)
      return chunk(SMOKE_SENTINEL_PHASES, smokeBatch).map((phaseIds, sequence) =>
        makeEntry(mode, environmentIndex, phaseIds, 'smoke', 'smoke-matrix', sequence),
      )
    })
    return interleave(perEnvironment)
  }

  // Three full-curriculum environments cover one iPhone, one desktop and one tablet.
  // Remaining environments receive deep sentinel coverage. Entries are interleaved so
  // an interrupted overnight run still touches every device/language/theme early.
  const coreLogicalEnvironments = new Set([0, 4, 5])
  const sentinelSet = new Set<number>(SMART_SENTINEL_PHASES)
  const perEnvironment = Array.from({ length: AUDIT_ENVIRONMENT_COUNT }, (_, logicalIndex) => {
    const environmentIndex = rotateEnvironment(logicalIndex, normalizedOffset)
    const isCore = coreLogicalEnvironments.has(logicalIndex)
    const phases = isCore ? allPhases : [...SMART_SENTINEL_PHASES]
    const reason: AuditPlanEntry['reason'] = isCore ? 'core-curriculum' : 'sentinel-matrix'

    return chunk(phases, batch).map((phaseIds, sequence) => {
      const includesSentinel = phaseIds.some(phaseId => sentinelSet.has(phaseId))
      const depth: AuditDepth = isCore && !includesSentinel ? 'standard' : 'deep'
      return makeEntry(mode, environmentIndex, phaseIds, depth, reason, sequence)
    })
  })

  return interleave(perEnvironment)
}

export function auditPlanSignature(mode: AuditMode, batch: number, environmentOffset: number) {
  return `v1|${mode}|${Math.max(1, batch)}|${environmentOffset % AUDIT_ENVIRONMENT_COUNT}`
}
