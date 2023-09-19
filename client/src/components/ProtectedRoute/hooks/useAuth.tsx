import { useToast } from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'
import { useIdentityContext } from 'react-netlify-identity'

export const useAuth = (): {
  isLoggedIn: boolean
} => {
  const toast = useToast()
  const { isLoggedIn, user, getFreshJWT, logoutUser } = useIdentityContext()

  const checkAuth = useCallback(async () => {
    if (user?.token.expires_at && user.token.expires_at >= Date.now()) {
      return
    }

    try {
      if (!user?.token.expires_at) {
        throw new Error('Not token provided')
      }

      await getFreshJWT()
    } catch (error) {
      logoutUser()
      toast({
        status: 'error',
        title: (error as Error).message,
      })
    }
  }, [getFreshJWT, logoutUser, toast, user?.token.expires_at])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    isLoggedIn,
  }
}
