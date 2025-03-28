import {
  _hoisted_useIdentityContext,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
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

// TODO: preciso organizar essa function para poder resolver a tab & o form!!!

async function changeTab({
  registerFormTab,
  shouldHave,
  loginFormTab,
}: {
  registerFormTab: HTMLElement
  loginFormTab: HTMLElement
  shouldHave: {
    registerTabForm?: boolean
    loginTabForm?: boolean
  }
}) {
  await act(() => fireEvent.click(registerFormTab))
  expect(loginFormTab).toHaveAttribute(
    'aria-selected',
    `${shouldHave.loginTabForm}`,
  )
  expect(registerFormTab).toHaveAttribute(
    'aria-selected',
    `${shouldHave.registerTabForm}`,
  )
}

const expectForms = (shouldHave: {
  loginTabForm?: boolean
  registerTabForm?: boolean
}) => {
  const loginFormComponent = () =>
    screen.queryByTestId(`form-component-${EnumFormType.login}`)
  const registerFormComponent = () =>
    screen.queryByTestId(`form-component-${EnumFormType.register}`)

  // check if the tab is selected
  const loginFormTab = screen.getByTestId(`${EnumFormType.login}-tab`)
  const registerFormTab = screen.getByTestId(`${EnumFormType.register}-tab`)

  // if register tab is selected, it needs to click on register tab first for then have it selected
  if (shouldHave.registerTabForm) {
    void changeTab({
      registerFormTab,
      loginFormTab,
      shouldHave: {
        registerTabForm: true,
        loginTabForm: false,
      },
    })
  } else {
    expect(loginFormTab).toHaveAttribute(
      'aria-selected',
      `${shouldHave.loginTabForm}`,
    )
    expect(registerFormTab).toHaveAttribute(
      'aria-selected',
      `${shouldHave.registerTabForm}`,
    )
  }

  return {
    loginFormComponent,
    registerFormComponent,
  }
}

describe('Page::Login', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('when the user is authenticated', () => {
    it('should redirect to the workout page', () => {
      vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
        isLoggedIn: true,
        isConfirmedUser: true,
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

      const { loginFormComponent } = expectForms({
        loginTabForm: true,
        registerTabForm: false,
      })

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
      await act(() => fireEvent.submit(loginFormComponent() as HTMLFormElement))

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
      const { loginFormComponent } = expectForms({
        loginTabForm: true,
        registerTabForm: false,
        // resetForm: true,
      })

      // get forgotButton and move to reset form
      const forgotButtonElement = () => screen.getByText('Forgot Password')
      expect(forgotButtonElement()).toBeVisible()
      await act(() => fireEvent.click(forgotButtonElement()))

      // check if login does not exist
      expect(loginFormComponent()).toBeNull()
      // get the reset form
      const resetFormElement = () =>
        screen.queryByTestId(`form-component-${EnumFormType.reset}`)
      // check if the reset form is visible
      expect(resetFormElement()).toHaveAttribute('aria-hidden', 'false')

      // check if are able to back to login form
      const neverMindButton = () => screen.getByText('Never mind')
      expect(neverMindButton()).toBeVisible()
      await act(() => fireEvent.click(neverMindButton()))

      // the reset form should no exist
      expect(resetFormElement()).toBeNull()
      // the login form should be visible
      expect(loginFormComponent()).toHaveAttribute('aria-hidden', 'false')

      // than back to reset and call the reset function
      await act(() => fireEvent.click(forgotButtonElement()))

      // the login form should not exist
      expect(loginFormComponent()).toBeNull()
      // the reset form should be visible
      expect(resetFormElement()).toHaveAttribute('aria-hidden', 'false')

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
          fireEvent.submit(resetFormElement() as HTMLFormElement)
          resolve(true)
        })
      })

      expect(requestPasswordRecovery).toHaveBeenCalledWith(userDataMock.email)
      expect(
        screen.getByText('We will send you an email to reset your password.'),
      ).toBeTruthy()
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
      const { registerFormComponent } = expectForms({
        loginTabForm: false,
        registerTabForm: true,
      })

      const registerForm = registerFormComponent()
      const createButton = () => screen.queryAllByText('Create')
      const buttonToRegister = createButton().find(
        (item) => item.textContent === 'Create',
      )

      expect(createButton().length).toEqual(1)
      expect(buttonToRegister).toBeVisible()

      // change the form type
      await act(() => fireEvent.click(buttonToRegister!))

      // check if register is visible
      expect(registerForm).toHaveAttribute('aria-hidden', 'false')

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
      await act(() => fireEvent.submit(registerForm as HTMLFormElement))

      expect(signupUser).toHaveBeenCalledWith(
        userDataMock.email,
        userDataMock.password,
        {
          full_name: userDataMock.fullName,
        },
      )

      // TODO: not sure why this is not working, the toast is being called but not showing on the screen
      // expect(
      //   screen.getByText(
      //     `Hi ${userDataMock.fullName}. The email confirmation was sent. Please confirm before continuing.`,
      //   ),
      // ).toBeTruthy()
    })
  })
})
