import { Progress } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../../components'

export const Logout = () => {
  const { handleLoggedOut, user } = useAuth()

  useEffect(() => {
    handleLoggedOut()
  }, [handleLoggedOut])

  if (!user) {
    return <Navigate to="/login" />
  }

  return <Progress size="xs" isIndeterminate colorScheme="purple" />
}
