import { WorkoutsByUserIdQuery } from './__generated__/list-workouts-by-user-id.graphql.generated'

export type PromiseResponseListWorkoutsByUserId = Promise<
  HandlerResponse<WorkoutsByUserIdQuery['workouts_aggregate']>
  // HandlerResponse<Partial<Workouts_Aggregate>>
>
