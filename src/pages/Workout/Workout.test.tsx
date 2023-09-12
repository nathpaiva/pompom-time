import { render } from '@utils/test'
import { describe, expect, it } from 'vitest'

import { Workout } from './Workout'

describe('Workout', () => {
  it('should render the app with two buttons', () => {
    const { getByText } = render(<Workout />)
    expect(getByText('Start pulse')).toBeVisible()
    expect(getByText('Reset')).toBeVisible()
  })
})
