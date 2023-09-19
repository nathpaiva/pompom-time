import { Progress } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { Navigate } from 'react-router-dom'

export const Logout = () => {
  const { logoutUser, isLoggedIn } = useIdentityContext()

  useEffect(() => {
    if (isLoggedIn) {
      logoutUser()
    }
  }, [isLoggedIn, logoutUser])

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return <Progress size="xs" isIndeterminate colorScheme="purple" />
}
