import {
  logout,
  open,
  on,
  close,
  currentUser,
  type User,
} from 'netlify-identity-widget'
import { useEffect, useMemo, useState } from 'react'

import { AuthContext } from './components'

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [_user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const handleLoggedOut = () => {
    logout()
    on('logout', () => setUser(null))
  }

  const handleLoggedIn = () => {
    open('login')
    on('login', (user: User) => {
      setUser(user)
      close()
    })
  }

  const values = useMemo(
    () => ({
      user: _user,
      handleLoggedOut,
      handleLoggedIn,
    }),
    [_user],
  )

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
