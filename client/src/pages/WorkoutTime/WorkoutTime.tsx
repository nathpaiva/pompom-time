import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react'

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
    ? ''
    : isCountingDown
    ? countingDownInterval // counting interval
    : isResting
    ? restingInterval // resting interval
    : pulseInterval // pulsing interval

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Box>
      <Heading>
        {data?.name}: {data?.variety}
      </Heading>

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
        sx={{
          '@keyframes blinking': {
            '0%': {
              backgroundColor: 'pink.200',
            },
            '100%': {
              backgroundColor: 'yellow.400',
            },
          },
        }}
      >
        {isShouldStartWorkout && <Text>Start workout</Text>}
        {isCountingDown && <Text>The workout will start in:</Text>}
        {isResting && <Text>Resting time:</Text>}
        {isPulsing && <Text>Workout:</Text>}

        <Box
          w="150px"
          h="150px"
          bgGradient={
            isPulsing ? 'radial(gray.300, yellow.400, pink.200)' : 'none'
          }
          bgColor="pink.200"
          borderRadius={100}
          margin="auto"
          display="flex"
          justifyContent="center"
          alignItems="center"
          animation={
            isCountingDown
              ? '1s blinking .1s infinite'
              : isPulsing && data?.variety
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

        <Text align="center">
          Workout: {counter} / {data?.goal_per_day}
        </Text>

        <Box
          as="ul"
          display="flex"
          justifyContent="center"
          gap="10px"
          flexWrap="wrap"
        >
          {Array.from(Array(20), (_, index) => ++index).map((item) => {
            return (
              <Box
                key={item}
                as="li"
                height="10px"
                width="10px"
                bgColor={
                  (pulseInterval === item || pulseInterval > item) && isPulsing
                    ? 'pink'
                    : 'transparent'
                }
                border={
                  pulseInterval !== item || pulseInterval < item || !isPulsing
                    ? '1px solid pink'
                    : ''
                }
                borderRadius="100%"
              >
                <VisuallyHidden>{item}</VisuallyHidden>
              </Box>
            )
          })}
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
