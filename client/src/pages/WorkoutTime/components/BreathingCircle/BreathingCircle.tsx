import { Box, Text } from '@chakra-ui/react'
import { Variety_Enum } from '@graph/types'

import { varietyColorMap } from '../../../../utils'
import { ProgressRing } from '../ProgressRing'

interface AnimatedStyle {
  scale: number
  color: string
  translateY: number
  ringOffset: number
  showRing: boolean
}

interface BreathingCircleProps {
  variety: Variety_Enum
  phaseLabel: string
  statusText: string
  motionDescription: string
  animatedStyle?: AnimatedStyle
}

export const BreathingCircle = ({
  variety,
  phaseLabel,
  statusText,
  motionDescription,
  animatedStyle,
}: BreathingCircleProps) => {
  const varietyColor = varietyColorMap[variety]
  const backgroundColor = animatedStyle?.color ?? varietyColor.background
  const transform = animatedStyle
    ? `scale(${animatedStyle.scale}) translateY(${animatedStyle.translateY}px)`
    : undefined

  return (
    <Box display="grid" justifyContent="center" rowGap="3">
      <Box
        width="240px"
        height="240px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {animatedStyle && animatedStyle.showRing && (
          <ProgressRing
            ringOffset={animatedStyle.ringOffset}
            color={varietyColor.background}
          />
        )}
        <Box
          width="210px"
          height="210px"
          borderRadius="pompomPill"
          bg={backgroundColor}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="1"
          style={{ transform }}
        >
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize="11px"
            textTransform="uppercase"
            color="white"
            opacity="0.8"
          >
            {phaseLabel}
          </Text>
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize="38px"
            color="white"
          >
            {statusText}
          </Text>
        </Box>
      </Box>

      <Text fontSize="13px" color="pompom.textMuted" textAlign="center">
        {motionDescription}
      </Text>
    </Box>
  )
}
