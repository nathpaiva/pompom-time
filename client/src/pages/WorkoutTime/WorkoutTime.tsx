import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Heading, IconButton, Spinner, Text } from '@chakra-ui/react'
import { Variety_Enum, Workouts } from '@graph/types'
import { Link } from 'react-router-dom'

import { useGetWorkoutById } from '../../hooks'
import {
  BreathingCircle,
  RepDots,
  VarietySwitcher,
  WorkoutControls,
} from './components'
import { motionDescriptionByVariety } from './constants'
import { usePhaseAnimation, usePulse, useWorkoutPhaseDisplay } from './hooks'
import { ACTIVE_PHASES } from './hooks/usePulse/phaseMath'

export const WorkoutTime = () => {
  const { data, isLoading } = useGetWorkoutById<Workouts>()
  const pulse = usePulse(data)
  const {
    phaseLabel,
    statusText,
    completedReps,
    primaryLabel,
    isPrimaryDisabled,
    isResetDisabled,
  } = useWorkoutPhaseDisplay(pulse, data)

  const holdSeconds =
    data?.variety === Variety_Enum.Resistance ? (data.interval ?? 0) : 0

  const animation = usePhaseAnimation(
    pulse.phase,
    pulse.phaseStartedAt,
    pulse.isPaused,
    data?.variety ?? Variety_Enum.Pulse,
    pulse.repIndex,
    holdSeconds,
  )

  if (isLoading || !data) {
    return <Spinner />
  }

  const currentSet =
    pulse.phase === 'done'
      ? data.goal_per_day
      : Math.min(pulse.setIndex + 1, data.goal_per_day)

  const animatedStyle = ACTIVE_PHASES.includes(pulse.phase)
    ? { ...animation, showRing: pulse.phase === 'hold' }
    : undefined

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
        animatedStyle={animatedStyle}
      />

      <RepDots
        totalReps={data.squeeze}
        completedReps={completedReps}
        variety={data.variety}
      />

      <WorkoutControls
        primaryLabel={primaryLabel}
        isPrimaryDisabled={isPrimaryDisabled}
        isResetDisabled={isResetDisabled}
        onPrimaryClick={pulse.handleStartStopPulse}
        onResetClick={pulse.handleReset}
      />
    </Box>
  )
}
