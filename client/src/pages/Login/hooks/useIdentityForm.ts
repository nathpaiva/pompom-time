import { useToast } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, useIdentityContext } from 'react-netlify-identity'
import { useNavigate } from 'react-router-dom'

import { IMAGE_CONTAINER_WIDTH_SIZE } from '../constants'
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
  // this is state is to manage the time to render the form
  // so the calculation can happen to focus on login form
  // TODO: take a look to see if this is the best approach
  const [shouldShowPage, setShouldShowPage] = useState(false)
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

  /**
   * create container ref to have the div width
   * so can use to calculate the transform to move each children
   */
  const containerRef = useRef<HTMLDivElement>(null)
  // state to manage the form should be visible
  const [formTypeOpened, setFormTypeOpened] = useState<EnumFormType>(
    EnumFormType.login,
  )

  /**
   * Moves the form position after the form type has changed
   *
   * @param offsetWidth: number
   */
  const moveToFormType = useCallback(
    (offsetWidth: number) => {
      const arrElements = [...document.querySelectorAll('[data-move]')]
      let moveTo = IMAGE_CONTAINER_WIDTH_SIZE - offsetWidth

      if (formTypeOpened === EnumFormType.reset) {
        moveTo = moveTo + -offsetWidth
      } else {
        moveTo = formTypeOpened === EnumFormType.login ? moveTo : 0
      }

      arrElements.forEach((item) => {
        item.setAttribute('style', `transform: translateX(${moveTo}px)`)
      })
    },
    [formTypeOpened],
  )

  // Trigger the function to move the form position
  useEffect(() => {
    if (!containerRef.current) return

    const { offsetWidth } = containerRef.current

    moveToFormType(offsetWidth)
  }, [moveToFormType])

  useEffect(() => {
    if (isLoggedIn && isConfirmedUser) {
      navigate('/admin/workout')
    }

    setShouldShowPage(true)
  }, [isConfirmedUser, isLoggedIn, navigate])

  return {
    // isLoggedIn: isLoggedIn && isConfirmedUser,
    containerRef,
    onSubmit: mutateLoginOrRegister,
    setFormTypeOpened,
    onSubmitRecoverPassword: mutateResetForm,
    formTypeOpened,
    showPage: shouldShowPage,
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
