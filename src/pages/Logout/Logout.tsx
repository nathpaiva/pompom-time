import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../../components'

export const Logout = () => {
  const { handleLoggedOut: handlerLoggedOut, user } = useAuth()

  useEffect(() => {
    handlerLoggedOut()
  }, [handlerLoggedOut])

  if (!user) {
    return <Navigate to="/login" />
  }

  return null
}
