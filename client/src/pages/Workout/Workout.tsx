import { Card } from '@chakra-ui/react'

import { ListWorkouts } from './components'

export function Workout() {
  return (
    <Card display="grid" gridTemplateColumns="1fr" p="1rem" gap="15">
      <ListWorkouts />
    </Card>
  )
}
