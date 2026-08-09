import { useToast } from '@chakra-ui/react'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { useIdentityContext } from 'react-netlify-identity'

import { assertNoErrorShape, normalizeError, toastOnError } from './helpers'

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

        return assertNoErrorShape<T>(_response)
      } catch (error) {
        return Promise.reject(normalizeError(error, 'Error on delete mutation'))
      }
    },
    onSettled,
    onSuccess,
    onError(error) {
      toastOnError(toast, normalizeError(error, 'Error on delete mutation'))
    },
  })
}
