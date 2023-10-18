import { useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useIdentityContext } from 'react-netlify-identity'

interface IUseListByUserId<T> {
  isLoading: boolean
  error: Error | null
  data?: T
  isError: boolean
  isSuccess: boolean
}

/**
 *
 * @param initialWorkoutData  initial of T[]
 * @param callback  function to update the T[]
 * @param access_token  string with access token
 * @returns
 *  isLoading: boolean, error: Error | null, data: T[], isError: boolean, isSuccess: boolean
 * }
 */
export function useListByUserId<T>(workout_name?: string): IUseListByUserId<T> {
  const { authedFetch, user, getFreshJWT } = useIdentityContext()
  const toast = useToast()

  const { isLoading, error, data, isError, isSuccess } = useQuery<
    T,
    Error,
    T,
    (string | undefined)[]
  >({
    queryKey: ['list-workouts-by-user-id', workout_name],
    queryFn: async ({ queryKey }) => {
      const [_, param] = queryKey
      const searchBy = param ? `?workout_name=${param}` : ''

      try {
        if (!user?.token.expires_at) {
          throw new Error('You are not authenticated')
        }

        if (user.token.expires_at < Date.now()) {
          await getFreshJWT()
        }

        const response = (await authedFetch.get(
          `/.netlify/functions/list-workouts-by-user-id${searchBy}`,
        )) as T

        if ((response as any)?.error) {
          throw new Error((response as any).error)
        }

        return response
      } catch (error) {
        let message = 'Error on request'

        if (error instanceof Error) {
          message = error.message
        }

        return Promise.reject(new Error(message))
      }
    },
  })

  useEffect(() => {
    if (isError && error?.message) {
      toast({
        status: 'error',
        title: error.message,
      })
    }
  }, [isError, error?.message, toast])

  return {
    isLoading,
    error,
    data,
    isError,
    isSuccess,
  }
}
