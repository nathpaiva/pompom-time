import { render } from '@utils/test'

import { Logout } from './Logout'

const { _useIdentityContext } = vi.hoisted(() => {
  return { _useIdentityContext: vi.fn() }
})

vi.mock('react-netlify-identity', () => ({
  useIdentityContext: _useIdentityContext,
}))

describe('Page::Logout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when the user is authenticated', () => {
    it('should logout', () => {
      const logoutUser = vi.fn()

      vi.mocked(_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        logoutUser,
      })
      render(<Logout />)

      expect(logoutUser).toHaveBeenCalled()
    })
  })

  describe('when the user not is authenticated', () => {
    it('should redirect to login page', () => {
      vi.mocked(_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
      })
      render(<Logout />)

      expect(window.location.pathname).toBe('/login')
    })
  })
})
