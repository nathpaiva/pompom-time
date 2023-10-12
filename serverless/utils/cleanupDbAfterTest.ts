import { DeleteWorkoutByIdMutationVariables } from '../functions/delete-workout-by-id/__generated__/delete-workout-by-id.graphql.generated'
import { handler as _deleteWorkoutById } from '../functions/delete-workout-by-id/delete-workout-by-id'
import {
  createMockContext,
  createMockHandlerEventBody,
} from '../setup-server-tests'

export async function cleanupDbAfterTest(workoutsIdToCleanUp: string[]) {
  const workoutIdDeletedSuccessfully: string[] = []
  const workoutIdNotDeleted: string[] = []

  for (const workoutId of workoutsIdToCleanUp) {
    const req = createMockHandlerEventBody<
      DeleteWorkoutByIdMutationVariables,
      null
    >(
      {
        id: workoutId,
      },
      null,
    )

    const result = await _deleteWorkoutById(
      { ...req, body: req.body, queryStringParameters: {} },
      createMockContext({
        user: { email: '', exp: Date.now() },
      }),
    )

    await new Promise((resolve, reject) => {
      if (result.statusCode === 200) {
        workoutIdDeletedSuccessfully.push(workoutId)
        return resolve({ statusCode: result.statusCode, body: workoutId })
      }

      workoutIdNotDeleted.push(workoutId)
      return reject({ statusCode: result.statusCode, body: workoutId })
    })
  }

  return await new Promise((resolve) => {
    return resolve({
      statusCode: 200,
      body: {
        listForDeletion: workoutsIdToCleanUp,
        error: workoutIdNotDeleted,
        success: workoutIdDeletedSuccessfully,
      },
    })
  })
}
