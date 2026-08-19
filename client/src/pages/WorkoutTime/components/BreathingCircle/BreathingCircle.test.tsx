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

  it('should apply animatedStyle and render the progress ring when ringOffset > 0', () => {
    const { container } = render(
      <BreathingCircle
        variety={Variety_Enum.Resistance}
        phaseLabel="Squeeze"
        statusText="hold"
        motionDescription="Hold the squeeze, then let go slow."
        animatedStyle={{
          scale: 0.6,
          color: '#655D8A',
          translateY: 0,
          ringOffset: 314.15,
          showRing: true,
        }}
      />,
    )

    const circle = container.querySelector('circle')
    expect(circle).not.toBeNull()
    expect(circle).toHaveAttribute('stroke-dashoffset', '314.15')
  })

  it('should keep the progress ring visible when the hold sweep completes (ringOffset === 0)', () => {
    const { container } = render(
      <BreathingCircle
        variety={Variety_Enum.Resistance}
        phaseLabel="Squeeze"
        statusText="hold"
        motionDescription="Hold the squeeze, then let go slow."
        animatedStyle={{
          scale: 0.6,
          color: '#655D8A',
          translateY: 0,
          ringOffset: 0,
          showRing: true,
        }}
      />,
    )

    const circle = container.querySelector('circle')
    expect(circle).not.toBeNull()
    expect(circle).toHaveAttribute('stroke-dashoffset', '0')
  })

  it('should not render the progress ring outside the hold phase even if ringOffset is set', () => {
    const { container } = render(
      <BreathingCircle
        variety={Variety_Enum.Resistance}
        phaseLabel="Squeeze"
        statusText="3"
        motionDescription="Quick squeeze, then let go slow."
        animatedStyle={{
          scale: 0.6,
          color: '#655D8A',
          translateY: 0,
          ringOffset: 314.15,
          showRing: false,
        }}
      />,
    )

    expect(container.querySelector('circle')).toBeNull()
  })

  it('should not render the progress ring when animatedStyle is absent', () => {
    const { container } = render(
      <BreathingCircle
        variety={Variety_Enum.Pulse}
        phaseLabel="Ready"
        statusText="0/6"
        motionDescription="Quick squeeze and release, light and fast."
      />,
    )

    expect(container.querySelector('circle')).toBeNull()
  })
})
