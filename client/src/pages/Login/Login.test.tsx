import {
  _hoisted_useIdentityContext,
  act,
  fireEvent,
  render,
  screen,
} from '@utils/test'

import { Login } from './Login'
import { EnumFormType } from './types'

const logoutUser = vi.fn()
const loginUser = vi.fn()
const signupUser = vi.fn()
const requestPasswordRecovery = vi.fn()

const userDataMock = {
  email: 'user@test.com',
  password: 'XXXX',
  fullName: 'User Test',
}

const expectForms = (shouldHave: {
  loginForm?: boolean
  registerForm?: boolean
  resetForm?: boolean
}) => {
  const loginForm = screen.getByTestId(EnumFormType.login)
  const registerForm = screen.getByTestId(EnumFormType.register)
  const resetForm = screen.getByTestId(EnumFormType.reset)

  expect(loginForm).toHaveAttribute('aria-hidden', `${shouldHave.loginForm}`)
  expect(registerForm).toHaveAttribute(
    'aria-hidden',
    `${shouldHave.registerForm}`,
  )
  expect(resetForm).toHaveAttribute('aria-hidden', `${shouldHave.resetForm}`)

  return {
    loginForm,
    registerForm,
    resetForm,
  }
}

describe('Page::Login', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when the user is authenticated', () => {
    // TODO: review the redirect
    it.skip('should redirect to the workout page', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        logoutUser,
        loginUser,
        signupUser,
        requestPasswordRecovery,
      })

      render(<Login />, { initialEntries: '/login' })

      expect(window.location.pathname).toBe('/admin/workout')
    })
  })

  describe('when the user not is authenticated', () => {
    it('should render the login form and login the user', async () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
        logoutUser,
        loginUser,
        signupUser,
        requestPasswordRecovery,
      })

      render(<Login />, { initialEntries: '/login' })

      const { loginForm } = expectForms({
        loginForm: true,
        registerForm: false,
        resetForm: false,
      })

      // check if the form has the title
      const loginFormTitle = screen.getByText('Log in')
      expect(loginFormTitle).toBeVisible()

      // Inputs
      const inputEmailLoginForm = screen.getByTestId(
        `${EnumFormType.login}-email`,
      )
      expect(inputEmailLoginForm).toBeVisible()
      const inputPassLoginForm = screen.getByTestId(
        `${EnumFormType.login}-password`,
      )
      expect(inputPassLoginForm).toBeVisible()

      fireEvent.change(inputEmailLoginForm, {
        target: { value: userDataMock.email },
      })
      fireEvent.change(inputPassLoginForm, {
        target: { value: userDataMock.password },
      })

      // after fill check if the submit function is being called
      await act(() => fireEvent.submit(loginForm))

      expect(loginUser).toHaveBeenCalledWith(
        userDataMock.email,
        userDataMock.password,
      )
    })

    it('should render the login form and move to reset pass', async () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
        logoutUser,
        loginUser,
        signupUser,
        requestPasswordRecovery,
      })

      render(<Login />, { initialEntries: '/login' })

      // get each form and check if only login is visible
      const { loginForm, resetForm } = expectForms({
        loginForm: true,
        registerForm: false,
        resetForm: false,
      })

      // get forgotButton and move to reset form
      const forgotButton = screen.getByText('Forgot Password')
      expect(forgotButton).toBeVisible()
      await act(() => fireEvent.click(forgotButton))

      // check if login is not visible and register is visible
      expect(loginForm).toHaveAttribute('aria-hidden', 'false')
      expect(resetForm).toHaveAttribute('aria-hidden', 'true')

      // check if are able to back to login form
      const neverMindButton = screen.getByText('Never mind')
      expect(neverMindButton).toBeVisible()
      await act(() => fireEvent.click(neverMindButton))

      expect(loginForm).toHaveAttribute('aria-hidden', 'true')
      expect(resetForm).toHaveAttribute('aria-hidden', 'false')

      // than back to reset and call the reset function
      await act(() => fireEvent.click(forgotButton))
      expect(loginForm).toHaveAttribute('aria-hidden', 'false')
      expect(resetForm).toHaveAttribute('aria-hidden', 'true')

      // check if the form has the title
      const recoverPassFormTitle = screen.getByText('Recover password')
      expect(recoverPassFormTitle).toBeVisible()

      // Inputs
      const inputEmailResetForm = screen.getByTestId(
        `${EnumFormType.reset}-email`,
      )

      expect(inputEmailResetForm).toBeVisible()

      fireEvent.change(inputEmailResetForm, {
        target: { value: userDataMock.email },
      })

      await act(() => {
        return new Promise((resolve) => {
          fireEvent.submit(resetForm)
          resolve(true)
        })
      })

      expect(requestPasswordRecovery).toHaveBeenCalledWith(userDataMock.email)
      expect(screen.getByText('The email has been sent')).toBeTruthy()
    })

    it('should render the login form and move to register and create a new user', async () => {
      vi.mocked(signupUser).mockReturnValue({
        user_metadata: {
          full_name: userDataMock.fullName,
        },
      })

      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: false,
        logoutUser,
        loginUser,
        signupUser,
        requestPasswordRecovery,
      })

      render(<Login />, { initialEntries: '/login' })

      // get each form and check if only login is visible
      const { loginForm, registerForm } = expectForms({
        loginForm: true,
        registerForm: false,
        resetForm: false,
      })

      const _buttonToRegister = screen.queryAllByText('Register')
      const buttonToRegister = _buttonToRegister.filter(
        (item) => (item as HTMLButtonElement).type === 'button',
      )[0]

      expect(_buttonToRegister.length).toEqual(2)
      expect(buttonToRegister).toBeVisible()

      // change the form type
      await act(() => fireEvent.click(buttonToRegister))

      // check if login is not visible and register is visible
      expect(loginForm).toHaveAttribute('aria-hidden', 'false')
      expect(registerForm).toHaveAttribute('aria-hidden', 'true')

      // check if the form has the title
      const signUpFormTitle = screen.getByText('Sign up')
      expect(signUpFormTitle).toBeVisible()

      // Inputs
      const inputEmailRegisterForm = screen.getByTestId(
        `${EnumFormType.register}-email`,
      )
      const inputPassRegisterForm = screen.getByTestId(
        `${EnumFormType.register}-password`,
      )
      const inputFullNameRegisterForm = screen.getByTestId(
        `${EnumFormType.register}-fullName`,
      )

      expect(inputEmailRegisterForm).toBeVisible()
      expect(inputPassRegisterForm).toBeVisible()
      expect(inputFullNameRegisterForm).toBeVisible()

      // fill the form
      fireEvent.change(inputEmailRegisterForm, {
        target: { value: userDataMock.email },
      })
      fireEvent.change(inputPassRegisterForm, {
        target: { value: userDataMock.password },
      })
      fireEvent.change(inputFullNameRegisterForm, {
        target: { value: userDataMock.fullName },
      })

      // after fill check if the submit function is being called
      await act(() => fireEvent.submit(registerForm))

      expect(signupUser).toHaveBeenCalledWith(
        userDataMock.email,
        userDataMock.password,
        {
          full_name: userDataMock.fullName,
        },
      )

      expect(
        screen.getByText(`Hi ${userDataMock.fullName}. Welcome to Pompom time`),
      ).toBeTruthy()
    })
  })
})
