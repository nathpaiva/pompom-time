import {
  createMockContext,
  createMockHandlerEventBody,
} from '../../setup-server-tests'
import { cleanupDbAfterTest } from '../../utils/cleanupDbAfterTest'
import { Workouts } from './__generated__/add-workout-by-user.graphql.generated'
import {
  Variety_Enum,
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

describe('add-workout-by-user', () => {
  afterEach(async () => {
    if (!workoutsIdToCleanUp.length) return
    const response = await cleanupDbAfterTest(workoutsIdToCleanUp)

    console.log('db cleaned:', response)
  })

  describe('context and event', () => {
    it('should return and error if the use is not authenticated', async () => {
      const _req = createMockHandlerEventBody<
        TAddWorkoutByUserMutationVariables,
        null
      >(
        {
          goal_per_day: 5,
          name: 'First Workout',
          repeat: true,
          rest: 40,
          squeeze: 20,
          interval: 10,
          variety: Variety_Enum.Resistance,
        },
        null,
      )
      const { statusCode, body } = await addWorkoutByUser(
        _req,
        createMockContext(undefined),
      )
      // if the statusCode is 200 the test should break!!!
      if (statusCode === 200 || statusCode === 400) {
        expect(statusCode).toEqual(500)
        return
      }
      expect(statusCode).toEqual(500)
      expect(JSON.parse(body).error).toEqual('You must be authenticated')
    })
    it('should return and error if event is inconsistent', async () => {
      const _invalidRequest = createMockHandlerEventBody<
        TAddWorkoutByUserMutationVariables,
        null
      >({} as TAddWorkoutByUserMutationVariables, null)
      const _context = createMockContext({
        user: {
          email: 'test-user@nathpaiva.com',
          exp: Date.now(),
        },
      })
      const { statusCode, body } = await addWorkoutByUser(
        { ..._invalidRequest, queryStringParameters: {} },
        _context,
      )
      // if the statusCode is 200 the test should break!!!
      if (statusCode === 200 || statusCode === 500) {
        expect(statusCode).toEqual(400)
        return
      }
      expect(statusCode).toEqual(400)
      expect(JSON.parse(body).error).toEqual(
        'You should provide the workout data',
      )
    })
  })

  describe('workout variety: strength | pulse | intensity', () => {
    Object.keys(Variety_Enum).forEach((item) => {
      it(`should add a workout ${item} successfully without interval`, async () => {
        const { globalMockData, expectsSuccessToAddWorkout } =
          expectWorkoutSuccessfully(Variety_Enum[item])
        // should not create workout for this type
        const _copy = { ...globalMockData }
        delete _copy.interval

        if (Variety_Enum[item] === Variety_Enum.Resistance) {
          return
        }

        const _mockWorkoutData = {
          ..._copy,
          variety: Variety_Enum[item],
        } as TAddWorkoutByUserMutationVariables

        await expectsSuccessToAddWorkout(_mockWorkoutData)
      })

      it(`should not add a workout "${item}" if has interval`, async () => {
        const { globalMockData, expectsErrorToAdd } = expectWorkoutSuccessfully(
          Variety_Enum[item],
        )

        // should not create workout for this type
        if (Variety_Enum[item] === Variety_Enum.Resistance) {
          return
        }
        const _mockWorkoutData = {
          ...globalMockData,
          variety: Variety_Enum[item],
        } as TAddWorkoutByUserMutationVariables

        await expectsErrorToAdd(
          _mockWorkoutData,
          `Interval is not valid for "${item}" workout type.`,
        )
      })
    })
  })

  describe('workout variety: resistance', () => {
    it('should add a workout type as resistance and interval is 10', async () => {
      const { globalMockData, expectsSuccessToAddWorkout } =
        expectWorkoutSuccessfully(Variety_Enum.Resistance)

      const _copy = { ...globalMockData }
      const _mockWorkoutData = {
        ..._copy,
        interval: 10,
        variety: Variety_Enum.Resistance,
      } satisfies TAddWorkoutByUserMutationVariables

      await expectsSuccessToAddWorkout(_mockWorkoutData)
    })

    it('should not add a workout if resistance type and interval is undefined', async () => {
      const { globalMockData, expectsErrorToAdd } = expectWorkoutSuccessfully(
        Variety_Enum.Resistance,
      )

      const _copy = { ...globalMockData }
      delete _copy.interval

      const _mockWorkoutData = {
        ..._copy,
        variety: Variety_Enum.Resistance,
      } as TAddWorkoutByUserMutationVariables

      await expectsErrorToAdd(
        _mockWorkoutData,
        'Interval is required for "resistance" workout type.',
      )
    })
  })
})

function expectWorkoutSuccessfully(variety: Variety_Enum) {
  const _mockUserContext = {
    user: {
      email: 'test-user@nathpaiva.com',
      exp: Date.now(),
    },
  }

  const _globalMockData = {
    goal_per_day: 5,
    name: 'First Workout',
    repeat: true,
    rest: 40,
    squeeze: 20,
    interval: 10,
    variety,
  } as unknown as TAddWorkoutByUserMutationVariables

  return {
    globalMockData: _globalMockData,
    expectsSuccessToAddWorkout: async (
      _mockWorkoutData: TAddWorkoutByUserMutationVariables,
    ) => {
      const req = createMockHandlerEventBody<
        TAddWorkoutByUserMutationVariables,
        null
      >(_mockWorkoutData, null)

      const { statusCode, body } = await addWorkoutByUser(
        { ...req, queryStringParameters: {} },
        createMockContext(_mockUserContext),
      )

      // if the statusCode is 500 | 400 the test should break!!!
      if (statusCode === 500 || statusCode === 400) {
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

        if (key === 'interval' && variety !== Variety_Enum.Resistance) {
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
      const req = createMockHandlerEventBody<
        TAddWorkoutByUserMutationVariables,
        null
      >(_mockWorkoutData, null)

      const { statusCode, body } = await addWorkoutByUser(
        { ...req, queryStringParameters: {} },
        createMockContext(_mockUserContext),
      )

      // if the statusCode is 200 the test should break!!!
      if (statusCode === 200) {
        expect(statusCode).toEqual(400)
        return
      }

      expect(statusCode).toEqual(400)
      expect(JSON.parse(body).error).toEqual(errorMessage)
    },
  }
}
