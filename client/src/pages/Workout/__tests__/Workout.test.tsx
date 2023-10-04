import {
  _hoisted_useIdentityContext,
  act,
  fetchMocker,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { workoutType } from '../constants'
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

      it('should open the dialog to delete an workout and cancel the action', async () => {
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

      it('should open the dialog to delete an workout and close the modal', async () => {
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

  describe('AddWorkout', () => {
    // console.log(workoutType)
    it('should add a new workout successfully', async () => {
      const addNewWorkoutMock = {
        name: 'New Workout',
        squeeze: 10,
        type: workoutType.pulse,
        goal_per_day: 4,
        rest: 45,
        repeat: true,
      }
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

      render(<Workout />)

      // find form and button action
      const submitButton = screen.getByText('Add new workout')
      expect(screen.getByText('Create a new workout:')).toBeVisible()
      expect(submitButton).toBeVisible()

      // get each field and test each one
      const fieldName = screen.getByLabelText('Name')
      const fieldSqueeze = screen.getByLabelText('Squeeze')
      const fieldType = screen.getByLabelText('Workout type')
      const fieldInterval = screen.getByLabelText('hold up to')
      const fieldGolPerDay = screen.getByLabelText('# of Sets')
      const fieldRest = screen.getByLabelText('Rest')
      const fieldRepeat = screen.getByLabelText('Start next set automatically')

      // Test each field with default values
      expect(fieldName).toHaveValue('')
      expect(fieldSqueeze).toHaveValue(null)
      expect(fieldType).toHaveValue('')
      // should not render interval if the type is not resistance
      expect(fieldInterval).toHaveValue(null)
      expect(fieldInterval).not.toBeVisible()
      // END
      expect(fieldGolPerDay).toHaveValue(null)
      expect(fieldRest).toHaveValue(null)
      expect(fieldRepeat).not.toBeChecked()

      // update each filed with addNewWorkoutMock
      act(() => {
        fireEvent.change(fieldName, {
          target: { value: addNewWorkoutMock.name },
        })
        fireEvent.change(fieldSqueeze, {
          target: { value: addNewWorkoutMock.squeeze },
        })
        fireEvent.change(fieldType, {
          target: { value: addNewWorkoutMock.type },
        })
        fireEvent.change(fieldGolPerDay, {
          target: { value: addNewWorkoutMock.goal_per_day },
        })
        fireEvent.change(fieldRest, {
          target: { value: addNewWorkoutMock.rest },
        })
        fireEvent.click(fieldRepeat)

        expect(fieldName).toHaveValue(addNewWorkoutMock.name)
        expect(fieldSqueeze).toHaveValue(addNewWorkoutMock.squeeze)
        expect(fieldType).toHaveValue(addNewWorkoutMock.type)
        // interval should keep hide
        expect(fieldInterval).not.toBeVisible()
        // END
        expect(fieldGolPerDay).toHaveValue(addNewWorkoutMock.goal_per_day)
        expect(fieldRest).toHaveValue(addNewWorkoutMock.rest)
        expect(fieldRepeat).toBeChecked()
      })

      // test add workout after fill inputs
      fireEvent.click(submitButton)
      const dataMockReturn = {
        ...mockDataResponse[0],
        id: Date.now(),
        ...addNewWorkoutMock,
      }
      fetchMocker.mockResponseOnce(JSON.stringify(dataMockReturn))

      await waitFor(() => {
        // show the success banner
        expect(
          screen.getByText(`Added workout: ${addNewWorkoutMock.name}`),
        ).toBeVisible()
        // after add show it on the workout list
        const workoutAdded = screen.getByText(dataMockReturn.name)
        expect(workoutAdded).toBeVisible()
        expect(workoutAdded.nextSibling).toHaveTextContent(
          addNewWorkoutMock.type,
        )
      })
    })
  })
})
