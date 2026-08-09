import { Variety_Enum, Workouts } from '@graph/types'

interface IUsePulse {
  pulseInterval: number
  isPulsing: boolean
  handleStartStopPulse: () => void
  counter: number
  restingInterval: number
  isResting: boolean
  isCountingDown: boolean
  countingDownInterval: number
}

export type TUsePulse = (param?: Workouts) => IUsePulse

export { Variety_Enum }
