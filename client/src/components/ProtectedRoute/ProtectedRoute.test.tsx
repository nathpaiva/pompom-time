import {
  _hoisted_useIdentityContext,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { ProtectedRoute } from './ProtectedRoute'

interface TMock {
  isLoggedIn?: boolean
  isConfirmedUser?: boolean
  expires_at?: number
}

describe('ProtectedRoute', () => {
  const mockUser = (param?: TMock) => {
    return {
      isLoggedIn: param?.isLoggedIn ?? true,
      isConfirmedUser: param?.isConfirmedUser ?? true,
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

  it('should render page if the user is logged', async () => {
    const mockUserData = mockUser()
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockUserData)

    render(<ProtectedRoute />, {
      initialEntries: '/admin/workout',
    })
    await waitFor(() => {
      expect(mockUserData.logoutUser).not.toHaveBeenCalled()
      expect(mockUserData.getFreshJWT).not.toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(window.location.pathname).toBe('/admin/workout')
    })
  })

  describe('if the user is not authenticated', () => {
    it('should show an error message if the user is not confirmed yet', async () => {
      const mockUserData = mockUser({
        isLoggedIn: false,
        expires_at: Date.now() - 100,
        isConfirmedUser: false,
      })
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockUserData)

      render(<ProtectedRoute />, {
        initialEntries: '/admin/workout',
      })

      await waitFor(() => {
        expect(
          screen.getByText('Please confirm your registration'),
        ).toBeVisible()
      })
    })

    it('should show an error message if there is no expires_at', async () => {
      const mockUserData = mockUser({
        isLoggedIn: true,
        isConfirmedUser: true,
      })

      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        ...mockUserData,
        user: {
          token: {
            expires_at: null,
          },
        },
      })

      render(<ProtectedRoute />, {
        initialEntries: '/admin/workout',
      })

      await waitFor(() => {
        expect(screen.getByText('Toke not provided')).toBeVisible()
      })
    })

    it('should call getFreshJWT and on success keep the user in the current page', async () => {
      const mockUserData = mockUser({
        isLoggedIn: true,
        expires_at: Date.now() - 100,
      })

      mockUserData.getFreshJWT.mockResolvedValue('token')

      vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockUserData)

      render(<ProtectedRoute />, {
        initialEntries: '/admin/workout',
      })

      console.log('window.location.pathname', window.location.pathname)

      await waitFor(() => {
        expect(mockUserData.logoutUser).not.toHaveBeenCalled()
        expect(mockUserData.getFreshJWT).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(window.location.pathname).toBe('/admin/workout')
      })
    })

    it('should call getFreshJWT and on error redirect the user to login page', async () => {
      const mockUserData = mockUser({
        isLoggedIn: true,
        expires_at: Date.now() - 100,
      })

      mockUserData.getFreshJWT.mockRejectedValue(
        new Error('Error to get new token'),
      )
      mockUserData.logoutUser.mockResolvedValue(undefined)

      vi.mocked(_hoisted_useIdentityContext).mockReturnValue(mockUserData)

      render(<ProtectedRoute />, {
        initialEntries: '/admin/workout',
      })

      await waitFor(() => {
        expect(mockUserData.getFreshJWT).toHaveBeenCalled()
        expect(mockUserData.logoutUser).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(window.location.pathname).toBe('/login')
      })
    })
  })
})
