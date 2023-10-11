import {
  AddWorkoutByUserMutationVariables,
  Workouts,
  Variety_Enum,
} from './__generated__/add-workout-by-user.graphql.generated'

interface TAddWorkoutStrengthPulseIntensity {
  variety: Exclude<Variety_Enum, Variety_Enum.Resistance>
  interval?: never
}

interface TAddWorkoutResistance {
  variety: Variety_Enum.Resistance
  interval: number
}

export type TAddWorkoutByUserMutationVariables = Omit<
  AddWorkoutByUserMutationVariables,
  'user_id' | 'variety' | 'stop_after' | 'interval'
> &
  (TAddWorkoutStrengthPulseIntensity | TAddWorkoutResistance)

export type PromiseResponseAddWorkoutByUserId = Promise<
  HandlerResponse<Workouts>
>

export { Variety_Enum }
