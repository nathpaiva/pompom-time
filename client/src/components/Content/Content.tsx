import { Stack } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'

import { About } from '../../pages'
import { PageTitle } from '../PageTitle'

export const Content = () => {
  const { pathname } = useLocation()

  return (
    <Stack p="3" as="section" spacing={3} minH="xl">
      <PageTitle />
      {/* render the component from route */}
      <Outlet />
      {pathname === '/' && <About />}
    </Stack>
  )
}
