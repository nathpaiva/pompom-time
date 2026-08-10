import { _hoisted_useIdentityContext, render, screen } from '@utils/test'

import { Content } from './Content'

describe('Content', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render Welcome on "/" when the user is logged out', () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
      isLoggedIn: false,
    })

    render(<Content />, { initialEntries: '/' })

    expect(screen.getByText('pompom')).toBeVisible()
  })

  it('should not render Welcome on "/" when the user is logged in', () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
      isLoggedIn: true,
    })

    render(<Content />, { initialEntries: '/' })

    expect(screen.queryByText('pompom')).toBeNull()
  })
})
