import { Box, Button, ChakraProvider, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'

const PULSE_LIMIT = 20
const PULSE_INTERVAL = 500
// TODO: change this value to use the theme used by the row-gap
const SPACE_ROW_GAP = '--chakra-space-5'

function App() {
  const [startPulse, setStartPulse] = useState(false)
  const [internalPulse, setInternalPulse] = useState(1)
  const interval = useRef<NodeJS.Timeout>()

  const pulseTimer = useCallback(() => {
    let pulse = 1

    if (interval.current && !startPulse) {
      pulse = 1
      clearInterval(interval.current)
      setInternalPulse(pulse)
      return
    }

    interval.current = setInterval(() => {
      if (pulse === PULSE_LIMIT || !startPulse) {
        clearInterval(interval.current)
        setStartPulse(false)
      }

      pulse += 1
      setInternalPulse(pulse)
    }, PULSE_INTERVAL)
  }, [startPulse])

  const handleStartStopPulse = useCallback(() => {
    setStartPulse((prev) => !prev)
  }, [])

  useEffect(() => {
    pulseTimer()
  }, [startPulse, pulseTimer])

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
          pulse {internalPulse}
        </Text>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        columnGap="5"
        alignItems="end"
        height="auto"
      >
        <Button
          isDisabled={startPulse}
          onClick={handleStartStopPulse}
          colorScheme="purple"
        >
          Start pulse
        </Button>

        <Button
          isDisabled={!startPulse}
          onClick={handleStartStopPulse}
          colorScheme="pink"
        >
          Reset
        </Button>
      </Box>
    </Box>
  )
}

function WrapperApp() {
  return (
    <ChakraProvider>
      <App />
    </ChakraProvider>
  )
}

export default WrapperApp
