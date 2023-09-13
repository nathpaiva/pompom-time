import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { Navigate } from 'react-router-dom'

import { Greet } from './components'

const IMAGE_CONTAINER_WIDTH_SIZE = 450
const IMAGE_CONTAINER_WIDTH_SIZE_PX = `${IMAGE_CONTAINER_WIDTH_SIZE}px`

const buttonStyle = {
  position: 'absolute',
  bottom: 0,
}

export const Login = () => {
  /**
   * create container ref to have the div width
   * so can use to calculate the transform to move each children
   */
  const containerRef = useRef<HTMLDivElement>(null)
  // state to manage the form should be visible
  const [formFocus, setFormFocus] = useState<'login' | 'register'>('register')
  // state to manage the inputs
  const [loginFormData, setFormData] = useState({
    email: undefined,
    password: undefined,
  })
  const { loginUser, isLoggedIn } = useIdentityContext()

  const [errorMessage, setErrorMessage] = useState<string>()

  const onSubmitHandle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('formFocus', formFocus)
    async function login() {
      const { email, password } = loginFormData
      console.log('>>>>')
      try {
        console.log('🚀 ~ file: Login.tsx:48 ~ Login ~ password:', {
          password,
          email,
        })

        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        const user = await loginUser(email, password)
        console.log('🚀 ~ file: Login.tsx:60 ~ onSubmit={async ~ user:', user)
      } catch (err) {
        setErrorMessage('Error: ' + (err as Error).message)
      }
    }

    login()
  }

  const onChangeHandle = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const switchForm = (form: 'login' | 'register') => {
    console.log('veio')
    if (form === formFocus) return

    setFormFocus(form)
  }

  const changeStyle = useCallback(
    (offsetWidth: number) => {
      const arrElements = [...document.querySelectorAll('[data-move]')]
      const moveTo =
        formFocus === 'login' ? IMAGE_CONTAINER_WIDTH_SIZE - offsetWidth : 0

      arrElements.forEach((item) => {
        item.setAttribute('style', `transform: translateX(${moveTo}px)`)
      })
    },
    [formFocus],
  )

  useEffect(() => {
    if (!containerRef.current) return

    const { offsetWidth } = containerRef.current

    changeStyle(offsetWidth)
  }, [changeStyle])

  if (isLoggedIn) {
    return <Navigate to="/admin/workout" />
  }

  return (
    <Box
      as="section"
      position="relative"
      sx={{
        display: 'flex',
        overflow: 'hidden',
      }}
      ref={containerRef}
    >
      {/* register form control */}
      <Box
        sx={{
          bgColor: 'red.100',
          minHeight: '500px',
          minWidth: `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`,
          transition: 'transform 250ms',
        }}
        data-move
      >
        <Greet />
        <Text>Register</Text>
      </Box>

      {/* nice image */}
      <Center
        sx={{
          bg: 'purple.100',
          minWidth: IMAGE_CONTAINER_WIDTH_SIZE_PX,
          transition: 'transform 250ms',
        }}
        data-move
      >
        Nice image
      </Center>

      {/* login form control */}
      <Box
        as="form"
        onSubmit={onSubmitHandle}
        rowGap="2"
        sx={{
          bgColor: 'orange.100',
          minHeight: '500px',
          minWidth: `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`,
          transition: 'transform 250ms',
        }}
        id="login-form"
        data-move
      >
        <Greet />
        <div>
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
          <div>{errorMessage}</div>
        </div>
      </Box>

      {/* actions button */}
      <Button
        sx={{ ...buttonStyle, left: 0 }}
        onClick={() => switchForm('register')}
      >
        Register
      </Button>

      {/* TODO: disabled button when form is submitted */}
      <Button
        sx={{ ...buttonStyle, right: 0 }}
        onClick={
          formFocus !== 'login'
            ? () => {
                switchForm('login')
              }
            : undefined
        }
        type={formFocus === 'login' ? 'submit' : 'button'}
        form={formFocus === 'login' ? 'login-form' : undefined}
        isDisabled={
          formFocus === 'login' &&
          Object.values(loginFormData).includes(undefined)
        }
      >
        Login
      </Button>
    </Box>
  )
}
