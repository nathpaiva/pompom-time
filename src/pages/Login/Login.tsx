import { Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../../components'

export const Login = () => {
  const { user, handleLoggedIn } = useAuth()

  if (user) {
    return <Navigate to="/admin/workout" />
  }

  return (
    <Stack spacing={3}>
      <Heading as="h2">Hey there,</Heading>
      <Text>Welcome to Pompom time!</Text>
      <Text>Please log in to get started on your journey to pompom time.</Text>

      <Button
        onClick={handleLoggedIn}
        colorScheme="purple"
        maxWidth="200"
        width="100%"
        alignSelf="center"
      >
        Let's go!
      </Button>
    </Stack>
  )
}
