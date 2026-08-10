import { Heading, Stack, Text } from '@chakra-ui/react'

export const Greet = () => {
  return (
    <Stack spacing={1} mb={4}>
      <Heading
        as="h2"
        fontFamily="heading"
        fontWeight="700"
        fontSize="24px"
        color="pompom.text"
      >
        Welcome back
      </Heading>

      <Text fontFamily="body" fontSize="14px" color="pompom.textMuted">
        Sign in to continue your workouts
      </Text>
    </Stack>
  )
}
