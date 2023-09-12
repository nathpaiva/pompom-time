import { Grid } from '@chakra-ui/react'

import { AuthProvider, Content, Navigation } from './components'

export function App() {
  return (
    <AuthProvider>
      <Grid templateColumns="200px 1fr" gap={6}>
        <Navigation />

        <Content />
      </Grid>
    </AuthProvider>
  )
}
