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
      <Heading>{data?.name}</Heading>
      Workout: {counter} / {data?.goal_per_day}
      {data?.repeat && <p>Time will rest: {restingInterval}</p>}
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
          // opacity={isResting ? 0 : 1}
          // transition="opacity .5s"
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
