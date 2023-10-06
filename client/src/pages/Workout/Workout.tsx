import { Card } from '@chakra-ui/react'
import { useState } from 'react'

import { Workouts } from '../../../../serverless/generated/graphql/GraphQLSchema'
import { AddWorkout, ListWorkouts } from './components'

export function Workout() {
  // TODO: change to use redux or context
  const [workouts, setWorkouts] = useState<Workouts[]>([])

  return (
    <Card display="grid" gridTemplateColumns="1fr 1fr" p="1rem" gap="15">
      <ListWorkouts workouts={workouts} setWorkouts={setWorkouts} />

      <AddWorkout setWorkouts={setWorkouts} />
    </Card>
  )
}
