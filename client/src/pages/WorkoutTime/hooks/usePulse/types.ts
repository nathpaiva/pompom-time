import { Variety_Enum, Workouts } from '@graph/types'

import type { TPhase } from './phaseMath'

interface IUsePulse {
  phase: TPhase
  repIndex: number
  setIndex: number
  countingDownInterval: number
  restingInterval: number
  handleStartStopPulse: () => void
  handleReset: () => void
}

export type TUsePulse = (param?: Workouts) => IUsePulse

export type { TPhase }
export { Variety_Enum }
