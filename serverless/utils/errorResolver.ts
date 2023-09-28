import { ClientError } from 'graphql-request'

function isIErrorType<T>(data: T | IError['cause']): data is IError['cause'] {
  return (
    typeof (data as IError['cause']) === 'string' ||
    Array.isArray(data as IError['cause'])
  )
}

export const errorResolver = (error: IError | Error | ClientError) => {
  if (error.cause && isIErrorType(error.cause) && Array.isArray(error.cause)) {
    let count = 0
    let message = ''
    while (count < error.cause.length) {
      const _cause = error.cause[count]
      // check if the message from interval has undefined, if so the entire body is invalid, so the code goes to the next message and show it
      if (_cause.message && !_cause.message.split(' ').includes('undefined')) {
        message = _cause.message
        break
      }

      count++
    }

    return message
  }

  const _error = (error as ClientError).response
  let message: string = (error as Error).message

  if (_error?.errors) {
    message = _error.errors[0].message
  }

  return message
}
