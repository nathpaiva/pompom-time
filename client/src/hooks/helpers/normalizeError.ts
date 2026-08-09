/**
 * Turns any caught value into an `Error`.
 *
 * If the caught value is already an `Error`, its message is reused.
 * Otherwise the given fallback message is used.
 *
 * @param error the value caught in a try/catch block
 * @param fallbackMessage message to use when `error` is not an `Error`
 */
export function normalizeError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) {
    return error
  }

  return new Error(fallbackMessage)
}
