import { Heading, Stack, Text } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'

import { PageTitle } from '../PageTitle'

export const Content = () => {
  const { pathname } = useLocation()

  return (
    <Stack p="3" as="section" spacing={3} minH="xl">
      <PageTitle />
      {/* render the component from route */}
      <Outlet />
      {pathname === '/' && (
        <Stack spacing={3}>
          <Heading as="h4" size="lg">
            This app is still under construction.
          </Heading>
          <Text>
            The purpose is to have a place where you can control and see your
            progress doing pompoarism workout.
          </Text>
        </Stack>
      )}
    </Stack>
  )
}
