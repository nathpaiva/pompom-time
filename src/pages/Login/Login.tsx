import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
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

const FormComponent = ({
  onChangeHandle,
  errorMessage,
  formType,
}: {
  onChangeHandle: (e: FormEvent<HTMLInputElement>) => void
  errorMessage?: string
  formType: TFormType
}) => (
  <div>
    {formType === 'register' && (
      <FormControl as="fieldset" rowGap="2" display="grid">
        <FormLabel>Full name</FormLabel>
        <Input
          onChange={onChangeHandle}
          type="name"
          name="fullName"
          placeholder="name"
        />
      </FormControl>
    )}

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
    {/* if is login should show recover pass button */}
    {formType === 'login' && (
      <Button
        onClick={() => {
          console.log('>>>>')
        }}
        isDisabled
        sx={{
          display: 'block',
          margin: '10px auto',
        }}
      >
        Forgot Password
      </Button>
    )}
    <div>{errorMessage}</div>
  </div>
)

type TFormType = 'login' | 'register'

export const Login = () => {
  /**
   * create container ref to have the div width
   * so can use to calculate the transform to move each children
   */
  const containerRef = useRef<HTMLDivElement>(null)
  // state to manage the form should be visible
  const [formFocus, setFormFocus] = useState<TFormType>('login')
  // state to manage the inputs
  const [loginFormData, setFormData] = useState({
    email: undefined,
    password: undefined,
    fullName: undefined,
  })
  const { loginUser, isLoggedIn, signupUser } = useIdentityContext()

  const [errorMessage, setErrorMessage] = useState<string>()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { id } = e.target as HTMLFormElement & { id: TFormType }

    if (formFocus !== id) {
      switchForm()
      return
    }

    async function _submit() {
      const { email, password, fullName } = loginFormData

      try {
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        const actionToSubmit =
          id === 'login'
            ? async () => await loginUser(email, password)
            : async () =>
                await signupUser(email, password, {
                  full_name: fullName,
                })

        await actionToSubmit()
      } catch (err) {
        setErrorMessage('Error: ' + (err as Error).message)
      }
    }

    _submit()
  }

  const onChangeHandle = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const switchForm = () => {
    setFormFocus((prevState) => {
      const switchTo = prevState === 'login' ? 'register' : 'login'

      return switchTo
    })
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
        as="form"
        onSubmit={onSubmit}
        sx={{
          bgColor: 'red.100',
          minHeight: '500px',
          minWidth: `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`,
          transition: 'transform 250ms',
        }}
        id="register"
        data-move
      >
        <Greet />
        <FormComponent
          errorMessage={errorMessage}
          onChangeHandle={onChangeHandle}
          formType="register"
        />
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
        onSubmit={onSubmit}
        rowGap="2"
        sx={{
          bgColor: 'orange.100',
          minHeight: '500px',
          minWidth: `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`,
          transition: 'transform 250ms',
        }}
        id="login"
        data-move
      >
        <Greet />
        <FormComponent
          errorMessage={errorMessage}
          onChangeHandle={onChangeHandle}
          formType="login"
        />
      </Box>

      {/* actions button */}
      <Button sx={{ ...buttonStyle, left: 0 }} form="register" type="submit">
        Register
      </Button>

      {/* TODO: disabled button when form is submitted */}
      <Button sx={{ ...buttonStyle, right: 0 }} type="submit" form="login">
        Login
      </Button>
    </Box>
  )
}
