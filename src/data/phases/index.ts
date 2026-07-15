import type { Phase } from '../types'
import { phase0 } from './phase0'
import { phase1 } from './phase1'
import { phase2, phase3, phase4, phase5, phase6, phase7, phase8 } from './phases_2_to_8'
import { phase9, phase10, phase11, phase12 } from './phases_9_to_12_v11'
import { phase13, phase14, phase15, phase16 } from './phases_13_to_16_v11'
import {
  phase17, phase18, phase19, phase20,
  phase21, phase22, phase23,
  phase24, phase25, phase26, phase27
} from './phases_9_to_27_stubs'
import { PROFESSIONAL_PHASES } from './professional_28_to_39'
import { ADVANCED_ENGINEERING_PHASES } from './advanced_40_to_53'
import { AI_LOCAL_PHASES } from './ai_54_to_68'
import { applyFoundationHardening } from '../foundationHardening'

applyFoundationHardening([
  phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8,
  phase9, phase10, phase11, phase12, phase13, phase14, phase15, phase16,
  phase17, phase18, phase19, phase20, phase21, phase22, phase23,
  phase24, phase25, phase26, phase27,
])

export const ALL_PHASES: Phase[] = [
  phase0,
  phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8,
  phase9, phase10, phase11, phase12,
  phase13, phase14, phase15, phase16,
  phase17, phase18, phase19, phase20,
  phase21, phase22, phase23,
  phase24, phase25, phase26, phase27,
  ...PROFESSIONAL_PHASES,
  ...ADVANCED_ENGINEERING_PHASES,
  ...AI_LOCAL_PHASES
]

export {
  phase0,
  phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8,
  phase9, phase10, phase11, phase12,
  phase13, phase14, phase15, phase16,
  phase17, phase18, phase19, phase20,
  phase21, phase22, phase23,
  phase24, phase25, phase26, phase27,
  PROFESSIONAL_PHASES,
  ADVANCED_ENGINEERING_PHASES,
  AI_LOCAL_PHASES
}
