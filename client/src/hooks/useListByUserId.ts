import { useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Dispatch } from 'react'

import { headersCommonSetup } from '../utils'

export function useListByUserId<T>(
  initialWorkoutData: T[],
  callback: Dispatch<React.SetStateAction<T[]>>,
  access_token?: string,
) {
  const toast = useToast()
  const { isLoading, error, data } = useQuery<
    T[],
    Error,
    T[],
    (string | undefined)[]
  >({
    enabled: !!access_token,
    queryKey: ['list-workouts-by-user-id', access_token],
    queryFn: async ({ queryKey }) => {
      try {
        const _token = queryKey[1]
        if (!_token) {
          throw new Error('You are not authenticated')
        }

        const _response = await fetch(
          '/.netlify/functions/list-workouts-by-user-id',
          headersCommonSetup(_token),
        )

        if (_response.status !== 200) {
          throw new Error(`Error: ${_response.statusText}`)
        }

        return _response.json()
      } catch (error) {
        throw new Error((error as Error).message)
      }
    },
    initialData: initialWorkoutData,
    onSuccess(data) {
      callback(data)
    },
    onError(error) {
      toast({
        status: 'error',
        title: error.message,
      })
    },
  })

  return {
    isLoading,
    error,
    data,
  }
}
