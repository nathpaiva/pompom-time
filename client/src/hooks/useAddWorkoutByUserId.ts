import { useToast } from '@chakra-ui/react'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { IWorkout } from '../pages/Workout/types'
import { useHeadersCommonSetup } from './useHeadersCommonSetup'

export type TAddWorkoutVariable = Partial<
  Omit<IWorkout, 'created_at' | 'updated_at' | 'id' | 'user_id' | 'stop_after'>
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
  const headers = useHeadersCommonSetup()
  const toast = useToast()

  return useMutation<T, Error, V>({
    mutationFn: async (addWorkoutFormData) => {
      try {
        if (!headers) {
          throw new Error('You are not authenticated')
        }

        const _response = await fetch(
          '/.netlify/functions/add-workout-by-user',
          {
            method: 'POST',
            headers,
            body: JSON.stringify(addWorkoutFormData),
          },
        )

        if (_response.status !== 200) {
          throw new Error(`Error: ${_response.statusText}`)
        }

        return _response.json()
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
