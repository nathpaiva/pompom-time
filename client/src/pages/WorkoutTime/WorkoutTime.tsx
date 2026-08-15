import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Heading, IconButton, Spinner, Text } from '@chakra-ui/react'
import { Workouts } from '@graph/types'
import { Link } from 'react-router-dom'

import { useGetWorkoutById } from '../../hooks'
import {
  BreathingCircle,
  RepDots,
  VarietySwitcher,
  WorkoutControls,
} from './components'
import { motionDescriptionByVariety } from './constants'
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
  } = usePulse(data)

  if (isLoading || !data) {
    return <Spinner />
  }

  const phase = isCountingDown
    ? 'countdown'
    : isResting
      ? 'resting'
      : isPulsing
        ? 'active'
        : 'idle'

  const phaseLabel = {
    countdown: 'Get ready',
    resting: 'Resting',
    active: 'Squeeze',
    idle: 'Ready',
  }[phase]

  const statusText = {
    countdown: String(countingDownInterval),
    resting: String(restingInterval),
    active: String(pulseInterval),
    idle: `0/${data.squeeze}`,
  }[phase]

  // the set that just finished stays fully marked during its rest period
  const completedReps =
    phase === 'active' ? pulseInterval : phase === 'resting' ? data.squeeze : 0

  const currentSet = Math.min(counter + 1, data.goal_per_day)

  return (
    <Box display="grid" rowGap="5" p="4" maxW="350" mx="auto">
      <Box display="flex" alignItems="center" gap="3">
        <IconButton
          as={Link}
          to="/admin/workout"
          aria-label="Back"
          icon={<ArrowBackIcon />}
          variant="ghost"
        />
        <Box>
          <Heading fontFamily="heading" fontWeight="700" fontSize="17px">
            {data.name}
          </Heading>
          <Text fontSize="12px" color="pompom.textMuted">
            Set {currentSet} of {data.goal_per_day}
          </Text>
        </Box>
      </Box>

      <VarietySwitcher activeVariety={data.variety} />

      <BreathingCircle
        variety={data.variety}
        phaseLabel={phaseLabel}
        statusText={statusText}
        motionDescription={motionDescriptionByVariety[data.variety]}
      />

      <RepDots
        totalReps={data.squeeze}
        completedReps={completedReps}
        variety={data.variety}
      />

      <WorkoutControls
        primaryLabel={isPulsing ? 'Pause' : 'Start workout'}
        isPrimaryDisabled={phase === 'countdown' || phase === 'resting'}
        isResetDisabled={phase === 'idle'}
        onPrimaryClick={handleStartStopPulse}
        onResetClick={handleStartStopPulse}
      />
    </Box>
  )
}
