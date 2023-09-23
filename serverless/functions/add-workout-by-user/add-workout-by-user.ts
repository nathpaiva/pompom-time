import type {
  HandlerEvent as NtlHandlerEvent,
  HandlerContext,
  HandlerResponse as NtlHandlerResponse,
} from '@netlify/functions'
import { ClientError, request } from 'graphql-request'

import { graphQLClientConfig } from '../../utils/graphqlClient'
import {
  AddWorkoutByUserDocument,
  AddWorkoutByUserMutationVariables,
  Workouts,
} from './__generated__/add-workout-by-user.graphql.generated'

type HandlerEvent = Omit<NtlHandlerEvent, 'body'> & {
  body: Stringified<Omit<AddWorkoutByUserMutationVariables, 'user_id'>>
}

type THandlerResponse = Omit<NtlHandlerResponse, 'body'> &
  (
    | {
        statusCode: 200
        body: Stringified<Workouts>
      }
    | {
        statusCode: 500
        body: Stringified<{ error: string }>
      }
  )

const addWorkoutByUser = async (
  event: HandlerEvent,
  context: HandlerContext,
): Promise<THandlerResponse> => {
  const config = graphQLClientConfig()

  try {
    if (!event.body) {
      throw new Error('You should provide the values')
    }

    const {
      name,
      type,
      repeat,
      goal_per_day,
      interval,
      rest,
      squeeze,
      stop_after,
    } = JSON.parse(event.body)

    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const variables = {
      user_id: context.clientContext.user.email,
      name,
      type,
      repeat,
      goal_per_day: +goal_per_day,
      interval: type === 'resistance' ? +interval : 0,
      rest: +rest,
      squeeze: +squeeze,
      stop_after: type === 'resistance' ? +stop_after : 0,
    } satisfies AddWorkoutByUserMutationVariables
    console.log('variables', variables)
    const data = await request({
      document: AddWorkoutByUserDocument,
      variables,
      ...config,
    })

    if (!data) {
      throw new Error('Could not load data from workout mutation')
    }
    const { insert_workouts } = data

    return {
      statusCode: 200,
      body: JSON.stringify(insert_workouts?.returning[0]),
    }
  } catch (error) {
    const _error = (error as ClientError).response
    let message: string = (error as Error).message

    if (_error.errors) {
      message = _error.errors[0].message
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}

export { addWorkoutByUser as handler }
