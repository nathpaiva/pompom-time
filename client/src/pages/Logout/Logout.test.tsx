import { _hoisted_useIdentityContext, render } from '@utils/test'

import { Logout } from './Logout'

describe('Page::Logout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when the user is authenticated', () => {
    it('should logout', () => {
      const logoutUser = vi.fn()

      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        logoutUser,
      })
      render(<Logout />, { initialEntries: '/logout' })

      expect(logoutUser).toHaveBeenCalled()
    })
  })

  describe('when the user not is authenticated', () => {
    // TODO: review the redirect
    it.skip('should redirect to login page', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
      })
      render(<Logout />, { initialEntries: '/logout' })

      expect(window.location.pathname).toBe('/login')
    })
  })
})
