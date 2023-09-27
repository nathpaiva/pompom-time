import {
  AddWorkoutByUserMutationVariables,
  Workouts,
} from './__generated__/add-workout-by-user.graphql.generated'

export enum EnumWorkoutType {
  strength = 'strength',
  pulse = 'pulse',
  intensity = 'intensity',
  resistance = 'resistance',
}

interface TAddWorkoutStrengthPulseIntensity {
  type: Exclude<EnumWorkoutType, EnumWorkoutType.resistance>
  interval?: never
}

interface TAddWorkoutResistance {
  type: EnumWorkoutType.resistance
  interval: number
}

export type TAddWorkoutByUserMutationVariables = Omit<
  AddWorkoutByUserMutationVariables,
  'user_id' | 'type' | 'stop_after' | 'interval'
> &
  (TAddWorkoutStrengthPulseIntensity | TAddWorkoutResistance)

export type PromiseResponseAddWorkoutByUserId = Promise<
  HandlerResponse<Workouts>
>
