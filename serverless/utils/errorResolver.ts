import { ClientError } from 'graphql-request'

export const errorResolver = (error: ClientError | Error) => {
  const _error = (error as ClientError).response
  let message: string = (error as Error).message

  if (_error?.errors) {
    message = _error.errors[0].message
  }

  return message
}
