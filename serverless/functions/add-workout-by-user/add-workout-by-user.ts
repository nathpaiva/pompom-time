import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'
import { ClientError, request } from 'graphql-request'

import { ErrorHandler, errorResolver, graphQLClientConfig } from '../../utils'
import {
  AddWorkoutByUserDocument,
  AddWorkoutByUserMutationVariables,
  Variety_Enum,
} from './__generated__/add-workout-by-user.graphql.generated'
import { bodySchema } from './bodySchema'
import {
  PromiseResponseAddWorkoutByUserId,
  type TAddWorkoutByUserMutationVariables,
} from './types'

const addWorkoutByUser = async (
  { body }: HandlerEventJsonParsed<TAddWorkoutByUserMutationVariables, unknown>,
  { clientContext }: Context,
): PromiseResponseAddWorkoutByUserId => {
  const config = graphQLClientConfig()

  try {
    if (!clientContext?.user || clientContext.user.exp * 1000 < Date.now()) {
      throw new ErrorHandler({
        message: 'You must be authenticated',
        status: 300,
      })
    }

    const { name, variety, repeat, goal_per_day, interval, rest, squeeze } =
      body

    const variables = {
      user_id: clientContext.user.email,
      name,
      variety,
      repeat,
      interval,
      goal_per_day,
      rest,
      squeeze,
    } satisfies AddWorkoutByUserMutationVariables

    const { insert_workouts } = await request({
      document: AddWorkoutByUserDocument,
      variables,
      ...config,
    })

    /* c8 ignore next */
    if (!insert_workouts) {
      /* c8 ignore next */
      throw new ErrorHandler({
        message: 'Could not load data from workout mutation',
        status: 400,
      })
      /* c8 ignore next */
    }

    return {
      statusCode: 200,
      body: JSON.stringify(insert_workouts.returning[0]),
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
  HandlerEvent<TAddWorkoutByUserMutationVariables, unknown>,
  PromiseResponseAddWorkoutByUserId,
  IError
>(addWorkoutByUser, configTimeoutByEnvMode)
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
  Variety_Enum,
  type PromiseResponseAddWorkoutByUserId,
  type TAddWorkoutByUserMutationVariables,
}
