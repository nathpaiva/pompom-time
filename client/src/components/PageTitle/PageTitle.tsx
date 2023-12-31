import { Heading } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { useLocation } from 'react-router-dom'

interface IPageTitle {
  title?: string
}

export const PageTitle = ({ title }: IPageTitle) => {
  const { user } = useIdentityContext()
  const location = useLocation()
  const isLogout = location.pathname === '/logout'

  if (user && !isLogout) {
    return <Heading as="h2">Welcome, {user.user_metadata?.full_name}.</Heading>
  }

  if (isLogout) {
    return <Heading as="h2">Waiting...</Heading>
  }

  return <Heading as="h2">{title ?? 'Pompom time'}</Heading>
}
