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
      const submitButton = screen.getByText('Create workout')
      expect(screen.getByText('New workout')).toBeVisible()
      expect(submitButton).toBeVisible()

      // get each field and test each one
      const fieldName = screen.getByLabelText('Workout name')
      const fieldSqueeze = screen.getByLabelText('Contractions per set')
      const chipType = screen.getByLabelText(
        `Select ${_workoutType} workout type`,
      )
      const fieldInterval = screen.getByLabelText('Hold for')
      const fieldGolPerDay = screen.getByLabelText('Number of sets')
      const fieldRest = screen.getByLabelText('Rest between sets')
      const fieldRepeat = screen.getByLabelText('Start next set automatically')

      // Test each field with default values
      expect(fieldName).toHaveValue('')
      expect(fieldSqueeze).toHaveValue(null)
      expect(chipType).toHaveAttribute('aria-pressed', 'false')
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
        fireEvent.click(chipType)
        fireEvent.change(fieldGolPerDay, {
          target: { value: addNewWorkoutMock.goal_per_day },
        })
        fireEvent.change(fieldRest, {
          target: { value: addNewWorkoutMock.rest },
        })
        fireEvent.click(fieldRepeat)

        expect(fieldName).toHaveValue(addNewWorkoutMock.name)
        expect(fieldSqueeze).toHaveValue(addNewWorkoutMock.squeeze)
        expect(chipType).toHaveAttribute('aria-pressed', 'true')

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

  it('should show an error toast if the user is not authenticated', async () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)
    validUserMocked.authedFetch.post.mockRejectedValue(
      new Error('You are not authenticated'),
    )

    render(<AddWorkout />)

    fireEvent.change(screen.getByLabelText('Workout name'), {
      target: { value: 'New Workout' },
    })
    fireEvent.change(screen.getByLabelText('Contractions per set'), {
      target: { value: 10 },
    })
    fireEvent.click(
      screen.getByLabelText(`Select ${Variety_Enum.Pulse} workout type`),
    )
    fireEvent.change(screen.getByLabelText('Number of sets'), {
      target: { value: 4 },
    })
    fireEvent.change(screen.getByLabelText('Rest between sets'), {
      target: { value: 45 },
    })

    fireEvent.click(screen.getByText('Create workout'))

    await waitFor(() => {
      expect(screen.getByText('You are not authenticated')).toBeVisible()
    })
  })

  it('should not add a new workout if is missing to add a required field', async () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

    render(<AddWorkout />)

    // find form and button action
    const submitButton = screen.getByText('Create workout')
    expect(screen.getByText('New workout')).toBeVisible()
    expect(submitButton).toBeVisible()

    // get each field and test each one
    const fieldName = screen.getByLabelText('Workout name')
    const fieldSqueeze = screen.getByLabelText('Contractions per set')
    const fieldInterval = screen.getByLabelText('Hold for')
    const fieldGolPerDay = screen.getByLabelText('Number of sets')
    const fieldRest = screen.getByLabelText('Rest between sets')
    const fieldRepeat = screen.getByLabelText('Start next set automatically')

    // Test each field with default values
    expect(fieldName).toHaveValue('')
    expect(fieldSqueeze).toHaveValue(null)
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
    fireEvent.click(
      screen.getByLabelText(`Select ${Variety_Enum.Resistance} workout type`),
    )

    await waitFor(() => {
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
