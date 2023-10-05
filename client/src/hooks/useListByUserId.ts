import { useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, useEffect } from 'react'

import { useHeadersCommonSetup } from './useHeadersCommonSetup'

interface IUseListByUserId<T> {
  isLoading: boolean
  error: Error | null
  data?: T[]
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
export function useListByUserId<T>(
  callback: Dispatch<React.SetStateAction<T[]>>,
): IUseListByUserId<T> {
  const headers = useHeadersCommonSetup()
  const toast = useToast()
  const { isLoading, error, data, isError, isSuccess } = useQuery<
    T[],
    Error,
    T[],
    (string | undefined)[]
  >({
    enabled: !!headers,
    queryKey: ['list-workouts-by-user-id'],
    queryFn: async () => {
      try {
        if (!headers) {
          throw new Error('You are not authenticated')
        }

        const _response = await fetch(
          '/.netlify/functions/list-workouts-by-user-id',
          { headers },
        )

        if (_response.status !== 200) {
          throw new Error(`Error: ${_response.statusText}`)
        }

        return _response.json()
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
    if (isSuccess && !isLoading) {
      callback(data)
    }
  }, [isSuccess, isLoading, data, callback])

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
