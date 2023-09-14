import { Box, Center } from '@chakra-ui/react'
import { Navigate } from 'react-router-dom'

import { FormComponent, FormMainActions, Greet } from './components'
import { IMAGE_CONTAINER_WIDTH_SIZE_PX } from './constants'
import { useIdentityForm } from './hooks'
import { EnumFormType } from './types'

export const Login = () => {
  const {
    isLoggedIn,
    containerRef,
    onChangeHandle,
    onSubmit,
    setFormTypeOpened,
    onSubmitRecoverPassword,
    formTypeOpened,
  } = useIdentityForm()

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
        onChangeHandle={onChangeHandle}
        formType={EnumFormType.register}
        onSubmit={onSubmit}
      />

      <Center
        // {/* info component */}
        sx={{
          bg: 'purple.100',
          minWidth: IMAGE_CONTAINER_WIDTH_SIZE_PX,
          transition: 'transform 250ms',
          p: '2rem',
        }}
        data-move
      >
        <Greet />
      </Center>

      <FormComponent
        // {/* login form */}
        formTitle="Log in"
        onChangeHandle={onChangeHandle}
        formType={EnumFormType.login}
        onSubmit={onSubmit}
        switchToReset={() => {
          setFormTypeOpened(EnumFormType.reset)
        }}
      />

      <FormComponent
        // {/* reset form */}
        formTitle="Recover password"
        onChangeHandle={onChangeHandle}
        formType={EnumFormType.reset}
        onSubmit={onSubmitRecoverPassword}
        switchToReset={() => {
          setFormTypeOpened(EnumFormType.login)
        }}
      />

      <FormMainActions formFocus={formTypeOpened} />
    </Box>
  )
}
