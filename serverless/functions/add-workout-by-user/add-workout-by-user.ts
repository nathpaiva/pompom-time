import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'
import { request } from 'graphql-request'

import { errorResolver, graphQLClientConfig } from '../../utils'
import {
  AddWorkoutByUserDocument,
  AddWorkoutByUserMutationVariables,
} from './__generated__/add-workout-by-user.graphql.generated'
import {
  EnumWorkoutType,
  PromiseResponseAddWorkoutByUserId,
  type TAddWorkoutByUserMutationVariables,
} from './types'

const addWorkoutByUser = async (
  { body }: HandlerEventJsonParsed<TAddWorkoutByUserMutationVariables>,
  { clientContext }: Context,
): PromiseResponseAddWorkoutByUserId => {
  const config = graphQLClientConfig()

  try {
    if (!clientContext?.user) {
      throw new Error('You must be authenticated')
    }

    if (!body) {
      throw new Error('You should provide the workout data')
    }

    const { name, type, repeat, goal_per_day, interval, rest, squeeze } = body

    if (
      type === EnumWorkoutType.resistance &&
      typeof interval === 'undefined'
    ) {
      throw new Error('Interval is required for resistance workout type')
    }

    if (
      type !== EnumWorkoutType.resistance &&
      typeof interval !== 'undefined'
    ) {
      throw new Error(
        `Interval is not valid for ${type as EnumWorkoutType} workout type`,
      )
    }

    const variables = {
      user_id: clientContext.user.email,
      name,
      type,
      repeat,
      interval: 0,
      goal_per_day,
      rest,
      squeeze,
    } satisfies AddWorkoutByUserMutationVariables

    // if resistance the interval must be provided by the user
    if (type === EnumWorkoutType.resistance) {
      variables.interval = +interval
    }

    const { insert_workouts } = await request({
      document: AddWorkoutByUserDocument,
      variables,
      ...config,
    })

    if (!insert_workouts) {
      throw new Error('Could not load data from workout mutation')
    }

    return {
      statusCode: 200,
      body: JSON.stringify(insert_workouts.returning[0]),
    }
  } catch (error) {
    const message = errorResolver(error as Error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}

const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        repeat: { type: 'boolean' },
        name: { type: 'string' },
        goal_per_day: { type: 'integer' },
        rest: { type: 'integer' },
        squeeze: { type: 'integer' },
      },
      if: {
        properties: {
          type: {
            type: 'string',
            pattern: '^resistance$',
          },
          interval: { type: 'integer' },
        },
      },
      then: {
        required: ['interval'],
        errorMessage: 'Interval is required for ${/body/type} workout type.',
      },
      else: {
        properties: {
          type: {
            type: 'string',
            pattern: '(^pulse$)|(^strength$)|(^intensity$)',
          },
          interval: false,
        },
        errorMessage: {
          properties: {
            interval: 'Interval is not valid for ${/body/type} workout type.',
          },
        },
      },
      required: ['name', 'type', 'repeat', 'goal_per_day', 'rest', 'squeeze'],
    },
  },
  errorMessage: {
    _: 'You should provide the workout data',
  },
}

const handler = middy<
  HandlerEvent<TAddWorkoutByUserMutationVariables>,
  PromiseResponseAddWorkoutByUserId,
  IError
  // TODO move the timeout only for test
>(addWorkoutByUser, { timeoutEarlyInMillis: 0 })
  .use([
    jsonBodyParser(),
    validator({ eventSchema: transpileSchema(schema, { verbose: true }) }),
  ])
  .use(httpErrorHandler())
  .onError(({ error, ...rest }) => {
    // console.log(
    //   rest,
    //   `🔴🔴🔴"error"`,
    //   error,
    //   (error as any)?.statusCode,
    //   `🔴🔴🔴"cause"`,
    //   error?.cause,
    //   `🔴🔴🔴"name"`,
    //   error?.name,
    //   `🔴🔴🔴"message"`,
    //   error?.message,
    //   `🔴🔴🔴"stack"`,
    //   error?.stack,
    // )
    // console.log(
    //   '🚀 ~ file: add-workout-by-user.ts:154 ~ .onError ~ error:',
    //   error,
    // )
    if (!error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'BadRequest!' }),
      }
    }
    // error
    const errorMessage = errorResolver(error)
    // console.log(
    //   '🚀 ~ file: add-workout-by-user.ts:141 ~ .onError ~ errorMessage:',
    //   errorMessage,
    // )
    return {
      statusCode: (error as any)?.statusCode ?? 500,
      body: JSON.stringify({ error: errorMessage }),
    }
  })

export {
  handler,
  EnumWorkoutType,
  type PromiseResponseAddWorkoutByUserId,
  type TAddWorkoutByUserMutationVariables,
}
