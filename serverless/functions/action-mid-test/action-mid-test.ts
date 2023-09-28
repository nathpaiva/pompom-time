import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'

import { Workouts } from '../add-workout-by-user/__generated__/add-workout-by-user.graphql.generated'
import {
  EnumWorkoutType,
  PromiseResponseAddWorkoutByUserId,
} from '../add-workout-by-user/types'

// This is your common handler, in no way different than what you are used to doing every day in AWS Lambda
const lambdaHandler = async (
  event: HandlerEventJsonParsed<{ name: string; type: string }>,
  { clientContext }: Context,
): PromiseResponseAddWorkoutByUserId => {
  console.log(`"event.body"`, event.body, clientContext)
  // we don't need to deserialize the body ourself as a middleware will be used to do that
  const { name } = event.body

  console.log(
    '🚀 ~ file: action-mid-test.ts:14 ~ lambdaHandler ~ creditCardNumber, expiryMonth, expiryYear, cvc, nameOnCard, amount:',

    name,
    // creditCardNumber,
    // expiryMonth,
    // expiryYear,
    // cvc,
    // nameOnCard,
    // amount,
  )
  // do stuff with this data
  // ...
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 400)
  })

  console.log(`"result"`, result)

  const response = {
    goal_per_day: 5,
    name: 'First Workout',
    repeat: true,
    rest: 40,
    squeeze: 20,
    interval: 10,
    type: EnumWorkoutType.resistance,
    created_at: new Date(),
    id: 'id-123',
    updated_at: new Date(),
    user_id: 'hello@nathpaiva.com.br',
  } satisfies Workouts

  return { statusCode: 200, body: JSON.stringify(response) }
}

// Notice that in the handler you only added base business logic (no deserialization,
// validation or error handler), we will add the rest with middlewares

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
      then: { required: ['interval'] },
      else: {
        properties: {
          type: {
            type: 'string',
            pattern: '(^pulse$)|(^strength$)|(^intensity$)',
          },
          interval: false,
        },
      },
      required: ['name', 'type', 'repeat', 'goal_per_day', 'rest', 'squeeze'],
    },
  },
}

interface ITokenPayload {
  permissions: string[]
}
function isTokenPayload(token: any): token is ITokenPayload {
  console.log('🚀🚀🚀🚀🚀🚀 token:', token)
  return (
    token != null &&
    Array.isArray(token.permissions) &&
    token.permissions.every((permission: any) => typeof permission === 'string')
  )
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
const handler = middy()
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({ eventSchema: transpileSchema(schema) })) // validates the input
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
  .handler(lambdaHandler)

export { handler }
