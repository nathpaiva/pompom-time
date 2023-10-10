import { DeleteWorkoutByIdMutationVariables } from '../functions/delete-workout-by-id/__generated__/delete-workout-by-id.graphql.generated'
import { handler as _deleteWorkoutById } from '../functions/delete-workout-by-id/delete-workout-by-id'
import {
  createMockContext,
  createMockHandlerEventBody,
} from '../setup-server-tests'

export async function cleanupDbAfterTest(workoutsIdToCleanUp: unknown[]) {
  for (const workoutId of workoutsIdToCleanUp) {
    const req = createMockHandlerEventBody<DeleteWorkoutByIdMutationVariables>({
      id: workoutId,
    })

    const result = await _deleteWorkoutById(
      { ...req, body: req.body, queryStringParameters: {} },
      createMockContext({
        user: { email: '', exp: Date.now() },
      }),
    )

    return Promise.resolve(result.statusCode)
  }
}
