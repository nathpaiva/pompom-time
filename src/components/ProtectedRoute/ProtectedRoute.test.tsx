import { render } from '@utils/test'
import { describe, expect, it } from 'vitest'

import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute', () => {
  it('should render redirect to login page', () => {
    render(<ProtectedRoute />)

    expect(window.location.pathname).toBe('/login')
  })
  it.todo('should test if the user is logged in')
})
