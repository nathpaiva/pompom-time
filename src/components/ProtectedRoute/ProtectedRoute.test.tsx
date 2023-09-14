import { render } from '@utils/test'

import { ProtectedRoute } from './ProtectedRoute'

const { _useIdentityContext } = vi.hoisted(() => {
  return { _useIdentityContext: vi.fn() }
})

vi.mock('react-netlify-identity', () => ({
  useIdentityContext: _useIdentityContext,
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should test if the user is logged in', () => {
    vi.mocked(_useIdentityContext).mockReturnValue({
      isLoggedIn: true,
    })

    render(<ProtectedRoute />)

    expect(window.location.pathname).toBe('/')
  })

  it('should render redirect to login page', () => {
    vi.mocked(_useIdentityContext).mockReturnValue({
      isLoggedIn: false,
    })
    render(<ProtectedRoute />)

    expect(window.location.pathname).toBe('/login')
  })
})
