import { Workouts } from './__generated__/delete-workout-by-id.graphql.generated'

export type TSuccessResponse = Pick<
  Workouts,
  '__typename' | 'created_at' | 'updated_at' | 'id' | 'name'
>

export type PromiseResponseDeleteWorkoutById = Promise<
  HandlerResponse<TSuccessResponse>
>

export type { Workouts as IWorkouts }
