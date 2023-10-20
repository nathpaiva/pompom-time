import { Variety_Enum, Workouts } from '@graph/types'

export type TWorkoutAnimation = {
  [key in Workouts['variety']]: {
    animation: string
    keyframes: Record<string, unknown>
  }
}

export { Variety_Enum }
