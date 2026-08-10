import { Stack } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { Outlet, useLocation } from 'react-router-dom'

import { Welcome } from '../../pages'
import { PageTitle } from '../PageTitle'

export const Content = () => {
  const { pathname } = useLocation()
  const { isLoggedIn, isConfirmedUser } = useIdentityContext()

  return (
    <Stack p="3" as="section" spacing={3} minH="xl">
      <PageTitle />
      {/* render the component from route */}
      <Outlet />
      {pathname === '/' && !(isLoggedIn && isConfirmedUser) && <Welcome />}
    </Stack>
  )
}
