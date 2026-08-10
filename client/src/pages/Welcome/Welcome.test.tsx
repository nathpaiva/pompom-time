import { render, screen } from '@utils/test'

import { Welcome } from './Welcome'

describe('Page::Welcome', () => {
  it('should render the wordmark and tagline', () => {
    render(<Welcome />)

    expect(screen.getByText('pompom')).toBeVisible()
    expect(screen.getByText('time')).toBeVisible()
    expect(
      screen.getByText(
        'Get to know, strengthen, and track your pelvic floor, at your own pace.',
      ),
    ).toBeVisible()
  })

  it('should link "Get started" to the sign in page', () => {
    render(<Welcome />)

    expect(screen.getByText('Get started').closest('a')).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('should link "I already have an account" to the sign in page', () => {
    render(<Welcome />)

    expect(
      screen.getByText('I already have an account').closest('a'),
    ).toHaveAttribute('href', '/login')
  })
})
