import { useToast } from '@chakra-ui/react'
import { Workouts } from '@graph/types'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { useIdentityContext } from 'react-netlify-identity'

import { assertNoErrorShape, normalizeError, toastOnError } from './helpers'

export type TAddWorkoutVariable = Partial<
  Omit<Workouts, 'created_at' | 'updated_at' | 'id' | 'user_id' | 'stop_after'>
>

/**
 *
 * @param param0 { access_token: string, onSuccess: '@tanstack/react-query', onSettled: '@tanstack/react-query' }
 * @returns
 */
export function useAddWorkoutByUserId<T, V extends TAddWorkoutVariable>({
  onSuccess,
  onSettled,
}: {
  onSuccess?: UseMutationOptions<T, Error, V>['onSuccess']
  onSettled?: UseMutationOptions<T, Error, V>['onSettled']
}) {
  const { authedFetch } = useIdentityContext()

  const toast = useToast()

  return useMutation<T, Error, V>({
    mutationFn: async (addWorkoutFormData) => {
      try {
        const _response = await authedFetch.post(
          '/.netlify/functions/add-workout-by-user',
          {
            method: 'POST',
            body: JSON.stringify(addWorkoutFormData),
          },
        )

        return assertNoErrorShape<T>(_response)
      } catch (error) {
        return Promise.reject(normalizeError(error, 'Error on add workout'))
      }
    },
    onSettled,
    onSuccess,
    onError(error) {
      toastOnError(toast, normalizeError(error, 'Error on add workout'))
    },
  })
}
