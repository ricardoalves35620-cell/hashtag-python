/**
 * Lightweight progression metadata.
 *
 * Keep this file free of lesson content so authentication and the application
 * shell do not download the complete curriculum before a learner opens it.
 */
export const PHASE_IDS = Array.from({ length: 69 }, (_, id) => id)

export const PROJECT_PHASE_IDS = new Set([4, 7, 12, 27, 39, 53, 60, 64, 68])

export const PROJECT_PHASE_BY_ID: Readonly<Record<string, number>> = {
  'damage-estimate': 4,
  'claim-queue': 7,
  'portfolio-report': 12,
  'foundation-claim-desk': 27,
  'professional-claims-triage': 39,
  'engineering-order-service': 53,
  'data-ml-risk-pipeline': 60,
  'transformer-attention-inspector': 64,
  'local-rag-copilot': 68,
}

export function phaseHasProject(phaseId: number) {
  return PROJECT_PHASE_IDS.has(phaseId)
}
