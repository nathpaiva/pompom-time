import { useToast } from '@chakra-ui/react'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { useHeadersCommonSetup } from './useHeadersCommonSetup'

/**
 *
 * @param param0 { access_token: string, onSuccess: '@tanstack/react-query', onSettled: '@tanstack/react-query' }
 * @returns
 */
export function useDeleteWorkoutById<T, V extends { id: string }>({
  onSuccess,
  onSettled,
}: {
  onSuccess?: UseMutationOptions<T, Error, V>['onSuccess']
  onSettled?: UseMutationOptions<T, Error, V>['onSettled']
}) {
  const headers = useHeadersCommonSetup()
  const toast = useToast()

  return useMutation<T, Error, V>({
    mutationFn: async ({ id }) => {
      try {
        if (!headers) {
          throw new Error('You are not authenticated')
        }

        const _response = await fetch(
          '/.netlify/functions/delete-workout-by-id',
          {
            method: 'DELETE',
            headers,
            body: JSON.stringify({
              id,
            }),
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
      let message = 'Error on delete mutation'

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
