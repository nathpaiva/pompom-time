import { Box, Text } from '@chakra-ui/react'

import { Variety_Enum } from '../../types'

interface AnimatedWorkoutCircleProps {
  /**
   * Whether the workout is currently in the squeeze/pulse phase
   */
  isPulsing: boolean
  /**
   * Whether the workout is currently in the rest phase
   */
  isResting: boolean
  /**
   * Whether the workout is in countdown phase before starting
   */
  isCountingDown: boolean
  /**
   * The type of workout (pulse, resistance, strength, intensity)
   * Determines which animation style to use
   */
  workoutType: Variety_Enum | null | undefined
  /**
   * The time or count to display inside the circle
   */
  displayTime: string | number
}

/**
 * Animated circle component that visually represents workout timing.
 * Different workout types have different animation behaviors:
 * - Pulse: Breathing/pulsing animation
 * - Resistance/Strength: Force/resistance animation with vertical movement
 * - Intensity: Similar to pulse
 */
export const AnimatedWorkoutCircle = ({
  isPulsing,
  isResting,
  isCountingDown,
  workoutType,
  displayTime,
}: AnimatedWorkoutCircleProps) => {
  // Determine which animation to use based on workout phase and type
  const getAnimation = (): string => {
    if (isCountingDown) {
      return '1s blinking .1s infinite'
    }

    if (isPulsing && workoutType) {
      switch (workoutType) {
        case Variety_Enum.Pulse:
        case Variety_Enum.Intensity:
          return 'pulseAnimation 500ms infinite alternate-reverse'
        case Variety_Enum.Resistance:
        case Variety_Enum.Strength:
          return 'resistanceAnimation 1.4s infinite'
        default:
          return ''
      }
    }

    return ''
  }

  // Determine animation keyframes based on workout type
  const getKeyframes = () => {
    if (isCountingDown) {
      return {
        '@keyframes blinking': {
          '0%': {
            backgroundColor: 'pink.200',
          },
          '100%': {
            backgroundColor: 'yellow.400',
          },
        },
      }
    }

    if (isPulsing && workoutType) {
      switch (workoutType) {
        case Variety_Enum.Pulse:
        case Variety_Enum.Intensity:
          return {
            '@keyframes pulseAnimation': {
              '0%': {
                transform: 'scale(0.9)',
                backgroundColor: 'pink.200',
              },
              '100%': {
                transform: 'scale(1.1)',
                backgroundColor: 'pink.400',
              },
            },
          }
        case Variety_Enum.Resistance:
        case Variety_Enum.Strength:
          return {
            '@keyframes resistanceAnimation': {
              '0%': {
                transform: 'translateY(0%)',
                backgroundColor: 'pink.200',
              },
              '7.142%': {
                transform: 'translateY(-100%)',
                backgroundColor: 'pink.400',
              },
              '90%': {
                transform: 'translateY(-100%)',
                backgroundColor: 'pink.400',
              },
              '99%': {
                transform: 'translateY(-10%)',
                backgroundColor: 'pink.300',
              },
              '100%': {
                transform: 'translateY(0%)',
                backgroundColor: 'pink.200',
              },
            },
          }
        default:
          return {}
      }
    }

    return {}
  }

  return (
    <Box
      w="150px"
      h="150px"
      bgColor="pink.200"
      borderRadius={100}
      margin="auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
      animation={getAnimation()}
      // sx={getKeyframes()}
    >
      <Text variant="span" fontSize="2xl" textAlign="center">
        {displayTime}
      </Text>
    </Box>
  )
}
