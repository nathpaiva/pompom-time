import { Box, Text } from '@chakra-ui/react'
import { Variety_Enum } from '@graph/types'

import { varietyColorMap } from '../../../../utils'

interface BreathingCircleProps {
  variety: Variety_Enum
  phaseLabel: string
  statusText: string
  motionDescription: string
}

export const BreathingCircle = ({
  variety,
  phaseLabel,
  statusText,
  motionDescription,
}: BreathingCircleProps) => {
  const varietyColor = varietyColorMap[variety]

  return (
    <Box display="grid" justifyContent="center" rowGap="3">
      <Box
        width="240px"
        height="240px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="210px"
          height="210px"
          borderRadius="pompomPill"
          bg={varietyColor.background}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="1"
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
