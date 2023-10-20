import { useToast } from '@chakra-ui/react'
import { Workouts } from '@graph/types'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { useIdentityContext } from 'react-netlify-identity'

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

        if (_response?.error) {
          throw new Error(_response.error)
        }

        return _response
      } catch (error) {
        let message = 'Error on delete mutation'

        if (error instanceof Error) {
          message = error.message
        }

        return Promise.reject(new Error(message))
      }
    },
    onSettled,
    onSuccess,
    onError(error) {
      let message = 'Error on add workout'

      if (error instanceof Error) {
        message = error.message
      }

      toast({
        status: 'error',
        title: message,
      })
    },
  })
}
