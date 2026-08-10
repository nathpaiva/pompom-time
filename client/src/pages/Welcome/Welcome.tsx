import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export const Welcome = () => {
  return (
    <Stack align="center" spacing={6} py={10} textAlign="center">
      <Box position="relative" w="180px" h="180px">
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="180px"
          h="180px"
          borderRadius="full"
          bg="pompom.quaternary"
          opacity={0.55}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="128px"
          h="128px"
          borderRadius="full"
          bg="pompom.tertiary"
          opacity={0.65}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="78px"
          h="78px"
          borderRadius="full"
          bg="pompom.primary"
        />
      </Box>

      <Stack spacing={1} align="center">
        <Heading
          as="p"
          fontFamily="heading"
          fontWeight="700"
          fontSize="34px"
          color="pompom.primary"
        >
          pompom
        </Heading>
        <Text
          fontFamily="heading"
          fontWeight="700"
          fontSize="13px"
          color="pompom.tertiary"
          letterSpacing="0.24em"
          textTransform="uppercase"
        >
          time
        </Text>
      </Stack>

      <Text
        fontFamily="body"
        fontSize="15px"
        color="pompom.textMuted"
        lineHeight="1.6"
        maxW="250px"
      >
        Get to know, strengthen, and track your pelvic floor, at your own pace.
      </Text>

      <Stack spacing={4} align="center" w="full" maxW="280px">
        <Button
          as={RouterLink}
          to="/login"
          w="full"
          borderRadius="pompomPill"
          bg="pompom.tertiary"
          color="white"
          fontFamily="heading"
          fontWeight="700"
          fontSize="16px"
          py={4}
          _hover={{ bg: 'pompom.tertiary' }}
        >
          Get started
        </Button>

        <Button
          as={RouterLink}
          to="/login"
          variant="link"
          color="pompom.primary"
          fontFamily="heading"
          fontWeight="700"
          fontSize="14px"
        >
          I already have an account
        </Button>
      </Stack>
    </Stack>
  )
}
