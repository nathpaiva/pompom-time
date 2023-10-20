import { Workouts_Aggregate } from '../../../../serverless/functions/list-workouts-by-user-id/__generated__/list-workouts-by-user-id.graphql.generated'
import { Workouts } from '../../../../serverless/generated/graphql/GraphQLSchema'
import { queryClient } from '../../config'

export function updatesWorkoutList<T extends Workouts | string>(params: T) {
  queryClient.setQueryData<Omit<Workouts_Aggregate, 'aggregate'>>(
    ['list-workouts-by-user-id', null],
    (prevState) => {
      if (typeof params === 'string') {
        return {
          ...prevState,
          nodes:
            prevState?.nodes.filter((workout) => workout.id !== params) ?? [],
        }
      }

      return {
        nodes: [...(prevState?.nodes ?? []), params],
      }
    },
  )
}
