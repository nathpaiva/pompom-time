import { ClientError } from 'graphql-request'

function isIErrorType<T>(data: T | IError['cause']): data is IError['cause'] {
  return (
    typeof (data as IError['cause']) === 'string' ||
    Array.isArray(data as IError['cause'])
  )
}

export const errorResolver = (error: IError | Error | ClientError) => {
  if (error.cause && isIErrorType(error.cause) && Array.isArray(error.cause)) {
    const { messages, failingKeyword, missingProperty } = error.cause.reduce(
      (acc, { params, keyword, message, ...cause }) => {
        console.log(`"cause"`, cause, params)

        if (
          keyword === 'errorMessage' &&
          message &&
          !message.split(' ').includes('undefined')
        ) {
          console.log(`"message"`, message)
          acc.messages.push(message)
        }

        if (params.missingProperty) {
          acc.missingProperty.push(params.missingProperty)
        }

        if (params.failingKeyword) {
          acc.failingKeyword.push(params.failingKeyword)
        }
        console.log(`"acc"`, acc)

        return acc
      },
      {
        messages: [],
        failingKeyword: [],
        missingProperty: [],
      } as {
        messages: string[]
        failingKeyword: string[]
        missingProperty: string[]
      },
    )

    console.log(
      '🚀 ~ file: errorResolver.ts:35 ~ errorResolver ~ missingProperty:',
      missingProperty,
      failingKeyword,
      messages,
    )

    if (messages.length) {
      return messages[0]
    }
    // // TODO: are you sure?
    // if (messages.length === 2) {
    //   return messages[1]
    // }

    // if (missingProperty.length > 3) {
    //   return 'You should provide the workout data'
    // }

    // if (missingProperty.length === 1 && missingProperty[0] === 'interval') {
    //   console.log(`veio???`, error)
    // }

    return `You should provide ${missingProperty.join(' ')}`
  }

  const _error = (error as ClientError).response
  let message: string = (error as Error).message

  if (_error?.errors) {
    message = _error.errors[0].message
  }

  return message
}
