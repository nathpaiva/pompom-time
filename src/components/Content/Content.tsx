import { GridItem } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

import { useAuth } from '../Auth'

export const Content = () => {
  const { user } = useAuth()

  console.log('user', user)

  return (
    <GridItem>
      {user && <h1>Hello, {user.user_metadata?.full_name}</h1>}
      <Outlet />
    </GridItem>
  )
}
