import { useToast } from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { useNavigate } from 'react-router-dom'

export const useAuth = (): {
  isLoggedIn: boolean
} => {
  const navigate = useNavigate()
  const toast = useToast()
  const { isLoggedIn, user, getFreshJWT, logoutUser } = useIdentityContext()

  const checkAuth = useCallback(async () => {
    console.log('user?.token.expires_at', user?.token.expires_at, Date.now())

    if (user?.token.expires_at && user.token.expires_at >= Date.now()) {
      return
    }

    try {
      if (!user?.token.expires_at) {
        throw new Error('Toke not provided')
      }

      console.log(`will request refresh token`)
      const responseFreshJWT = await getFreshJWT()
      console.log(
        '🚀 ~ file: useAuth.tsx:27 ~ checkAuth ~ responseFreshJWT:',
        responseFreshJWT,
      )
    } catch (error) {
      let message = 'Error on token'

      if (error instanceof Error) {
        message = error.message
      }

      toast({
        status: 'error',
        title: message,
      })

      await logoutUser()
      navigate('/login')
    }
  }, [getFreshJWT, logoutUser, navigate, toast, user?.token.expires_at])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    isLoggedIn,
  }
}
