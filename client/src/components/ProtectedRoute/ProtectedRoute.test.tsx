import { _hoisted_useIdentityContext, render } from '@utils/test'

import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should test if the user is logged in', () => {
    const mockFun = {
      isLoggedIn: true,
      logoutUser: vi.fn(),
      user: {
        token: {
          // expires at = next day
          expires_at: Date.now() + 100000000,
        },
      },
      getFreshJWT: vi.fn(),
    }
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockFun)

    render(<ProtectedRoute />)

    expect(mockFun.logoutUser).not.toHaveBeenCalled()
    expect(mockFun.getFreshJWT).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/')
  })

  it('should render redirect to login page', () => {
    const mockFun = {
      isLoggedIn: false,
      logoutUser: vi.fn(),
      user: {
        token: {
          // expires at = next day
          expires_at: Date.now() + 100000000,
        },
      },
    }
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockFun)
    render(<ProtectedRoute />)

    expect(mockFun.logoutUser).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/login')
  })
})
