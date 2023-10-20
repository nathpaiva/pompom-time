import { Workouts_Aggregate, Workouts } from '@graph/types'

import { queryClient } from '../../config'

export function updatesWorkoutList<T extends Workouts>(
  param: T,
  param2?: string,
) {
  queryClient.setQueryData<Omit<Workouts_Aggregate, 'aggregate'>>(
    ['list-workouts-by-user-id', param2 ?? null],
    (prevState) => {
      if (typeof param === 'string') {
        const myResult = prevState?.nodes.filter(
          (workout) => workout.id !== param,
        )

        return {
          ...prevState,
          nodes: myResult ?? [],
        }
      }

      return {
        ...prevState,
        nodes: [...(prevState?.nodes ?? []), param],
      }
    },
  )
}
