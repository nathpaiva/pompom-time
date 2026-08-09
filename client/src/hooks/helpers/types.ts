/**
 * Shape returned by the `useQuery`-based data hooks
 * (`useGetWorkoutById`, `useListByUserId`).
 */
export interface IUseListByUserId<T> {
  /** True while the query is loading. */
  isLoading: boolean
  /** The error thrown by the query, or null. */
  error: Error | null
  /** The data returned by the query, once loaded. */
  data?: T
  /** True when the query ended in an error. */
  isError: boolean
  /** True when the query loaded without an error. */
  isSuccess: boolean
}

/**
 * A response that may carry a function/GraphQL-level error instead of
 * throwing. Used to type-check `response?.error` without an `as any` cast.
 */
export interface IResponseWithError {
  error?: string
}
