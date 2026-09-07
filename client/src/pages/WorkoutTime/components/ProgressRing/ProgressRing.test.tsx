import { render } from '@utils/test'

import { ProgressRing } from './ProgressRing'

describe('Component::ProgressRing', () => {
  it('should render a circle with the given stroke-dashoffset and color', () => {
    const { container } = render(
      <ProgressRing ringOffset={314.15} color="#655D8A" />,
    )

    const circle = container.querySelector('circle')
    expect(circle).not.toBeNull()
    expect(circle).toHaveAttribute('stroke-dashoffset', '314.15')
    expect(circle).toHaveAttribute('stroke', '#655D8A')
    expect(circle).toHaveAttribute('r', '100')
    expect(circle).toHaveAttribute('stroke-width', '6')
  })
})
