import { FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'

export const Login = () => {
  return (
    <Stack as="form" spacing={3}>
      <FormControl isRequired id="user-name">
        <FormLabel>Username:</FormLabel>
        <Input placeholder="username" />
      </FormControl>

      <FormControl isRequired id="password">
        <FormLabel>Password:</FormLabel>
        <Input placeholder="password" type="password" />
      </FormControl>
    </Stack>
  )
}
