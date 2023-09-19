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
      sx={{
        p: '0.2rem 0.5rem',
        borderRadius: '2',
        ...(isAuthItem && isToShowItem
          ? { display: 'block' }
          : isAuthItem && !isToShowItem
          ? { display: 'none' }
          : { display: 'block' }),

        ...(isCurrent && {
          bgColor: 'purple.100',
          color: 'purple.800',
          fontWeight: '600',
        }),

        transition: 'background-color 0.2s ease-in-out',

        a: {
          display: 'block',
        },

        ':hover': {
          bgColor: 'purple.100',
        },
      }}
    >
      <ChakraLink _hover={{ textDecor: 'none' }} as={Link} to={path}>
        {label}
      </ChakraLink>
    </Box>
  )
}
