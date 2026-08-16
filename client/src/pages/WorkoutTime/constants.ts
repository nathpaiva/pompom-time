import { Variety_Enum } from './types'

export const PULSE_INTERVAL_RESTING = 1000

export const motionDescriptionByVariety: Record<Variety_Enum, string> = {
  [Variety_Enum.Pulse]: 'Quick squeeze and release, light and fast.',
  [Variety_Enum.Intensity]: 'Deep squeeze that gets stronger each rep.',
  [Variety_Enum.Resistance]: 'Hold the squeeze, then let go slow.',
  [Variety_Enum.Strength]: 'Squeeze up and lift, then lower back down.',
} as const
