import { Box, Link as ChakraLink, GridItem, Stack } from '@chakra-ui/react'
import { useIdentityContext } from 'react-netlify-identity'
import { Link } from 'react-router-dom'

const loggedStyle = (check: boolean) => ({
  display: check ? 'block' : 'none',
})

export const Navigation = () => {
  const { isLoggedIn } = useIdentityContext()

  return (
    <GridItem as="nav" p="3">
      <Stack spacing={2} as="ul">
        <Box as="li" sx={loggedStyle(isLoggedIn)}>
          <ChakraLink as={Link} to="admin/workout">
            workout time
          </ChakraLink>
        </Box>
        <Box as="li" sx={loggedStyle(isLoggedIn)}>
          <ChakraLink as={Link} to="#">
            (TBD) insights
          </ChakraLink>
        </Box>
        <Box as="li" sx={loggedStyle(isLoggedIn)}>
          <ChakraLink as={Link} to="logout">
            logout
          </ChakraLink>
        </Box>
        <Box as="li" sx={loggedStyle(!isLoggedIn)}>
          <ChakraLink as={Link} to="login">
            login
          </ChakraLink>
        </Box>
      </Stack>
    </GridItem>
  )
}
