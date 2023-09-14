import { render } from '@utils/test'

import { App } from './App'

const { _useIdentityContext } = vi.hoisted(() => {
  return { _useIdentityContext: vi.fn() }
})

vi.mock('react-netlify-identity', () => ({
  useIdentityContext: _useIdentityContext,
}))

describe('App', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('user logged out', () => {
    it('should render not auth navigation', () => {
      vi.mocked(_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
      })

      const { getByText } = render(<App />)
      expect(getByText('logout')).not.toBeVisible()
      expect(getByText('workout time')).not.toBeVisible()
      expect(getByText('login')).toBeVisible()
    })
  })

  describe('user logged in', () => {
    it('should render auth navigation', () => {
      vi.mocked(_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
      })
      const { getByText } = render(<App />)
      expect(getByText('logout')).toBeVisible()
      expect(getByText('workout time')).toBeVisible()
      expect(getByText('login')).not.toBeVisible()
    })
  })
})
