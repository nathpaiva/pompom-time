import { IResponseWithError } from './types'

/**
 * Checks at runtime if a response carries a function/GraphQL-level error.
 * Replaces a blind `as T & IResponseWithError` assertion with a real check.
 */
export function hasErrorShape(
  response: unknown,
): response is IResponseWithError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    (response.error === undefined || typeof response.error === 'string')
  )
}
