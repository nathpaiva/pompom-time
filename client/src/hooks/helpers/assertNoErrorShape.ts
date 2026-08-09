import { hasErrorShape } from './hasErrorShape'

/**
 * Throws if `response` carries a function/GraphQL-level error, otherwise
 * returns it typed as `T`. Centralizes the check-throw-cast sequence that
 * was repeated across every data hook.
 */
export function assertNoErrorShape<T>(response: unknown): T {
  if (hasErrorShape(response) && response.error) {
    const message =
      typeof response.error === 'string'
        ? response.error
        : 'Unexpected error response'

    throw new Error(message)
  }

  return response as T
}
