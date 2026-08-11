import { Variety_Enum } from '@graph/types'
import { render, screen } from '@utils/test'

import { RepDots } from './RepDots'

describe('Component::RepDots', () => {
  it('should render one dot per rep, filling completed reps with the variety color', () => {
    render(
      <RepDots
        totalReps={4}
        completedReps={2}
        variety={Variety_Enum.Resistance}
      />,
    )

    const dots = screen.getAllByRole('listitem')
    expect(dots).toHaveLength(4)

    expect(dots[0]).toHaveAttribute('data-completed', 'true')
    expect(dots[1]).toHaveAttribute('data-completed', 'true')
    expect(dots[2]).toHaveAttribute('data-completed', 'false')
    expect(dots[3]).toHaveAttribute('data-completed', 'false')
  })
})
