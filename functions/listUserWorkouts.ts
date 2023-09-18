import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

import { query } from './utils/hasura'

interface IWorkoutsByUserId {
  response: { workouts: IWorkout[] }
  hasVariables: true
  variables: {
    user_id: string
  }
}

const listUserWorkouts: Handler = async (
  _event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const {
      response: { workouts },
    } = await query<IWorkoutsByUserId>({
      query: `
      query WorkoutsByUserId($user_id: String,) {
        workouts(where: {user_id: {_eq: $user_id}}) {
          created_at
          goal_per_day
          id
          interval
          name
          repeat
          rest
          squeeze
          stop_after
          type
          updated_at
          user_id
        }
      }
      `,
      variables: {
        user_id: context.clientContext.user.email,
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify(workouts),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify((error as Error).message),
    }
  }
}

export { listUserWorkouts as handler }
