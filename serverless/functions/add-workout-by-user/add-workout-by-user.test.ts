import { mockContext, toRequestFromBody } from '../../setup-server-tests'
import { DeleteWorkoutByIdMutationVariables } from '../delete-workout-by-id/__generated__/delete-workout-by-id.graphql.generated'
import { handler as _deleteWorkoutById } from '../delete-workout-by-id/delete-workout-by-id'
import {
  AddWorkoutByUserMutationVariables,
  Workouts,
} from './__generated__/add-workout-by-user.graphql.generated'
import { handler as addWorkoutByUser } from './add-workout-by-user'

const workoutsIdToCleanUp: unknown[] = []
const keysToNotValidateWithMock = [
  '__typename',
  'created_at',
  'updated_at',
  'id',
] as (keyof Workouts)[]

describe('add-workout-by-user', () => {
  // afterEach(() => {
  //   vi.resetAllMocks()
  // })

  afterEach(async () => {
    const req = toRequestFromBody<DeleteWorkoutByIdMutationVariables>({
      id: workoutsIdToCleanUp[0],
    })

    const result = await _deleteWorkoutById(
      { ...req, body: req.body },
      mockContext({
        clientContext: {},
      }),
    )

    console.log('db cleaned:', result.statusCode)
  })

  it('should add a new workout', async () => {
    const mockUserContext = {
      user: {
        email: 'test-user@nathpaiva.com',
      },
    }
    const mockWorkoutData = {
      goal_per_day: 5,
      interval: 0,
      name: 'First Workout',
      repeat: true,
      rest: 40,
      squeeze: 20,
      stop_after: 4,
      type: 'pulse',
    } satisfies Omit<AddWorkoutByUserMutationVariables, 'user_id'>

    const req =
      toRequestFromBody<Omit<AddWorkoutByUserMutationVariables, 'user_id'>>(
        mockWorkoutData,
      )

    const { statusCode, body } = await addWorkoutByUser(
      req,
      mockContext(mockUserContext),
    )
    if (statusCode === 500) {
      console.log(body.error)
      expect(false).toBeTruthy()
      return
    }

    const workouts = JSON.parse(body)
    workoutsIdToCleanUp.push(workouts.id)

    Object.keys(workouts).forEach((key) => {
      if (keysToNotValidateWithMock.includes(key)) {
        expect(key).toBeTruthy()
        return
      }

      if (key === 'user_id') {
        expect(mockUserContext.user.email).toEqual(workouts[key])
        return
      }

      expect((mockWorkoutData as Workouts)[key]).toEqual(workouts[key])
    })
  })
})
