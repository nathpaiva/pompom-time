import { useToast } from '@chakra-ui/react'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { useIdentityContext } from 'react-netlify-identity'

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
  const { authedFetch } = useIdentityContext()
  const toast = useToast()

  return useMutation<T, Error, V>({
    mutationFn: async ({ id }) => {
      try {
        const _response = await authedFetch.delete(
          '/.netlify/functions/delete-workout-by-id',
          {
            method: 'DELETE',
            body: JSON.stringify({
              id,
            }),
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
