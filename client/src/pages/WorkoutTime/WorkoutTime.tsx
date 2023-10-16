import { Box, Button, Heading, Spinner, Text } from '@chakra-ui/react'

import { Workouts } from '../../../../serverless/generated/graphql/GraphQLSchema'
import { useGetWorkoutById } from '../../hooks'
import { usePulse } from './hooks'
import type { TWorkoutAnimation } from './types'

const animationByWorkoutType: TWorkoutAnimation = {
  strength: {
    animation: '750ms infinite alternate bounce',
    keyframes: {
      '@keyframes bounce': {
        '0%': {
          transform: 'translateY(100%)',
        },
        '20%': {
          transform: 'translateY(100%)',
        },
        '50%': {
          transform: 'translateY(0%)',
        },
        '100%': {
          transform: 'translateY(0%)',
        },
      },
    },
  },
  pulse: {
    animation: '250ms infinite alternate-reverse pulse',
    keyframes: {
      '@keyframes pulse': {
        '0%': {
          width: '30%',
        },
        '100%': {
          width: '150px',
        },
      },
    },
  },
  intensity: {
    animation: '',
    keyframes: {},
  },
  resistance: {
    animation: '',
    keyframes: {},
  },
}

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

  const textToShow = isShouldStartWorkout
    ? `Start your workout`
    : isCountingDown
    ? `will start in: ${countingDownInterval}`
    : isResting
    ? `resting ${restingInterval}`
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
          <Text variant="span" fontSize="2xl">
            {textToShow}
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
