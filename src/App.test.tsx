import { render } from '@utils/test'
import { describe, expect, it } from 'vitest'

import { App } from './App'

describe('App', () => {
  it('should render the app with two buttons', () => {
    const { getByText } = render(<App />)
    expect(getByText('Hello')).toBeVisible()
  })
})
