import { _hoisted_useIdentityContext, render, waitFor } from '@utils/test'

import { ProtectedRoute } from './ProtectedRoute'

interface TMock {
  isLoggedIn?: boolean
  expires_at?: number
}

describe('ProtectedRoute', () => {
  const mockUser = (param?: TMock) => {
    return {
      isLoggedIn: param?.isLoggedIn ?? true,
      logoutUser: vi.fn(),
      user: {
        token: {
          // expires at = next day
          expires_at: param?.expires_at ?? Date.now() + 100000000,
        },
      },
      getFreshJWT: vi.fn(),
    }
  }

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render page if the user is logged', () => {
    const mockUserData = mockUser()
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockUserData)

    render(<ProtectedRoute />, {
      initialEntries: '/admin/workout',
    })

    expect(mockUserData.logoutUser).not.toHaveBeenCalled()
    expect(mockUserData.getFreshJWT).not.toHaveBeenCalled()
    // TODO: review the redirect
    // expect(window.location.pathname).toBe('/admin/workout')
  })

  describe('if the user is not authenticated', () => {
    it('should call getFreshJWT and on success keep the user in the current page', () => {
      const mockUserData = mockUser({
        isLoggedIn: false,
        expires_at: Date.now() - 100,
      })
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockUserData)

      render(<ProtectedRoute />, {
        initialEntries: '/admin/workout',
      })

      expect(mockUserData.logoutUser).not.toHaveBeenCalled()
      expect(mockUserData.getFreshJWT).toHaveBeenCalled()
      // TODO: review the redirect
      // expect(window.location.pathname).toBe('/admin/workout')
    })

    it('should call getFreshJWT and on error redirect the user to login page', async () => {
      const mockUserData = mockUser({
        isLoggedIn: false,
        expires_at: Date.now() - 100,
      })

      mockUserData.getFreshJWT.mockRejectedValue(new Error('Errou'))
      mockUserData.logoutUser.mockResolvedValue(undefined)

      vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockUserData)

      render(<ProtectedRoute />, {
        initialEntries: '/admin/workout',
      })

      await waitFor(() => {
        expect(mockUserData.getFreshJWT).toHaveBeenCalled()
        expect(mockUserData.logoutUser).toHaveBeenCalled()
      })

      // TODO: review the redirect
      // await waitFor(() => {
      //   expect(window.location.pathname).toBe('/login')
      // })
    })
  })
})
