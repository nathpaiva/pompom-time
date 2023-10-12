import { Variety_Enum } from './types'

export const PULSE_LIMIT = 20
export const PULSE_INTERVAL_FALLBACK = 500
export const PULSE_INTERVAL_RESTING = 1000

export const intervalByWorkoutType: Record<Variety_Enum, number> = {
  [Variety_Enum.Pulse]: 500,
  [Variety_Enum.Intensity]: 500,
  [Variety_Enum.Resistance]: 500,
  [Variety_Enum.Strength]: 1500,
} as const
