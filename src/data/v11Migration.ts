/**
 * Explicit migration state. A phase is added only after the corresponding
 * quality gate is enforceable without legacy exceptions.
 */
export const V11_GRADING_MIGRATED_PHASES = Object.freeze(
  Array.from({ length: 41 }, (_, index) => index + 28),
)

export const V11_FULL_CURRICULUM_MIGRATED_PHASES = Object.freeze([] as number[])

export function isV11GradingMigrated(phaseId: number) {
  return V11_GRADING_MIGRATED_PHASES.includes(phaseId)
}
