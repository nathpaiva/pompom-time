import { Box } from '@chakra-ui/react'

// TODO: change this value to use the theme used by the row-gap
const SPACE_ROW_GAP = '--chakra-space-5'

export function App() {
  return (
    <Box
      display="grid"
      rowGap="5"
      p="2"
      maxW="350"
      height="100vh"
      maxHeight="900"
      mt="2"
      gridTemplateRows={`80% calc(20% - var(${SPACE_ROW_GAP}))`}
      border="2px"
      borderRadius="md"
      mx="auto"
    >
      Hello
    </Box>
  )
}
