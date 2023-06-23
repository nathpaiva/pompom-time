import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('Hello', () => {
    const { getByText } = render(<App />)
    expect(getByText('My title')).toBeVisible()
  })
})
