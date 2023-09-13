import { Link as ChakraLink, GridItem, Stack } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { Link } from 'react-router-dom'

export const Navigation = () => {
  const { isLoggedIn } = useIdentityContext()

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
            sx={{ display: isLoggedIn ? 'block' : 'none' }}
          >
            logout
          </ChakraLink>
          <ChakraLink
            as={Link}
            to="login"
            sx={{ display: !isLoggedIn ? 'block' : 'none' }}
          >
            login
          </ChakraLink>
        </li>
      </Stack>
    </GridItem>
  )
}
