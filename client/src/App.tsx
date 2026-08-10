import { Grid } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { useLocation } from 'react-router-dom'

import { Content, Navigation } from './components'

const PUBLIC_SCREEN_PATHS_WITHOUT_NAV = ['/', '/login']

export function App() {
  const { pathname } = useLocation()
  const { isLoggedIn, isConfirmedUser } = useIdentityContext()

  const isPublicScreenWithOwnNav =
    PUBLIC_SCREEN_PATHS_WITHOUT_NAV.includes(pathname) &&
    !(isLoggedIn && isConfirmedUser)

  return (
    <Grid templateColumns="1fr" gap={6}>
      <Content />
      {!isPublicScreenWithOwnNav && <Navigation />}
    </Grid>
  )
}
