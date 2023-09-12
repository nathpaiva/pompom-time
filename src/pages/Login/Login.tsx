import { Button, Stack } from '@chakra-ui/react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../../components'

export const Login = () => {
  const { user, handleLoggedIn: handlerLoggedIn } = useAuth()

  if (user) {
    return <Navigate to="/admin/workout" />
  }

  return (
    <Stack spacing={3}>
      <Button onClick={handlerLoggedIn}>Login</Button>
    </Stack>
  )
}
