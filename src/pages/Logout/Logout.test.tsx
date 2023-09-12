import { render } from '@utils/test'
import { describe, expect, it } from 'vitest'

import { Logout } from './Logout'

describe('Logout', () => {
  describe('when the user is not logged in', () => {
    it('should render the Logout page and open the iframe', () => {
      render(<Logout />)

      expect(window.location.pathname).toBe('/login')
    })
  })

  it.todo('should test if the user is logged in')
})
