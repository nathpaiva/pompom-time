import { ClientError } from 'graphql-request'

export const errorResolver = (error: IError | Error | ClientError) => {
  if (error instanceof ClientError && error.response.errors) {
    return error.response.errors[0].message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (!error?.cause || !Array.isArray(error.cause)) {
    return error.message ? error.message : 'Sorry, something is going wrong'
  }

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
