export { phase1 } from './phase1'
export { phase2 } from './phase2'
export { phase3, phase4, phase5, phase6, phase7, phase8, phase9, phase10 } from './stubs'

import { phase1 } from './phase1'
import { phase2 } from './phase2'
import { phase3, phase4, phase5, phase6, phase7, phase8, phase9, phase10 } from './stubs'
import type { Phase } from '../types'

export const ALL_PHASES: Phase[] = [
  phase1, phase2, phase3, phase4, phase5,
  phase6, phase7, phase8, phase9, phase10
]
