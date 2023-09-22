import { Box, Center } from '@chakra-ui/react'
import { Navigate } from 'react-router-dom'

import { FormComponent, FormMainActions, Greet } from './components'
import { IMAGE_CONTAINER_WIDTH_SIZE_PX } from './constants'
import { useIdentityForm } from './hooks'
import { EnumFormType } from './types'

// TODO:
// - Add input validation
// - add input hints
export const Login = () => {
  const {
    isLoggedIn,
    containerRef,
    onChangeHandle,
    onSubmit,
    setFormTypeOpened,
    onSubmitRecoverPassword,
    formTypeOpened,
    showPage,
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
        onChangeHandle={onChangeHandle}
        formType={EnumFormType.register}
        onSubmit={onSubmit}
        formIsHidden={formTypeOpened === EnumFormType.register}
        // formTypeOpened
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
        onChangeHandle={onChangeHandle}
        formType={EnumFormType.login}
        onSubmit={onSubmit}
        formIsHidden={formTypeOpened === EnumFormType.login}
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
        formIsHidden={formTypeOpened === EnumFormType.reset}
        switchToReset={() => {
          setFormTypeOpened(EnumFormType.login)
        }}
      />

      <FormMainActions formFocus={formTypeOpened} />
    </Box>
  )
}
