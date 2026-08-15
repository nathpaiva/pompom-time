import { Box, Button } from '@chakra-ui/react'

interface WorkoutControlsProps {
  primaryLabel: string
  isPrimaryDisabled: boolean
  isResetDisabled: boolean
  onPrimaryClick: () => void
  onResetClick: () => void
}

export const WorkoutControls = ({
  primaryLabel,
  isPrimaryDisabled,
  isResetDisabled,
  onPrimaryClick,
  onResetClick,
}: WorkoutControlsProps) => {
  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" columnGap="4">
      <Button
        onClick={onPrimaryClick}
        isDisabled={isPrimaryDisabled}
        bg="pompom.primary"
        color="white"
        _hover={{ bg: 'pompom.primary' }}
        borderRadius="pompomPill"
      >
        {primaryLabel}
      </Button>

      <Button
        onClick={onResetClick}
        isDisabled={isResetDisabled}
        variant="outline"
        borderColor="pompom.primary"
        color="pompom.primary"
        borderRadius="pompomPill"
      >
        Reset
      </Button>
    </Box>
  )
}
