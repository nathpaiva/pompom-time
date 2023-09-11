import { GridItem, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const Navigation = () => {
  return (
    <GridItem as="nav">
      <Stack spacing={2} as="ul">
        <li>
          <Link to="login">login</Link>
        </li>
        <li>
          <Link to="workout">workout</Link>
        </li>
      </Stack>
    </GridItem>
  )
}
