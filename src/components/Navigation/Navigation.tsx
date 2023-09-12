import { Box, GridItem, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { useAuth } from '../Auth'

export const Navigation = () => {
  const { user } = useAuth()

  return (
    <GridItem as="nav">
      <Stack spacing={2} as="ul">
        <li>
          <Link to="admin/workout">workout</Link>
        </li>
        <li>
          <Box as={Link} to="logout" sx={{ display: user ? 'block' : 'none' }}>
            logout
          </Box>
          <Box as={Link} to="login" sx={{ display: !user ? 'block' : 'none' }}>
            login
          </Box>
        </li>
      </Stack>
    </GridItem>
  )
}
