import {
  Workouts_Aggregate,
  Workouts,
} from '../../../../serverless/generated/graphql/GraphQLSchema'
import { queryClient } from '../../config'

export function updatesWorkoutList<T extends Workouts | string>(param: T) {
  queryClient.setQueryData<Omit<Workouts_Aggregate, 'aggregate'>>(
    ['list-workouts-by-user-id', null],
    (prevState) => {
      if (typeof param === 'string') {
        return {
          ...prevState,
          nodes:
            prevState?.nodes.filter((workout) => workout.id !== param) ?? [],
        }
      }

      return {
        ...prevState,
        nodes: [...(prevState?.nodes ?? []), param],
      }
    },
  )
}
