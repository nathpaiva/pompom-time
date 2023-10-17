import { useToast } from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { useNavigate } from 'react-router-dom'

export const useAuth = (): {
  isLoggedIn: boolean
} => {
  const navigate = useNavigate()
  const toast = useToast()
  const { isLoggedIn, user, getFreshJWT, logoutUser, isConfirmedUser } =
    useIdentityContext()

  const checkAuth = useCallback(async () => {
    try {
      if (!isConfirmedUser) {
        throw new Error('Please confirm your registration')
      }

      if (!user?.token?.expires_at) {
        throw new Error('Toke not provided')
      }

      if (
        user?.token.expires_at &&
        // subtract 1 min to request the refresh token before expires
        user.token.expires_at - 1000 * 60 >= Date.now()
      ) {
        return
      }

      await getFreshJWT()
    } catch (error) {
      let message = 'Error on token'

      if (error instanceof Error) {
        message = error.message
      }

      toast({
        status: 'error',
        title: message,
      })

      if (isConfirmedUser) {
        await logoutUser()
      }
      navigate('/login')
    }
  }, [
    isConfirmedUser,
    user?.token?.expires_at,
    getFreshJWT,
    toast,
    navigate,
    logoutUser,
  ])

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isLoggedIn,
  }
}
