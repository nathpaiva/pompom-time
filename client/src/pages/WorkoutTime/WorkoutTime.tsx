import { Box, Button, Heading, Spinner, Text } from '@chakra-ui/react'

import { EnumWorkoutType } from '../../../../serverless/functions/add-workout-by-user/types'
import { Workouts } from '../../../../serverless/functions/delete-workout-by-id/types'
import { useGetWorkoutById } from '../../hooks'
import { usePulse } from '../Workout/hooks'

export const WorkoutTime = () => {
  const { data, isLoading, error } = useGetWorkoutById<Workouts>()
  const {
    counter,
    pulseInterval,
    isPulseStarted,
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
  // console.log(
  //   '🚀 ~ file: WorkoutTime.tsx:5 ~ WorkoutTime ~ data:',
  //   data,
  //   isLoading,
  // )
  if (isLoading) {
    return <Spinner />
  }

  return (
    <Box>
      <Heading>{data?.name}</Heading>
      Já foram: {counter}
      {isResting && <p>Is resting {restingInterval}</p>}
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

        <Box
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
        </Box>
      </Box>
    </Box>
  )
}
