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
    onSubmit,
    setFormTypeOpened,
    onSubmitRecoverPassword,
    formTypeOpened,
    showPage,
    formSetup,
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
        opacity: showPage ? '1' : '0',
        transition: 'opacity .1s 250ms',
      }}
      ref={containerRef}
    >
      <FormComponent
        // {/* register form */}
        formTitle="Sign up"
        formType={EnumFormType.register}
        onSubmit={onSubmit}
        formIsHidden={formTypeOpened !== EnumFormType.register}
        formSetup={formSetup[EnumFormType.register]}
      />

      <Center
        // {/* info component */}
        sx={{
          minWidth: IMAGE_CONTAINER_WIDTH_SIZE_PX,
          transition: 'transform 250ms',
          p: '2rem',
        }}
        borderRadius="sm"
        data-move
      >
        <Greet />
      </Center>

      <FormComponent
        // {/* login form */}
        formTitle="Log in"
        formType={EnumFormType.login}
        onSubmit={onSubmit}
        formIsHidden={formTypeOpened !== EnumFormType.login}
        switchToForm={() => {
          setFormTypeOpened(EnumFormType.reset)
        }}
        formSetup={formSetup[EnumFormType.login]}
      />

      <FormComponent
        // {/* reset form */}
        formTitle="Recover password"
        formType={EnumFormType.reset}
        onSubmit={onSubmitRecoverPassword}
        formIsHidden={formTypeOpened !== EnumFormType.reset}
        switchToForm={() => {
          setFormTypeOpened(EnumFormType.login)
        }}
        formSetup={formSetup[EnumFormType.reset]}
      />

      <FormMainActions
        formFocus={formTypeOpened}
        switchToForm={setFormTypeOpened}
      />
    </Box>
  )
}
