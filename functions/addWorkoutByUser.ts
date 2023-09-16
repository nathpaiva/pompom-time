import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

import { query } from './utils/hasura'

interface IWorkout {
  user_id: string
  name: string
  type: string
  repeat: boolean
  goal_per_day: number
  interval: number
  rest: number
  squeeze: number
  stop_after: number
}

const listUserWorkouts: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
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
    } = JSON.parse(event.body) as IWorkout
    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const variables = {
      user_id: context.clientContext.user.email,
      name,
      type,
      repeat,
      goal_per_day: +goal_per_day,
      interval: +interval,
      rest: +rest,
      squeeze: +squeeze,
      stop_after: +stop_after,
    } satisfies IWorkout
    console.log('nem vem', {
      variables,
    })

    const {
      insert_workouts: { returning },
    } = await query({
      query: `
      mutation InsertWorkouts(
        $user_id: String,
        $name: String,
        $type: String,
        $interval: numeric,
        $repeat: Boolean,
        $goal_per_day: numeric,
        $stop_after: numeric,
        $rest: numeric,
        $squeeze: numeric
      ) {
        insert_workouts(objects: {user_id: $user_id, name: $name, type: $type, interval: $interval, repeat: $repeat, goal_per_day: $goal_per_day, stop_after: $stop_after, rest: $rest, squeeze: $squeeze}) {
          affected_rows
          returning {
            user_id
            created_at
            updated_at
            id
            name
            type
            interval
            repeat
            goal_per_day
            stop_after
            rest
            squeeze
          }
        }
      }
      `,
      variables,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(returning[0]),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify((error as Error).message),
    }
  }
}

export { listUserWorkouts as handler }
