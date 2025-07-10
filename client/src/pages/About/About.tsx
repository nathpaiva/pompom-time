import { Stack, Heading, Text } from '@chakra-ui/react'

export function About(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Heading as="h4" size="lg">
        This app is still under construction.
      </Heading>
      <Text>
        The purpose is to have a place where you can control and see your
        progress doing pompoarism workout.
      </Text>
      <Text>Welcome page!</Text>
    </Stack>
  )
}
