import { Variety_Enum } from '../../../../../../serverless/functions/delete-workout-by-id/__generated__/delete-workout-by-id.graphql.generated'
import { Workouts } from '../../../../../../serverless/functions/delete-workout-by-id/types'

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
