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

export enum EnumWorkoutType {
  strength = 'strength',
  pulse = 'pulse',
  intensity = 'intensity',
  resistance = 'resistance',
}

interface TAddWorkoutSPI {
  type: Exclude<EnumWorkoutType, EnumWorkoutType.resistance>
  interval?: never
}

interface TAddWorkoutR {
  type: EnumWorkoutType.resistance
  interval: number
}

export type TAddWorkoutByUserMutationVariables = Omit<
  AddWorkoutByUserMutationVariables,
  'user_id' | 'type' | 'stop_after' | 'interval'
> &
  (TAddWorkoutSPI | TAddWorkoutR)

type HandlerEvent = Omit<NtlHandlerEvent, 'body'> & {
  body: Stringified<TAddWorkoutByUserMutationVariables>
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
    if (!context.clientContext) {
      throw new Error('You must be authenticated')
    }

    if (!event.body) {
      throw new Error('You should provide the values')
    }

    // TODO: creates different type if the workout type is = `resistance`
    const { name, type, repeat, goal_per_day, interval, rest, squeeze } =
      JSON.parse(event.body)

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
      user_id: context.clientContext.user.email,
      name,
      type,
      repeat,
      interval: 0,
      goal_per_day: +goal_per_day,
      rest: +rest,
      squeeze: +squeeze,
    } satisfies AddWorkoutByUserMutationVariables

    // if resistance the interval must be provided by the user
    if (type === EnumWorkoutType.resistance) {
      variables.interval = +interval
    }

    const data = await request({
      document: AddWorkoutByUserDocument,
      variables,
      ...config,
    })

    if (!data?.insert_workouts?.returning) {
      throw new Error('Could not load data from workout mutation')
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.insert_workouts.returning[0]),
    }
  } catch (error) {
    const _error = (error as ClientError).response
    let message: string = (error as Error).message

    if (_error?.errors) {
      message = _error.errors[0].message
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}

export { addWorkoutByUser as handler }
