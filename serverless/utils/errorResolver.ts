import { ClientError } from 'graphql-request'

function isIErrorType<T>(data: T | IError['cause']): data is IError['cause'] {
  return (
    typeof (data as IError['cause']) === 'string' ||
    Array.isArray(data as IError['cause'])
  )
}

export const errorResolver = (error: IError | Error | ClientError) => {
  if (error.cause && isIErrorType(error.cause) && Array.isArray(error.cause)) {
    const { failingKeyword, missingProperty } = error.cause.reduce(
      (acc, { params, ...cause }) => {
        // console.log(`"cause"`, cause)
        if (params.missingProperty) {
          acc.missingProperty.push(params.missingProperty)
        }

        if (params.failingKeyword) {
          acc.failingKeyword.push(params.failingKeyword)
        }
        // return cause.params.missingProperty
        return acc
      },
      {
        failingKeyword: [],
        missingProperty: [],
      } as {
        failingKeyword: string[]
        missingProperty: string[]
      },
    )

    if (missingProperty.length > 3) {
      return 'You should provide the workout data'
    }

    return `You should provide ${missingProperty.join(' ')}`
  }

  const _error = (error as ClientError).response
  let message: string = (error as Error).message

  if (_error?.errors) {
    message = _error.errors[0].message
  }

  return message
}
