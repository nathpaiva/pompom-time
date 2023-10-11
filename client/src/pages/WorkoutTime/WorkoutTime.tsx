import { Box, Button, Heading, Spinner, Text } from '@chakra-ui/react'

import { EnumWorkoutType } from '../../../../serverless/functions/add-workout-by-user/types'
import { Workouts } from '../../../../serverless/functions/delete-workout-by-id/types'
import { useGetWorkoutById } from '../../hooks'
import { usePulse } from '../Workout/hooks'

export const WorkoutTime = () => {
  const { data, isLoading } = useGetWorkoutById<Workouts>()
  const {
    counter,
    pulseInterval,
    isPulsing,
    handleStartStopPulse,
    isResting,
    restingInterval,
    isCountingDown,
    countingDownInterval,
  } = usePulse({
    interval: data?.interval,
    squeeze: data?.squeeze,
    repeat: data?.repeat,
    rest: data?.rest,
    sets: data?.goal_per_day,
    type: data?.type as EnumWorkoutType,
  })

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Box>
      <Heading>
        {data?.name}: {data?.type}
      </Heading>
      Workout: {counter} / {data?.goal_per_day}
      <Box
        display="grid"
        rowGap="5"
        p="2"
        maxW="350"
        height="100vh"
        maxHeight="900"
        mt="2"
        border="2px"
        borderRadius="md"
        mx="auto"
        sx={{
          position: 'relative',
          '::after': {
            content: `" "`,
            position: 'absolute',
            width: '100%',
            height: '90%',
            animation: isCountingDown ? 'blinking 1s infinite .1s' : undefined,
            opacity: isCountingDown ? 1 : 0,
            transition: 'opacity .5s',
          },
          '@keyframes blinking': {
            '0%': {
              backgroundColor: '#b794f4',
            },
            '100%': {
              backgroundColor: '#44337a',
            },
          },
        }}
      >
        <Box
          w="150px"
          h="150px"
          // change color to each state
          bgGradient="radial(gray.300, yellow.400, pink.200)"
          borderRadius={100}
          margin="auto"
          display="flex"
          justifyContent="center"
          alignItems="center"
          opacity={isPulsing || isResting ? 1 : 0}
          transition="opacity .5s"
        >
          {!isResting && (
            <Text variant="span" fontSize="2xl">
              pulse {pulseInterval}
            </Text>
          )}
          {isResting && (
            <Text variant="span" fontSize="2xl">
              resting {restingInterval}
            </Text>
          )}
        </Box>

        <Text variant="span" fontSize="2xl" zIndex="9999">
          {isCountingDown && <> will start in: {countingDownInterval}</>}
          {!isCountingDown && !isResting && !isPulsing && (
            <> Start your workout</>
          )}
        </Text>

        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          columnGap="5"
          alignItems="end"
          height="auto"
        >
          <Button
            isDisabled={isPulsing || isResting}
            onClick={handleStartStopPulse}
            colorScheme="purple"
          >
            Start pulse
          </Button>

          <Button
            isDisabled={!isPulsing || isResting}
            onClick={handleStartStopPulse}
            colorScheme="pink"
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
