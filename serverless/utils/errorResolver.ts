import { ClientError } from 'graphql-request'

import { ErrorHandler } from './ErrorHandler'

export const errorResolver = (error: ClientError | ErrorHandler | IError) => {
  if (error instanceof ClientError && error.response.errors) {
    return error.response.errors[0].message
  }

  if (error instanceof ErrorHandler) {
    return error.message
  }

  const cause = (error as IError)?.cause
  const causes = Array.isArray(cause)
    ? cause
    : cause && 'data' in cause
      ? cause.data
      : undefined

  if (!causes) {
    return error?.message ? error.message : 'Sorry, something is going wrong'
  }

  let count = 0
  let message = ''
  while (count < causes.length) {
    const _cause = causes[count]
    // check if the message from interval has undefined, if so the entire body is invalid, so the code goes to the next message and show it
    if (_cause.message && !_cause.message.split(' ').includes('undefined')) {
      message = _cause.message
      break
    }

    count++
  }

  return message
}
