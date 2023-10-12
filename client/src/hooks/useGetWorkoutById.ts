import { useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { useNavigate, useParams } from 'react-router-dom'

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
export function useGetWorkoutById<T>(): IUseListByUserId<T> {
  const navigate = useNavigate()
  const { workout_id } = useParams()
  const { authedFetch, user, getFreshJWT } = useIdentityContext()
  const toast = useToast()

  const { isLoading, error, data, isError, isSuccess } = useQuery<
    T,
    Error,
    T,
    (string | undefined)[]
  >({
    queryKey: ['get-workouts-by-id', workout_id],
    enabled: !!workout_id,
    queryFn: async () => {
      try {
        if (!user?.token.expires_at) {
          throw new Error('You are not authenticated')
        }

        if (user.token.expires_at < Date.now()) {
          await getFreshJWT()
        }

        const response = (await authedFetch.get(
          `/.netlify/functions/get-workouts-by-id?workout_id=${workout_id}`,
        )) as T

        if ((response as any)?.error) {
          throw new Error((response as any).error)
        }

        if (Array.isArray(response)) {
          return response[0]
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
    if (isError && error?.message === 'Workout not found.') {
      navigate('/admin/workout')
      return
    }
    if (isError && error?.message) {
      toast({
        status: 'error',
        title: error.message,
      })
    }
  }, [isError, error?.message, toast, navigate])

  return {
    isLoading,
    error,
    data,
    isError,
    isSuccess,
  }
}
