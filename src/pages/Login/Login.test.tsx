import { fireEvent, render } from '@utils/test'

import { Login } from './Login'

describe('Login', () => {
  it('should render the login page and open the iframe', () => {
    const { getByText } = render(<Login />)

    const button = getByText('Hey there,')
    expect(button).toBeVisible()

    fireEvent.click(button)

    expect(document.getElementById('netlify-identity-widget')).toBeTruthy()
  })

  it.todo('should log in and redirect to the home page')
})
