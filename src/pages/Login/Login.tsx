import { Box, Button, Center, useToast } from '@chakra-ui/react'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { Navigate } from 'react-router-dom'

import { FormComponent, FormMainActions, Greet } from './components'
import {
  IMAGE_CONTAINER_WIDTH_SIZE,
  IMAGE_CONTAINER_WIDTH_SIZE_PX,
} from './constants'
import { EnumForm } from './types'

export const Login = () => {
  const toast = useToast()
  /**
   * create container ref to have the div width
   * so can use to calculate the transform to move each children
   */
  const containerRef = useRef<HTMLDivElement>(null)
  // state to manage the form should be visible
  const [formFocus, setFormFocus] = useState<EnumForm>(EnumForm.login)
  // state to manage the inputs
  const [loginFormData, setFormData] = useState({
    email: undefined,
    password: undefined,
    fullName: undefined,
  })
  const { loginUser, isLoggedIn, signupUser, requestPasswordRecovery } =
    useIdentityContext()

  const [errorMessage, setErrorMessage] = useState<string>()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { id } = e.target as HTMLFormElement & { id: EnumForm }

    if (formFocus !== id) {
      switchForm(id)
      return
    }

    async function _submit() {
      const { email, password, fullName } = loginFormData

      try {
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        const actionToSubmit =
          id === EnumForm.login
            ? async () => await loginUser(email, password)
            : async () =>
                await signupUser(email, password, {
                  full_name: fullName,
                })

        const user = await actionToSubmit()
        const greetName = user?.user_metadata
          ? `Hi ${user.user_metadata.full_name}`
          : 'Hey there'

        const toastMessage =
          id === EnumForm.login
            ? `${greetName}. Welcome back to Pompom time`
            : `${greetName}. Welcome to Pompom time`

        toast({
          title: toastMessage,
          status: 'success',
          isClosable: true,
        })
      } catch (err) {
        toast({
          title: (err as Error).message,
          status: 'error',
          isClosable: true,
        })
      }
    }

    _submit()
  }

  const onSubmitRecoverPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    async function _submit() {
      const { email } = loginFormData

      try {
        if (!email) {
          throw new Error('Email is required')
        }

        await requestPasswordRecovery(email)
        setFormFocus(EnumForm.login)
        toast({
          title: 'The email has been sent',
          status: 'info',
          isClosable: true,
        })
        // clean form after submit
      } catch (err) {
        toast({
          title: (err as Error).message,
          status: 'error',
          isClosable: true,
        })
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

  const switchForm = (id: EnumForm) => {
    setFormFocus(id)
    setErrorMessage(undefined)
  }

  const changeStyle = useCallback(
    (offsetWidth: number) => {
      const arrElements = [...document.querySelectorAll('[data-move]')]
      let moveTo = IMAGE_CONTAINER_WIDTH_SIZE - offsetWidth

      if (formFocus === EnumForm.reset) {
        moveTo = moveTo + -offsetWidth
      } else {
        moveTo = formFocus === EnumForm.login ? moveTo : 0
      }

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
      <FormComponent
        // {/* register form */}
        formTitle="Sign up"
        errorMessage={errorMessage}
        onChangeHandle={onChangeHandle}
        formType={EnumForm.register}
        onSubmit={onSubmit}
      />

      <Center
        // {/* info component */}
        sx={{
          bg: 'purple.100',
          minWidth: IMAGE_CONTAINER_WIDTH_SIZE_PX,
          transition: 'transform .5s 250ms',
          p: '2rem',
        }}
        data-move
      >
        <Greet />
      </Center>

      <FormComponent
        // {/* login form */}
        formTitle="Log in"
        errorMessage={errorMessage}
        onChangeHandle={onChangeHandle}
        formType={EnumForm.login}
        onSubmit={onSubmit}
        switchToReset={() => {
          switchForm(EnumForm.reset)
        }}
      />

      <FormComponent
        // {/* reset form */}
        formTitle="Recover password"
        errorMessage={errorMessage}
        onChangeHandle={onChangeHandle}
        formType={EnumForm.reset}
        onSubmit={onSubmitRecoverPassword}
        switchToReset={() => {
          switchForm(EnumForm.login)
        }}
      />

      <FormMainActions formFocus={formFocus} />
    </Box>
  )
}
