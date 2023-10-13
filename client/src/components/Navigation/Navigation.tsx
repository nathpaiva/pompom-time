import { GridItem, Stack } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { useLocation } from 'react-router-dom'

import { LiContainer } from './components'

export const Navigation = () => {
  const { pathname } = useLocation()
  const { isLoggedIn, isConfirmedUser } = useIdentityContext()

  return (
    <GridItem as="nav" p="3">
      <Stack spacing={2} as="ul">
        <LiContainer label="home" isCurrent={pathname === '/'} to="/" />

        <LiContainer
          label="workout time"
          to="admin/workout"
          isCurrent={!pathname.indexOf('/admin/workout')}
          isToShowItem={isLoggedIn && isConfirmedUser}
          isAuthItem
        />

        <LiContainer
          label="(TBD) insights"
          to="#"
          isCurrent={pathname === '/#'}
          isAuthItem
          isToShowItem={isLoggedIn && isConfirmedUser}
        />

        <LiContainer
          label="logout"
          to="logout"
          isCurrent={pathname === '/logout'}
          isAuthItem
          isToShowItem={isLoggedIn && isConfirmedUser}
        />
        <LiContainer
          label="login"
          to="login"
          isCurrent={pathname === '/login'}
          isAuthItem
          isToShowItem={!isLoggedIn || !isConfirmedUser}
        />
      </Stack>
    </GridItem>
  )
}
