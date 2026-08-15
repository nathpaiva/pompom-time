import { Variety_Enum } from '@graph/types'
import { render, screen } from '@utils/test'

import { BreathingCircle } from './BreathingCircle'

describe('Component::BreathingCircle', () => {
  it('should show the phase label and status text passed in', () => {
    render(
      <BreathingCircle
        variety={Variety_Enum.Pulse}
        phaseLabel="Squeeze"
        statusText="3"
        motionDescription="Quick squeeze and release, light and fast."
      />,
    )

    expect(screen.getByText('Squeeze')).toBeVisible()
    expect(screen.getByText('3')).toBeVisible()
    expect(
      screen.getByText('Quick squeeze and release, light and fast.'),
    ).toBeVisible()
  })
})
