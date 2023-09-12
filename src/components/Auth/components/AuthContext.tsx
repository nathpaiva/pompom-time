import { User } from 'netlify-identity-widget'
import { createContext } from 'react'

import { noop } from '../../../utils'

interface IAuthContext {
  user: User | null
  handleLoggedIn: () => void
  handleLoggedOut: () => Promise<void> | undefined | void
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  handleLoggedIn: noop,
  handleLoggedOut: noop,
})
