import { Link as ChakraLink } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

type TLiContainer = {
  isCurrent?: boolean
  to: string
  label: string
} & (
  | {
      isAuthItem: true
      isToShowItem: boolean
    }
  | {
      isAuthItem?: false
      isToShowItem?: never
    }
)

const highlightSx = {
  bgColor: 'var(--chakra-colors-purple-300)',
  color: 'purple.800',
  fontWeight: '600',
}

export const LiContainer = ({
  isCurrent,
  isAuthItem,
  isToShowItem = true,
  to: path,
  label,
}: TLiContainer) => {
  return (
    <Box
      as="li"
      textAlign="center"
      sx={{
        p: '0.2rem 0.5rem',
        borderRadius: '2',
        ...(isAuthItem && isToShowItem
          ? { display: 'block' }
          : isAuthItem && !isToShowItem
          ? { display: 'none' }
          : { display: 'block' }),

        ...(isCurrent && highlightSx),

        transition: 'background-color 0.2s ease-in-out',

        a: {
          display: 'block',
        },

        ':hover': highlightSx,
      }}
    >
      <ChakraLink _hover={{ textDecor: 'none' }} as={Link} to={path}>
        {label}
      </ChakraLink>
    </Box>
  )
}
