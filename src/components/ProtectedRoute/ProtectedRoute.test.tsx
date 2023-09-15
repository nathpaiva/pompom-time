import { _hoisted_useIdentityContext, render } from '@utils/test'

import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should test if the user is logged in', () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
      isLoggedIn: true,
    })

    render(<ProtectedRoute />)

    expect(window.location.pathname).toBe('/')
  })

  it('should render redirect to login page', () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
      isLoggedIn: false,
    })
    render(<ProtectedRoute />)

    expect(window.location.pathname).toBe('/login')
  })
})
