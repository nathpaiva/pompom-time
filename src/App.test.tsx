import { render } from '@utils/test'

import { App } from './App'

describe('App', () => {
  it('should render the app with two buttons', () => {
    const { getByText } = render(<App />)
    expect(getByText('Start pulse')).toBeVisible()
    expect(getByText('Reset')).toBeVisible()
  })
})
