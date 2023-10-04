import {
  _hoisted_useIdentityContext,
  act,
  fetchMocker,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { Workout } from '../Workout'
import { mockDataResponse, mockUser } from './mockDataResponse'

describe('Workout', () => {
  const { validUserMocked } = mockUser()
  beforeEach(() => {
    fetchMocker.resetMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('ListWorkouts', () => {
    describe('list', () => {
      it('should render a workout list', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        fetchMocker.mockResponseOnce(JSON.stringify(mockDataResponse))

        render(<Workout />)

        act(() => expect(global.fetch).toHaveBeenCalled())

        await waitFor(() =>
          mockDataResponse.forEach((workout) =>
            expect(screen.getByText(workout.name)).toBeVisible(),
          ),
        )
      })

      it('should render error message if the request return status !== 200', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        fetchMocker.mockRejectedValueOnce('invalid content type')

        render(<Workout />)

        act(() => expect(global.fetch).toHaveBeenCalled())

        await waitFor(() =>
          expect(
            screen.getByText("Sorry we could't load your workouts"),
          ).toBeVisible(),
        )
      })
    })

    describe('delete', () => {
      it('should delete workout successfully', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        fetchMocker.mockResponseOnce(JSON.stringify(mockDataResponse))

        render(<Workout />)

        const _workoutToDelete = mockDataResponse[0]

        act(() => expect(global.fetch).toHaveBeenCalled())

        const deleteWorkoutAction = () =>
          screen.queryByLabelText(`Delete ${_workoutToDelete.name} workout`)

        await waitFor(() => expect(deleteWorkoutAction()).toBeVisible())

        const buttonDeleteAction = screen.getByLabelText(
          `Delete ${_workoutToDelete.name} workout`,
        )

        fireEvent.click(buttonDeleteAction)

        await waitFor(() => {
          expect(
            screen.getByText(
              `Are you sure you want to delete ${_workoutToDelete.name}?`,
            ),
          ).toBeVisible()
          expect(screen.getByText('Delete workout')).toBeVisible()
        })

        fetchMocker.mockResponseOnce(JSON.stringify(_workoutToDelete))

        const buttonDeleteConfirmation = screen.getByText('Delete')
        expect(buttonDeleteConfirmation).toBeVisible()

        fireEvent.click(buttonDeleteConfirmation)

        await waitFor(() => {
          expect(deleteWorkoutAction()).not.toBeVisible()

          expect(
            screen.getByText(`Delete workout: ${_workoutToDelete.name}`),
          ).toBeVisible()
        })
      })

      it('should not delete workout and show error message', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        fetchMocker.mockResponseOnce(JSON.stringify(mockDataResponse))

        render(<Workout />)

        const _workoutToDelete = mockDataResponse[0]

        act(() => expect(global.fetch).toHaveBeenCalled())

        const deleteWorkoutAction = () =>
          screen.queryByLabelText(`Delete ${_workoutToDelete.name} workout`)

        await waitFor(() => expect(deleteWorkoutAction()).toBeVisible())

        const buttonDeleteAction = screen.getByLabelText(
          `Delete ${_workoutToDelete.name} workout`,
        )

        fireEvent.click(buttonDeleteAction)

        await waitFor(() => {
          expect(
            screen.getByText(
              `Are you sure you want to delete ${_workoutToDelete.name}?`,
            ),
          ).toBeVisible()
          expect(screen.getByText('Delete workout')).toBeVisible()
        })

        fetchMocker.mockRejectedValueOnce('invalid content type')

        const buttonDeleteConfirmation = screen.getByText('Delete')
        expect(buttonDeleteConfirmation).toBeVisible()

        fireEvent.click(buttonDeleteConfirmation)

        await waitFor(() => {
          expect(deleteWorkoutAction()).toBeVisible()
          expect(screen.getByText('Error on delete mutation')).toBeVisible()
        })
      })
      it('should open the dialog to delete workout and cancel the action', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        fetchMocker.mockResponseOnce(JSON.stringify(mockDataResponse))

        render(<Workout />)

        const _workoutToDelete = mockDataResponse[0]

        act(() => expect(global.fetch).toHaveBeenCalled())

        const deleteWorkoutAction = () =>
          screen.queryByLabelText(`Delete ${_workoutToDelete.name} workout`)

        await waitFor(() => expect(deleteWorkoutAction()).toBeVisible())

        const buttonDeleteAction = screen.getByLabelText(
          `Delete ${_workoutToDelete.name} workout`,
        )

        fireEvent.click(buttonDeleteAction)

        await waitFor(() => {
          expect(
            screen.getByText(
              `Are you sure you want to delete ${_workoutToDelete.name}?`,
            ),
          ).toBeVisible()
          expect(screen.getByText('Delete workout')).toBeVisible()
        })

        const buttonCancelAction = screen.getByText('Cancel')
        expect(buttonCancelAction).toBeVisible()

        fireEvent.click(buttonCancelAction)

        await waitFor(() => {
          expect(
            screen.queryByText(
              `Are you sure you want to delete ${_workoutToDelete.name}?`,
            ),
          ).toBeFalsy()
          expect(screen.queryByText('Delete workout')).toBeFalsy()
        })
      })
    })
  })
})
