import { useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, useIdentityContext } from 'react-netlify-identity'
import { useNavigate } from 'react-router-dom'

import { EnumFormType } from '../types'
import { FormSetupFields, TUseIdentityForm } from './types'

export const useIdentityForm = (): TUseIdentityForm => {
  const navigate = useNavigate()
  // create the register to each form
  const {
    handleSubmit: handleSubmitLoginForm,
    register: registerInputLoginForm,
    formState: { errors: errorsLoginForm },
    reset: resetLoginForm,
  } = useForm<FormSetupFields>()
  const {
    handleSubmit: handleSubmitRegisterForm,
    register: registerInputRegisterForm,
    formState: { errors: errorsRegisterForm },
    reset: resetRegisterForm,
  } = useForm<FormSetupFields>()
  const {
    handleSubmit: handleSubmitResetForm,
    register: registerInputResetForm,
    formState: { errors: errorsResetForm },
    reset: resetResetForm,
  } = useForm<FormSetupFields>()
  // init toast
  const toast = useToast()

  // get initial credentials from netlify identity
  const {
    loginUser,
    isLoggedIn,
    signupUser,
    requestPasswordRecovery,
    isConfirmedUser,
  } = useIdentityContext()

  /**
   * Login or Register an user
   *
   * @param formData: FormSetupFields
   * @returns user authenticated
   */
  const { mutate: mutateLoginOrRegister } = useMutation<
    User,
    Error,
    FormSetupFields
  >({
    mutationFn: async (formData) => {
      const { email, password } = formData[formTypeOpened]

      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const actionToSubmit =
        formTypeOpened === EnumFormType.login
          ? async () => await loginUser(email, password)
          : async () =>
              await signupUser(email, password, {
                full_name: formData.register.fullName,
              })

      const user = await actionToSubmit()
      if (!user) {
        return Promise.reject(new Error('Error on mutation'))
      }

      return Promise.resolve(user)
    },
    onSuccess: (user) => {
      const greetName = user.user_metadata
        ? `Hi ${user.user_metadata.full_name}`
        : 'Hey there'

      const toastMessage =
        formTypeOpened === EnumFormType.login
          ? `${greetName}. Welcome back to Pompom time`
          : `${greetName}. The email confirmation was sent. Please confirm before continuing.`

      resetLoginForm()
      resetRegisterForm()

      toast({
        title: toastMessage,
        status: 'success',
        isClosable: true,
      })

      if (formTypeOpened === EnumFormType.login) {
        navigate('/admin/workout')
      }
    },
    onError: (error) => {
      toast({
        title: error.message,
        status: 'error',
        isClosable: true,
      })
    },
  })

  /**
   * Request the access recovery of the user
   *
   * @param formData: FormSetupFields
   */
  const { mutate: mutateResetForm } = useMutation<void, Error, FormSetupFields>(
    {
      mutationFn: async (formData) => {
        const { email } = formData[formTypeOpened]

        if (!email) {
          return Promise.reject(new Error('Email is required'))
        }

        await requestPasswordRecovery(email)
      },
      onSuccess: () => {
        setFormTypeOpened(EnumFormType.login)
        resetResetForm()
        toast({
          title: 'We will send you an email to reset your password.',
          status: 'info',
          isClosable: true,
        })
      },
      onError: (err) => {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true,
        })
      },
    },
  )

  // state to manage the form should be visible
  const [formTypeOpened, setFormTypeOpened] = useState<EnumFormType>(
    EnumFormType.login,
  )

  useEffect(() => {
    if (isLoggedIn && isConfirmedUser) {
      navigate('/admin/workout')
    }
  }, [isConfirmedUser, isLoggedIn, navigate])

  return {
    onSubmit: mutateLoginOrRegister,
    setFormTypeOpened,
    onSubmitRecoverPassword: mutateResetForm,
    formTypeOpened,
    formSetup: {
      login: {
        handleSubmit: handleSubmitLoginForm,
        registerInput: registerInputLoginForm,
        errors: errorsLoginForm,
      },
      register: {
        handleSubmit: handleSubmitRegisterForm,
        registerInput: registerInputRegisterForm,
        errors: errorsRegisterForm,
      },
      reset: {
        handleSubmit: handleSubmitResetForm,
        registerInput: registerInputResetForm,
        errors: errorsResetForm,
      },
    },
  }
}
