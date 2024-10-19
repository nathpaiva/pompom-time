import { Grid } from '@chakra-ui/react'

import { Content, Navigation } from './components'

export function App() {
  return (
    <>
      <Grid templateColumns="1fr" gap={6}>
        <Content />
        <Navigation />
      </Grid>
    </>
  )
}
