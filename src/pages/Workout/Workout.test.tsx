import { render, screen } from '@utils/test'

import { Workout } from './Workout'

describe('Workout', () => {
  it('should render the app with two buttons', () => {
    render(<Workout />)
    expect(screen.getByText('Start pulse')).toBeVisible()
    expect(screen.getByText('Reset')).toBeVisible()
  })
})
