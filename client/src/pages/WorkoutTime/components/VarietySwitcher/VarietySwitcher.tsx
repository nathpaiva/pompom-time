import { Box } from '@chakra-ui/react'
import { Variety_Enum } from '@graph/types'

import { varietyColorMap } from '../../../../utils'

interface VarietySwitcherProps {
  activeVariety: Variety_Enum
}

export const VarietySwitcher = ({ activeVariety }: VarietySwitcherProps) => {
  return (
    <Box display="flex" justifyContent="center" gap="2">
      {Object.values(Variety_Enum).map((variety) => {
        const isActive = variety === activeVariety
        const varietyColor = varietyColorMap[variety]

        return (
          <Box
            key={variety}
            aria-current={isActive || undefined}
            px="3"
            py="1"
            borderRadius="pompomPill"
            fontFamily="heading"
            fontWeight="700"
            fontSize="11px"
            textTransform="capitalize"
            bg={isActive ? varietyColor.background : 'transparent'}
            color={isActive ? varietyColor.text : 'pompom.text'}
            border="1.5px solid"
            borderColor={isActive ? varietyColor.background : 'pompom.border'}
          >
            {variety}
          </Box>
        )
      })}
    </Box>
  )
}
