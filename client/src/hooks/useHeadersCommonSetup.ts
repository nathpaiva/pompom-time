import { useIdentityContext } from 'react-netlify-identity'

export const useHeadersCommonSetup = () => {
  const { user } = useIdentityContext()
  if (!user?.token) return

  const {
    token: { access_token, token_type },
  } = user

  const arrTokenType = token_type.split('')
  arrTokenType[0] = arrTokenType[0].toUpperCase()

  return {
    Authorization: `${arrTokenType.join('')} ${access_token}`,
    'Content-Type': 'application/json',
  }
}
