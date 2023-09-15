import { Heading, Stack } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { Outlet, useLocation } from 'react-router-dom'

export const Content = () => {
  const location = useLocation()
  const { user } = useIdentityContext()
  const isLogout = location.pathname === '/logout'

  return (
    <Stack p="3" as="section" spacing={3}>
      {user && !isLogout && (
        <>
          <Heading as="h2">Welcome, {user.user_metadata?.full_name}.</Heading>
        </>
      )}
      {isLogout && <Heading as="h2">Waiting...</Heading>}
      <Outlet />
    </Stack>
  )
}
