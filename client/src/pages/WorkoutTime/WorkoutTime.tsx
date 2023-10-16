import { Box, Button, Heading, Spinner, Text } from '@chakra-ui/react'

import { Workouts } from '../../../../serverless/generated/graphql/GraphQLSchema'
import { useGetWorkoutById } from '../../hooks'
import { animationByWorkoutType } from './animationTime'
import { usePulse } from './hooks'

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
    interval: data?.interval ?? null,
    squeeze: data?.squeeze,
    repeat: data?.repeat,
    rest: data?.rest,
    sets: data?.goal_per_day,
    variety: data?.variety,
  })
  const isShouldStartWorkout = !isCountingDown && !isResting && !isPulsing

  const counterTime = isShouldStartWorkout
    ? ` `
    : isCountingDown
    ? countingDownInterval // counting interval
    : isResting
    ? restingInterval // resting interval
    : pulseInterval

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Box>
      <Heading>
        {data?.name}: {data?.variety}
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
        position="relative"
        gridTemplateRows="40px 1fr"
      >
        {isShouldStartWorkout && <Text>Start workout</Text>}
        {isCountingDown && <Text>The workout will start in:</Text>}
        {isResting && <Text>Resting time:</Text>}
        {isPulsing && <Text>Workout:</Text>}

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
          animation={
            isPulsing && data?.variety
              ? animationByWorkoutType[data.variety].animation
              : ''
          }
          sx={{
            ...(isPulsing && data?.variety
              ? animationByWorkoutType[data.variety].keyframes
              : {}),
          }}
        >
          <Text variant="span" fontSize="2xl" textAlign="center">
            {counterTime}
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
            isDisabled={isPulsing || isResting || isCountingDown}
            onClick={handleStartStopPulse}
            colorScheme="purple"
          >
            Start workout
          </Button>

          <Button
            isDisabled={!isPulsing || isResting || isCountingDown}
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
