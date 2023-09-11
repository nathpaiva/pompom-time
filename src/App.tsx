import { Grid, GridItem } from '@chakra-ui/react'
import { Outlet, useNavigation } from 'react-router-dom'

import { Navigation } from './components'

export function App() {
  const navigation = useNavigation()

  console.log('🚀 ~ file: App.tsx:12 ~ App ~ navigation:', navigation)
  return (
    <Grid templateColumns="200px 1fr" gap={6}>
      <Navigation />

      <GridItem>
        <h1>Hello... My main page</h1>
        <Outlet />
      </GridItem>
    </Grid>
  )
}
