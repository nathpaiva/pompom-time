import { Workouts } from '@graph/types'

export type TSuccessResponse = Pick<
  Workouts,
  '__typename' | 'created_at' | 'updated_at' | 'id' | 'name'
>

export type PromiseResponseDeleteWorkoutById = Promise<
  HandlerResponse<TSuccessResponse>
>

export type { Workouts }
