import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

import { query } from './utils/hasura'

const listUserWorkouts: Handler = async (
  _event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const { workouts } = await query({
      query: `
      query Workouts {
        workouts(where: {user_id: {_eq: "${context.clientContext.user.email}"}}) {
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
