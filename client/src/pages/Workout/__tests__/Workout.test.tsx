import {
  _hoisted_useIdentityContext,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { Workout } from '../Workout'
import {
  mockDataResponse,
  mockUser,
  newMockDataResponse,
} from './mockDataResponse'

describe('Workout', () => {
  const { validUserMocked } = mockUser()

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('ListWorkouts', () => {
    describe('list', () => {
      it('should render a workout list', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        validUserMocked.authedFetch.get.mockResolvedValue(newMockDataResponse)

        render(<Workout />)

        act(() => expect(validUserMocked.authedFetch.get).toHaveBeenCalled())

        expect(true).toBeTruthy()
        await waitFor(() =>
          mockDataResponse.forEach((workout) =>
            expect(screen.getByText(workout.name)).toBeVisible(),
          ),
        )
      })

      it('should filter the list by workout name when searching', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        validUserMocked.authedFetch.get.mockResolvedValue(newMockDataResponse)

        render(<Workout />)

        await waitFor(() =>
          mockDataResponse.forEach((workout) =>
            expect(screen.getByText(workout.name)).toBeVisible(),
          ),
        )

        const _workoutToSearch = mockDataResponse[0]

        validUserMocked.authedFetch.get.mockResolvedValue({
          nodes: [_workoutToSearch],
        })

        const searchInput = screen.getByPlaceholderText('Search workout')
        fireEvent.change(searchInput, {
          target: { value: _workoutToSearch.name },
        })

        await waitFor(() =>
          expect(validUserMocked.authedFetch.get).toHaveBeenLastCalledWith(
            expect.stringContaining(`workout_name=${_workoutToSearch.name}`),
          ),
        )
      })

      it('should render error message if the request return status !== 200', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        validUserMocked.authedFetch.get.mockRejectedValueOnce(
          'invalid content type',
        )

        render(<Workout />)

        act(() => expect(validUserMocked.authedFetch.get).toHaveBeenCalled())

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

        validUserMocked.authedFetch.get.mockResolvedValue(newMockDataResponse)

        render(<Workout />)

        const _workoutToDelete = mockDataResponse[0]

        act(() => expect(validUserMocked.authedFetch.get).toHaveBeenCalled())

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

        validUserMocked.authedFetch.delete.mockResolvedValue(_workoutToDelete)

        const buttonDeleteConfirmation = screen.getByText('Delete')
        expect(buttonDeleteConfirmation).toBeVisible()

        fireEvent.click(buttonDeleteConfirmation)

        await waitFor(() => {
          expect(deleteWorkoutAction()).not.toBeInTheDocument()

          expect(
            screen.getByText(`Delete workout: ${_workoutToDelete.name}`),
          ).toBeVisible()
        })
      })

      it('should not delete workout and show error message', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        validUserMocked.authedFetch.get.mockResolvedValue(newMockDataResponse)

        render(<Workout />)

        const _workoutToDelete = mockDataResponse[0]

        act(() => expect(validUserMocked.authedFetch.get).toHaveBeenCalled())

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

        validUserMocked.authedFetch.delete.mockRejectedValue(
          'invalid content type',
        )

        const buttonDeleteConfirmation = screen.getByText('Delete')
        expect(buttonDeleteConfirmation).toBeVisible()

        fireEvent.click(buttonDeleteConfirmation)

        await waitFor(() => {
          expect(deleteWorkoutAction()).toBeVisible()
          expect(screen.getByText('Error on delete mutation')).toBeVisible()
        })
      })

      it('should open the dialog to delete an workout and cancel the action', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        validUserMocked.authedFetch.get.mockResolvedValue(newMockDataResponse)

        render(<Workout />)

        const _workoutToDelete = mockDataResponse[0]

        act(() => expect(validUserMocked.authedFetch.get).toHaveBeenCalled())

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

      it('should open the dialog to delete an workout and close the modal', async () => {
        vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

        validUserMocked.authedFetch.get.mockResolvedValue(newMockDataResponse)

        render(<Workout />)

        const _workoutToDelete = mockDataResponse[0]

        act(() => expect(validUserMocked.authedFetch.get).toHaveBeenCalled())

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

        fireEvent.keyDown(
          screen.getByText(
            `Are you sure you want to delete ${_workoutToDelete.name}?`,
          ),
          {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            charCode: 27,
          },
        )

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
