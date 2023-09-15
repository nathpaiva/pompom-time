import { render, screen } from '@utils/test'

import { PageTitle } from './PageTitle'

const { _useIdentityContext } = vi.hoisted(() => {
  return { _useIdentityContext: vi.fn() }
})

vi.mock('react-netlify-identity', () => ({
  useIdentityContext: _useIdentityContext,
}))

describe('PageTitle', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('user logged out', () => {
    it('should render the default title', () => {
      vi.mocked(_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
      })
      render(<PageTitle />)

      expect(screen.getByText('Pompom time')).toBeTruthy()
    })
  })
  describe('user logged in', () => {
    it('should render title with the user name', () => {
      vi.mocked(_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        user: {
          user_metadata: {
            full_name: 'User Test',
          },
        },
      })
      render(<PageTitle />)

      expect(screen.getByText('Welcome, User Test.')).toBeTruthy()
    })

    describe('on logout page', () => {
      it('should render the wait title', () => {
        vi.mocked(_useIdentityContext).mockReturnValue({
          isLoggedIn: true,
          user: {
            user_metadata: {
              full_name: 'User Test',
            },
          },
        })
        render(<PageTitle />, { initialEntries: '/logout' })

        expect(screen.getByText('Waiting...')).toBeTruthy()
      })
    })
  })
})
