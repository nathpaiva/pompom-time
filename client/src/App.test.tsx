import { _hoisted_useIdentityContext, render, screen } from '@utils/test'

import { App } from './App'

const expectedCommonItems = () => {
  expect(screen.getByText('Pompom time')).toBeVisible()
}

describe('App', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('user logged out', () => {
    it('should render not auth navigation', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
      })
      render(<App />, { initialEntries: '/admin/workout' })

      expect(screen.getByText('logout')).not.toBeVisible()
      expect(screen.getByText('workout time')).not.toBeVisible()
      expect(screen.getByText('login')).toBeVisible()

      expectedCommonItems()
    })

    it('should not render the top nav on "/" or "/login"', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
      })
      render(<App />, { initialEntries: '/' })

      expect(screen.queryByText('login')).toBeNull()
    })

    it('should render Welcome on "/"', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
      })
      render(<App />)

      expect(screen.getByText('pompom')).toBeVisible()
      expect(
        screen.getByText(
          'Get to know, strengthen, and track your pelvic floor, at your own pace.',
        ),
      ).toBeVisible()
    })
  })

  describe('user logged in', () => {
    it('should render auth navigation', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        isConfirmedUser: true,
      })
      render(<App />)

      expect(screen.getByText('logout')).toBeVisible()
      expect(screen.getByText('workout time')).toBeVisible()
      expect(screen.getByText('login')).not.toBeVisible()
      expectedCommonItems()
    })

    it('should not render Welcome on "/"', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        isConfirmedUser: true,
      })
      render(<App />)

      expect(screen.queryByText('pompom')).toBeNull()
    })

    it('should still render the top nav on "/" and "/login"', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        isConfirmedUser: true,
      })

      const { unmount } = render(<App />, { initialEntries: '/' })
      expect(screen.getByText('workout time')).toBeVisible()
      unmount()

      render(<App />, { initialEntries: '/login' })
      expect(screen.getByText('workout time')).toBeVisible()
    })
  })

  describe('user logged in but not confirmed', () => {
    it('should render Welcome on "/"', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        isConfirmedUser: false,
      })
      render(<App />)

      expect(screen.getByText('pompom')).toBeVisible()
    })
  })
})
