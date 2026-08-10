import { Variety_Enum } from '@graph/types'
import {
  _hoisted_useIdentityContext,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@utils/test'

import {
  mockDataResponse,
  mockUser,
} from '../Workout/__tests__/mockDataResponse'
import { AddWorkout } from './AddWorkout'

describe('Page::AddWorkout', () => {
  const { validUserMocked } = mockUser()

  afterEach(() => {
    vi.resetAllMocks()
  })

  Object.values(Variety_Enum).forEach((_workoutType) => {
    it(`should add a new workout successfully with ${_workoutType} type`, async () => {
      const addNewWorkoutMock = {
        name: 'New Workout',
        squeeze: 10,
        variety: _workoutType,
        goal_per_day: 4,
        rest: 45,
        repeat: true,
        interval: _workoutType === Variety_Enum.Resistance ? 10 : null,
      }

      vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

      render(<AddWorkout />)

      // find form and button action
      const submitButton = screen.getByText('Add new workout')
      expect(screen.getByText('Create a new workout:')).toBeVisible()
      expect(submitButton).toBeVisible()

      // get each field and test each one
      const fieldName = screen.getByLabelText('Name')
      const fieldSqueeze = screen.getByLabelText('Squeeze')
      const fieldType = screen.getByLabelText('Select workout variety')
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
          target: { value: addNewWorkoutMock.variety },
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
        expect(fieldType).toHaveValue(addNewWorkoutMock.variety)

        if (_workoutType !== Variety_Enum.Resistance) {
          expect(fieldInterval).not.toBeVisible()
        } else {
          expect(fieldInterval).toBeVisible()
          fireEvent.change(fieldInterval, {
            target: { value: addNewWorkoutMock.interval },
          })
          expect(fieldInterval).toHaveValue(addNewWorkoutMock.interval)
        }

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
      validUserMocked.authedFetch.post.mockResolvedValue(dataMockReturn)

      await waitFor(() => {
        // show the success banner
        expect(
          screen.getByText(`Added workout: ${addNewWorkoutMock.name}`),
        ).toBeVisible()
      })
    })
  })

  it('should not add a new workout if is missing to add a required field', async () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

    render(<AddWorkout />)

    // find form and button action
    const submitButton = screen.getByText('Add new workout')
    expect(screen.getByText('Create a new workout:')).toBeVisible()
    expect(submitButton).toBeVisible()

    // get each field and test each one
    const fieldName = screen.getByLabelText('Name')
    const fieldSqueeze = screen.getByLabelText('Squeeze')
    const fieldType = screen.getByLabelText('Select workout variety')
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

    // test add workout after fill inputs and miss one required
    fireEvent.click(submitButton)

    await waitFor(() => {
      // show the error banner
      expect(screen.getByText('All fields must be filled')).toBeVisible()

      // show error message to each required input
      expect(screen.getByText('Workout name is required')).toBeVisible()
      expect(screen.getByText('Squeeze is required')).toBeVisible()
      expect(screen.getByText('Workout variety is required')).toBeVisible()
      // should not have the interval message, this field is require only for resistance type
      expect(
        screen.queryByText('interval is required if is resistance'),
      ).toBeFalsy()
      // END
      expect(screen.getByText('# of sets is required')).toBeVisible()
      expect(screen.getByText('Rest time is required')).toBeVisible()
    })

    // change workout variety to resistance to test the interval validation
    act(() => {
      fireEvent.change(fieldType, {
        target: { value: Variety_Enum.Resistance },
      })

      expect(fieldInterval).toBeVisible()
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText('Workout variety is required')).toBeFalsy()
      expect(
        screen.getByText('interval is required if is resistance'),
      ).toBeVisible()
    })
  })
})
