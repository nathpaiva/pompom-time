import { Box, Button, ButtonGroup, Text } from '@chakra-ui/react'

import { usePulse } from './hooks'

// TODO: change this value to use the theme used by the row-gap
const SPACE_ROW_GAP = '--chakra-space-5'

export function Workout() {
  const { pulseInterval, isPulseStarted, handleStartStopPulse } = usePulse()

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
      <Box
        w="150px"
        h="150px"
        bgGradient="radial(gray.300, yellow.400, pink.200)"
        borderRadius={100}
        margin="auto"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text variant="span" fontSize="2xl">
          pulse {pulseInterval}
        </Text>
      </Box>

      <ButtonGroup
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        columnGap="5"
        alignItems="end"
        height="auto"
      >
        <Button
          isDisabled={isPulseStarted}
          onClick={handleStartStopPulse}
          colorScheme="purple"
        >
          Start pulse
        </Button>

        <Button
          isDisabled={!isPulseStarted}
          onClick={handleStartStopPulse}
          colorScheme="pink"
        >
          Reset
        </Button>
      </ButtonGroup>
    </Box>
  )
}
