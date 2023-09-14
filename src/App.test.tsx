import { render } from '@utils/test'

import { App } from './App'

describe('App', () => {
  it('should render the app with navigation and the user logged out', () => {
    const { getByText } = render(<App />)
    expect(getByText('logout')).not.toBeVisible()
    expect(getByText('login')).toBeVisible()
    expect(getByText('workout time')).toBeVisible()
  })
})
