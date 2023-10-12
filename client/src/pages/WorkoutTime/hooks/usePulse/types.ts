import { Variety_Enum } from '../../types'

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

interface IUsePulseParams {
  interval: number | null
  squeeze?: number
  repeat?: boolean
  rest?: number
  sets?: number
  variety?: Variety_Enum
}

export type TUsePulse = (param: IUsePulseParams) => IUsePulse

export { Variety_Enum }
