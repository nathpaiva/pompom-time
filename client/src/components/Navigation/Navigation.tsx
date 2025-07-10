import { Grid, GridItem } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { useLocation } from 'react-router-dom'

import { LiContainer } from './components'

export const Navigation = () => {
  const { pathname } = useLocation()
  const { isLoggedIn, isConfirmedUser } = useIdentityContext()

  return (
    <GridItem as="nav" p="3">
      <Grid as="ul" templateColumns="1fr 1fr" gap="1">
        <LiContainer
          isAuthItem
          label="about"
          isCurrent={pathname === '/'}
          to="/"
          isToShowItem={!isLoggedIn}
        />

        <LiContainer
          label="workout time"
          to="admin/workout"
          isCurrent={!pathname.indexOf('/admin/workout')}
          isToShowItem={isLoggedIn && isConfirmedUser}
          isAuthItem
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
      </Grid>
    </GridItem>
  )
}
