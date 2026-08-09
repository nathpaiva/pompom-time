/**
 * Shape returned by the `useQuery`-based data hooks
 * (`useGetWorkoutById`, `useListByUserId`).
 */
export interface IUseListByUserId<T> {
  isLoading: boolean
  error: Error | null
  data?: T
  isError: boolean
  isSuccess: boolean
}

/**
 * A response that may carry a function/GraphQL-level error instead of
 * throwing. Used to type-check `response?.error` without an `as any` cast.
 */
export interface IResponseWithError {
  error?: string
}
