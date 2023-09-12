import { Link as ChakraLink, GridItem, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { useAuth } from '../Auth'

export const Navigation = () => {
  const { user } = useAuth()

  return (
    <GridItem as="nav" p="3">
      <Stack spacing={2} as="ul">
        <li>
          <ChakraLink as={Link} to="admin/workout">
            workout time
          </ChakraLink>
        </li>
        <li>
          <ChakraLink as={Link} to="#">
            (TBD) insights
          </ChakraLink>
        </li>
        <li>
          <ChakraLink
            as={Link}
            to="logout"
            sx={{ display: user ? 'block' : 'none' }}
          >
            logout
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="login"
            sx={{ display: !user ? 'block' : 'none' }}
          >
            login
          </ChakraLink>
        </li>
      </Stack>
    </GridItem>
  )
}
