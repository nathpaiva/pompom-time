import { fireEvent, render, screen } from '@utils/test'

import { WorkoutControls } from './WorkoutControls'

describe('Component::WorkoutControls', () => {
  it('should show "Start workout" and disable Reset before the workout starts', () => {
    const handleStartStopPulse = vi.fn()
    render(
      <WorkoutControls
        primaryLabel="Start workout"
        isPrimaryDisabled={false}
        isResetDisabled
        onPrimaryClick={handleStartStopPulse}
        onResetClick={handleStartStopPulse}
      />,
    )

    const primaryButton = screen.getByText('Start workout')
    const resetButton = screen.getByText('Reset')

    expect(primaryButton).toBeEnabled()
    expect(resetButton).toBeDisabled()

    fireEvent.click(primaryButton)
    expect(handleStartStopPulse).toHaveBeenCalledOnce()
  })

  it('should show "Pause" and enable Reset while the workout runs', () => {
    const onPrimaryClick = vi.fn()
    const onResetClick = vi.fn()
    render(
      <WorkoutControls
        primaryLabel="Pause"
        isPrimaryDisabled={false}
        isResetDisabled={false}
        onPrimaryClick={onPrimaryClick}
        onResetClick={onResetClick}
      />,
    )

    const resetButton = screen.getByText('Reset')
    expect(resetButton).toBeEnabled()

    fireEvent.click(resetButton)
    expect(onResetClick).toHaveBeenCalledOnce()
  })

  it('should disable the primary button during countdown or rest', () => {
    const onPrimaryClick = vi.fn()
    render(
      <WorkoutControls
        primaryLabel="Pause"
        isPrimaryDisabled
        isResetDisabled={false}
        onPrimaryClick={onPrimaryClick}
        onResetClick={vi.fn()}
      />,
    )

    expect(screen.getByText('Pause')).toBeDisabled()
  })
})
