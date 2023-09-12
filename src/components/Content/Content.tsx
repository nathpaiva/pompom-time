import { Heading, Stack } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../Auth'

export const Content = () => {
  const location = useLocation()
  const { user } = useAuth()
  const isLogout = location.pathname === '/logout'

  console.log('location', location.pathname)

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
