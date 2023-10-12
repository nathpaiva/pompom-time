import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'
import { ClientError, request } from 'graphql-request'

import { ErrorHandler, errorResolver, graphQLClientConfig } from '../../utils'
import {
  DeleteWorkoutByIdDocument,
  DeleteWorkoutByIdMutationVariables,
} from './__generated__/delete-workout-by-id.graphql.generated'
import { bodySchema } from './bodySchema'
import type { Workouts, PromiseResponseDeleteWorkoutById } from './types'

const deleteWorkoutById = async (
  { body }: HandlerEventJsonParsed<DeleteWorkoutByIdMutationVariables, unknown>,
  { clientContext }: Context,
): PromiseResponseDeleteWorkoutById => {
  const config = graphQLClientConfig()
  try {
    if (!clientContext?.user || clientContext.user.exp * 1000 < Date.now()) {
      throw new ErrorHandler({
        message: 'You must be authenticated',
        status: 300,
      })
    }

    const { id } = body

    const { delete_workouts } = await request({
      document: DeleteWorkoutByIdDocument,
      variables: {
        id,
      },
      ...config,
    })

    /* c8 ignore next */
    if (!delete_workouts) {
      /* c8 ignore next */
      throw new ErrorHandler({
        message: 'Could not delete the workout',
        status: 400,
      })
      /* c8 ignore next */
    }

    return {
      statusCode: 200,
      body: JSON.stringify(delete_workouts.returning[0]),
    }
  } catch (error) {
    let statusCode: 400 | 500 | 300 = 500

    const message = errorResolver(error as ClientError | ErrorHandler)

    if (error instanceof ErrorHandler) {
      statusCode = error.status
    }

    return {
      statusCode,
      body: JSON.stringify({ error: message }),
    }
  }
}

const configTimeoutByEnvMode =
  /* c8 ignore next */
  process.env.MODE === 'test' ? { timeoutEarlyInMillis: 0 } : undefined

const handler = middy<
  HandlerEvent<DeleteWorkoutByIdMutationVariables, unknown>,
  PromiseResponseDeleteWorkoutById,
  IError
>(deleteWorkoutById, configTimeoutByEnvMode)
  .use([
    jsonBodyParser(),
    validator({ eventSchema: transpileSchema(bodySchema, { verbose: true }) }),
  ])
  .use(httpErrorHandler())
  .onError(({ error }) => {
    if (!error) {
      /* c8 ignore next */
      return {
        /* c8 ignore next */
        statusCode: 400,
        body: JSON.stringify({ error: 'BadRequest!' }),
      }
    }

    const errorMessage = errorResolver(error)

    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ error: errorMessage }),
    }
  })

export {
  handler,
  type PromiseResponseDeleteWorkoutById,
  type DeleteWorkoutByIdMutationVariables as DeleteWorkoutByIdVariables,
  type Workouts,
}
