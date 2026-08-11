import { Variety_Enum } from '@graph/types'
import { render, screen } from '@utils/test'

import { VarietySwitcher } from './VarietySwitcher'

describe('Component::VarietySwitcher', () => {
  it('should render one pill per variety, marking the active one', () => {
    render(<VarietySwitcher activeVariety={Variety_Enum.Resistance} />)

    Object.values(Variety_Enum).forEach((variety) => {
      const pill = screen.getByText(variety)
      expect(pill).toBeVisible()

      if (variety === Variety_Enum.Resistance) {
        expect(pill).toHaveAttribute('aria-current', 'true')
      } else {
        expect(pill).not.toHaveAttribute('aria-current')
      }
    })
  })
})
