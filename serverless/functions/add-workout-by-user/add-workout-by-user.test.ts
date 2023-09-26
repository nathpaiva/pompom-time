import { mockContext, toRequestFromBody } from '../../setup-server-tests'
import { DeleteWorkoutByIdMutationVariables } from '../delete-workout-by-id/__generated__/delete-workout-by-id.graphql.generated'
import { handler as _deleteWorkoutById } from '../delete-workout-by-id/delete-workout-by-id'
import { Workouts } from './__generated__/add-workout-by-user.graphql.generated'
import {
  EnumWorkoutType,
  TAddWorkoutByUserMutationVariables,
  handler as addWorkoutByUser,
} from './add-workout-by-user'

const workoutsIdToCleanUp: unknown[] = []
const keysToNotValidateWithMock = [
  '__typename',
  'created_at',
  'updated_at',
  'id',
] as (keyof Workouts)[]

const expectWorkoutSuccessfully = (type: EnumWorkoutType) => {
  const _mockUserContext = {
    user: {
      email: 'test-user@nathpaiva.com',
    },
  }

  const _globalMockData = {
    goal_per_day: 5,
    name: 'First Workout',
    repeat: true,
    rest: 40,
    squeeze: 20,
    interval: 10,
    type,
  } as unknown as TAddWorkoutByUserMutationVariables

  return {
    globalMockData: _globalMockData,
    mockUserContext: _mockUserContext,
    expectsSuccessToAddWorkout: async (
      _mockWorkoutData: TAddWorkoutByUserMutationVariables,
    ) => {
      const req =
        toRequestFromBody<TAddWorkoutByUserMutationVariables>(_mockWorkoutData)

      const { statusCode, body } = await addWorkoutByUser(
        req,
        mockContext(_mockUserContext),
      )

      // if the statusCode is 500 the test should break!!!
      if (statusCode === 500) {
        expect(statusCode).toEqual(200)
        return
      }

      const workout = JSON.parse(body)
      workoutsIdToCleanUp.push(workout.id)

      Object.keys(workout).forEach((key) => {
        if (keysToNotValidateWithMock.includes(key)) {
          expect(key).toBeTruthy()
          return
        }

        if (key === 'user_id') {
          expect(_mockUserContext.user.email).toEqual(workout[key])
          return
        }

        if (key === 'interval' && type !== EnumWorkoutType.resistance) {
          expect(typeof (_mockWorkoutData as Workouts)[key]).toEqual(
            'undefined',
          )
          expect(0).toEqual(workout[key])
          return
        }

        expect((_mockWorkoutData as Workouts)[key]).toEqual(workout[key])
      })
    },
    expectsErrorToAdd: async (
      _mockWorkoutData: TAddWorkoutByUserMutationVariables,
      errorMessage: string,
    ) => {
      const req =
        toRequestFromBody<TAddWorkoutByUserMutationVariables>(_mockWorkoutData)

      const { statusCode, body } = await addWorkoutByUser(
        req,
        mockContext(_globalMockData),
      )

      // if the statusCode is 200 the test should break!!!
      if (statusCode === 200) {
        expect(statusCode).toEqual(500)
        return
      }

      expect(statusCode).toEqual(500)
      expect(JSON.parse(body).error).toEqual(errorMessage)
    },
  }
}

describe('add-workout-by-user', () => {
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

  describe('workout type: strength | pulse | intensity', () => {
    Object.keys(EnumWorkoutType).forEach((item) => {
      it(`should add a workout ${item} successfully without interval`, async () => {
        const { globalMockData, expectsSuccessToAddWorkout } =
          expectWorkoutSuccessfully(EnumWorkoutType[item])
        // should not create workout for this type
        const _copy = { ...globalMockData }
        delete _copy.interval

        if (item === 'resistance') {
          return
        }

        const _mockWorkoutData = {
          ..._copy,
          type: EnumWorkoutType[item],
        } as TAddWorkoutByUserMutationVariables

        await expectsSuccessToAddWorkout(_mockWorkoutData)
      })

      Object.keys(EnumWorkoutType).forEach((item) => {
        it(`should not add a workout ${item} if interval is in the body`, async () => {
          const { globalMockData, expectsErrorToAdd } =
            expectWorkoutSuccessfully(EnumWorkoutType[item])

          // should not create workout for this type
          if (item === 'resistance') {
            return
          }
          const _mockWorkoutData = {
            ...globalMockData,
            type: EnumWorkoutType[item],
          } as TAddWorkoutByUserMutationVariables

          await expectsErrorToAdd(
            _mockWorkoutData,
            `Interval is not valid for ${item} workout type`,
          )
        })
      })
    })
  })

  describe('workout type: resistance', () => {
    it('should add a workout type as resistance and interval is 10', async () => {
      const { globalMockData, expectsSuccessToAddWorkout } =
        expectWorkoutSuccessfully(EnumWorkoutType.resistance)
      const _mockWorkoutData = {
        ...globalMockData,
        interval: 10,
        type: EnumWorkoutType.resistance,
      } satisfies TAddWorkoutByUserMutationVariables

      await expectsSuccessToAddWorkout(_mockWorkoutData)
    })

    it('should not add a workout if type is resistance and interval is undefined', async () => {
      const { globalMockData, expectsErrorToAdd } = expectWorkoutSuccessfully(
        EnumWorkoutType.resistance,
      )

      delete globalMockData.interval

      const _mockWorkoutData = {
        ...globalMockData,
        type: EnumWorkoutType.resistance,
      } as TAddWorkoutByUserMutationVariables

      await expectsErrorToAdd(
        _mockWorkoutData,
        'Interval is required for resistance workout type',
      )
    })
  })
})
