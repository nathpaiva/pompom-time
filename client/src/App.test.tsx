import { _hoisted_useIdentityContext, render, screen } from '@utils/test'

import { App } from './App'

const expectedCommonItems = () => {
  expect(screen.getByText('Pompom time')).toBeVisible()
  expect(
    screen.getByText(`This app is still under construction.`),
  ).toBeVisible()
  expect(
    screen.getByText(
      'The purpose is to have a place where you can control and see your progress doing pompoarism workout.',
    ),
  ).toBeTruthy()
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
      render(<App />)

      expect(screen.getByText('logout')).not.toBeVisible()
      expect(screen.getByText('workout time')).not.toBeVisible()
      expect(screen.getByText('login')).toBeVisible()
      expect(screen.getByText('about')).toBeVisible()

      expectedCommonItems()
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
      expect(screen.getByText('about')).not.toBeVisible()
      expectedCommonItems()
    })
  })
})
