import { Box, VisuallyHidden } from '@chakra-ui/react'
import { Variety_Enum } from '@graph/types'

import { varietyColorMap } from '../../../../utils'

interface RepDotsProps {
  totalReps: number
  completedReps: number
  variety: Variety_Enum
}

export const RepDots = ({
  totalReps,
  completedReps,
  variety,
}: RepDotsProps) => {
  const varietyColor = varietyColorMap[variety]
  const reps = Array.from({ length: totalReps }, (_, index) => index + 1)

  return (
    <Box as="ul" display="flex" justifyContent="center" gap="2" flexWrap="wrap">
      {reps.map((rep) => {
        const isCompleted = rep <= completedReps

        return (
          <Box
            key={rep}
            as="li"
            data-completed={isCompleted}
            height="8px"
            width="8px"
            borderRadius="pompomPill"
            bg={isCompleted ? varietyColor.background : 'transparent'}
            border="1.5px solid"
            borderColor={
              isCompleted ? varietyColor.background : 'pompom.border'
            }
          >
            <VisuallyHidden>{rep}</VisuallyHidden>
          </Box>
        )
      })}
    </Box>
  )
}
