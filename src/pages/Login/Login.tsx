import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { Navigate } from 'react-router-dom'

const buttonStyle = {
  position: 'absolute',
  bottom: 0,
}

export const Login = () => {
  const [formFocus, setFormFocus] = useState<'login' | 'register'>('login')

  const [loginFormData, setFormData] = useState({
    email: undefined,
    password: undefined,
  })
  const { loginUser, isLoggedIn } = useIdentityContext()

  const [msg, setMsg] = useState('')

  if (isLoggedIn) {
    return <Navigate to="/admin/workout" />
  }

  const onSubmitHandle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    async function login() {
      const { email, password } = loginFormData

      try {
        console.log('🚀 ~ file: Login.tsx:48 ~ Login ~ password:', {
          password,
          email,
        })

        if (!email || !password) {
          throw new Error('Please enter email and password')
        }

        const user = await loginUser(email, password)
        console.log('🚀 ~ file: Login.tsx:60 ~ onSubmit={async ~ user:', user)
      } catch (err) {
        console.log('🚀 ~ file: Login.tsx:38 ~ login ~ err:', err)
        setMsg('Error: ' + (err as any).message)
      }
    }

    login()
    // .then((user) => {
    //   console.log('Success! Logged in', user)
    //   navigate('/admin/workout')
    // })
    // .catch((err) => {
    //   console.error(err)
    //   console.error(err.message)
    //   setMsg('Error: ' + err.message)
    // })
  }

  const onChangeHandle = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const switchForm = (form: 'login' | 'register') => {
    if (form === formFocus) {
      console.log(`should call submit function for: ${form}`, loginFormData)
      return
    }
    setFormFocus(form)
  }

  return (
    <Stack spacing={3}>
      <Heading as="h2">Hey there,</Heading>

      <Text>Welcome to Pompom time!</Text>
      <Text>Please log in to get started on your journey to pompom time.</Text>

      <SimpleGrid
        columns={2}
        spacing={3}
        templateColumns="1fr 700px"
        position="relative"
      >
        {/* register form control */}
        <Box
          display={formFocus === 'register' ? 'block' : 'none'}
          sx={{
            bgColor: 'red.100',
            minHeight: '500px',
          }}
        >
          <Text>Register</Text>
        </Box>

        {/* nice image */}
        <Center
          sx={{
            bg: 'purple.100',
          }}
        >
          Nice image
        </Center>

        {/* login form control */}
        <Box
          as="form"
          onSubmit={onSubmitHandle}
          rowGap="2"
          display={formFocus === 'login' ? 'grid' : 'none'}
          sx={{
            bgColor: 'orange.100',
            minHeight: '500px',
          }}
        >
          <FormControl as="fieldset" rowGap="2" display="grid">
            <FormLabel>Email</FormLabel>
            <Input
              onChange={onChangeHandle}
              type="email"
              name="email"
              placeholder="Email"
            />
          </FormControl>

          <FormControl as="fieldset" rowGap="2" display="grid">
            <FormLabel>Password</FormLabel>
            <Input
              onChange={onChangeHandle}
              type="password"
              name="password"
              placeholder="Password"
            />
          </FormControl>
        </Box>

        {/* actions button */}
        <Button
          sx={{
            ...buttonStyle,
            left: 0,
          }}
          onClick={() => switchForm('register')}
        >
          Register
        </Button>
        <Button
          sx={{ ...buttonStyle, right: 0 }}
          onClick={() => switchForm('login')}
        >
          Login
        </Button>
      </SimpleGrid>

      <div>{msg}</div>
    </Stack>
  )
}
