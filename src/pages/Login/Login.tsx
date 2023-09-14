import { Box, Button, Center } from '@chakra-ui/react'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useIdentityContext } from 'react-netlify-identity'
import { Navigate } from 'react-router-dom'

import { FormComponent } from './components'
import {
  IMAGE_CONTAINER_WIDTH_SIZE,
  IMAGE_CONTAINER_WIDTH_SIZE_PX,
} from './constants'
import { EnumForm } from './types'

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
  const [formFocus, setFormFocus] = useState<EnumForm>(EnumForm.login)
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
    console.log(
      '🚀 ~ file: Login.tsx:108 ~ useEffect ~ offsetWidth:',
      offsetWidth,
    )

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
        errorMessage={errorMessage}
        onChangeHandle={onChangeHandle}
        formType={EnumForm.register}
        onSubmit={onSubmit}
      />

      <Center
        // {/* nice image */}
        sx={{
          bg: 'purple.100',
          minWidth: IMAGE_CONTAINER_WIDTH_SIZE_PX,
          transition: 'transform 250ms',
        }}
        data-move
      >
        Nice image
      </Center>

      <FormComponent
        // {/* login form */}
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
        errorMessage={errorMessage}
        onChangeHandle={onChangeHandle}
        formType={EnumForm.reset}
        onSubmit={(e) => {
          e.preventDefault()
          console.log('will submit')
        }}
        switchToReset={() => {
          switchForm(EnumForm.login)
        }}
      />

      {/* actions button */}
      <Button sx={{ ...buttonStyle, left: 0 }} form="register" type="submit">
        Register
      </Button>

      <Button sx={{ ...buttonStyle, right: 0 }} type="submit" form="login">
        Login
      </Button>
    </Box>
  )
}
