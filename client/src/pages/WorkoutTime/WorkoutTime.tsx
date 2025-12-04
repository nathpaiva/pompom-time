import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react'
import { Workouts } from '@graph/types'

import { useGetWorkoutById } from '../../hooks'
import { AnimatedWorkoutCircle } from './components/AnimatedWorkoutCircle'
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
  const countList = Array.from(Array(data?.squeeze), (_, index) => ++index)
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
      >
        {isShouldStartWorkout && <Text>Start workout</Text>}
        {isCountingDown && <Text>The workout will start in:</Text>}
        {isResting && <Text>Resting time:</Text>}
        {isPulsing && <Text>Workout:</Text>}

        <AnimatedWorkoutCircle
          isPulsing={isPulsing}
          isResting={isResting}
          isCountingDown={isCountingDown}
          workoutType={data?.variety}
          displayTime={counterTime}
        />

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
          {countList.map((item) => {
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
