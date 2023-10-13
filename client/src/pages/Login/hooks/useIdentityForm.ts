import { useToast } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIdentityContext } from 'react-netlify-identity'

import { IMAGE_CONTAINER_WIDTH_SIZE } from '../constants'
import { EnumFormType } from '../types'
import { FormSetupFields, TUseIdentityForm } from './types'

export const useIdentityForm = (): TUseIdentityForm => {
  // create the register to each form
  const {
    handleSubmit: handleSubmitLoginForm,
    register: registerInputLoginForm,
    formState: { errors: errorsLoginForm },
  } = useForm<FormSetupFields>()
  const {
    handleSubmit: handleSubmitRegisterForm,
    register: registerInputRegisterForm,
    formState: { errors: errorsRegisterForm },
  } = useForm<FormSetupFields>()
  const {
    handleSubmit: handleSubmitResetForm,
    register: registerInputResetForm,
    formState: { errors: errorsResetForm },
  } = useForm<FormSetupFields>()
  // this is state is to manage the time to render the form
  // so the calculation can happen to focus on login form
  // TODO: take a look to see if this is the best approach
  const [shouldShowPage, setShouldShowPage] = useState(false)
  // get initial credentials from netlify identity
  const {
    loginUser,
    isLoggedIn,
    signupUser,
    requestPasswordRecovery,
    isConfirmedUser,
  } = useIdentityContext()

  // init toast
  const toast = useToast()
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
   * Login or Create an user
   * If the form isn't focus only changes the form type
   *
   * @param e: FormEvent<HTMLFormElement>
   * @returns user authenticated
   */
  const onSubmit = (
    formData: FormSetupFields,
    // reset: UseFormReset<ILoginForm | IRegisterForm>,
  ) => {
    async function _submit() {
      const { email, password } = formData[formTypeOpened]
      // formData
      try {
        // if (formData.)
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
        const greetName = user?.user_metadata
          ? `Hi ${user.user_metadata.full_name}`
          : 'Hey there'

        const toastMessage =
          formTypeOpened === EnumFormType.login
            ? `${greetName}. Welcome back to Pompom time`
            : `${greetName}. Welcome to Pompom time`

        // reset()

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

  /**
   * Request the access recovery of the user
   *
   * @param e: FormEvent<HTMLFormElement>
   */
  const onSubmitRecoverPassword = (
    formData: FormSetupFields,
    // reset: UseFormReset<IResetForm>,
  ) => {
    async function _submit() {
      // const { email } = formData

      try {
        if (!formData.reset.email) {
          throw new Error('Email is required')
        }

        await requestPasswordRecovery(formData.reset.email)
        setFormTypeOpened(EnumFormType.login)
        // reset()
        toast({
          title: 'The email has been sent',
          status: 'info',
          isClosable: true,
        })
        // TODO: clean form after submit
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
    setShouldShowPage(true)
  }, [])

  // function testParam<T extends EnumFormType>(param: T) {
  //   if (param === EnumFormType.login) {
  //     return {
  //       handleSubmit: handleSubmitLoginForm,
  //       registerInput: registerInputLoginForm,
  //       errors: errorsLoginForm,
  //     }
  //   }
  //   if (param === EnumFormType.register) {
  //     return {
  //       handleSubmit: handleSubmitRegisterForm,
  //       registerInput: registerInputRegisterForm,
  //       errors: errorsRegisterForm,
  //     }
  //   }

  //   return {
  //     handleSubmit: handleSubmitResetForm,
  //     registerInput: registerInputResetForm,
  //     errors: errorsResetForm,
  //   }
  // }

  // testParam(EnumFormType.login)

  return {
    isLoggedIn: isLoggedIn && isConfirmedUser,
    containerRef,
    onSubmit,
    setFormTypeOpened,
    onSubmitRecoverPassword,
    formTypeOpened,
    showPage: shouldShowPage,
    // formSetup: testParam,
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
