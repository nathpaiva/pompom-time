import { useToast } from '@chakra-ui/react'
import {
  Dispatch,
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import { IMAGE_CONTAINER_WIDTH_SIZE } from '../constants'
import { EnumFormType } from '../types'

export interface TUseIdentityForm {
  isLoggedIn: boolean
  containerRef: RefObject<HTMLDivElement>
  onChangeHandle: (e: FormEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  setFormTypeOpened: Dispatch<React.SetStateAction<EnumFormType>>
  onSubmitRecoverPassword: (e: FormEvent<HTMLFormElement>) => void
  formTypeOpened: EnumFormType
}

export const useIdentityForm = (): TUseIdentityForm => {
  // get initial credentials from netlify identity
  const { loginUser, isLoggedIn, signupUser, requestPasswordRecovery } =
    useIdentityContext()
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
  // state to manage the inputs
  const [inputFormData, setInputFormData] = useState({
    email: undefined,
    password: undefined,
    fullName: undefined,
  })

  /**
   * Login or Create an user
   * If the form isn't focus only changes the form type
   *
   * @param e: FormEvent<HTMLFormElement>
   * @returns user authenticated
   */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { id } = e.target as HTMLFormElement & { id: EnumFormType }

    if (formTypeOpened !== id) {
      setFormTypeOpened(id)
      return
    }

    async function _submit() {
      const { email, password, fullName } = inputFormData

      try {
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        const actionToSubmit =
          id === EnumFormType.login
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
          id === EnumFormType.login
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

  /**
   * Request the access recovery of the user
   *
   * @param e: FormEvent<HTMLFormElement>
   */
  const onSubmitRecoverPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    async function _submit() {
      const { email } = inputFormData

      try {
        if (!email) {
          throw new Error('Email is required')
        }

        await requestPasswordRecovery(email)
        setFormTypeOpened(EnumFormType.login)
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
   * Handle with the input state
   *
   * @param e: FormEvent<HTMLInputElement>
   */
  const onChangeHandle = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setInputFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
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

  return {
    isLoggedIn,
    containerRef,
    onChangeHandle,
    onSubmit,
    setFormTypeOpened,
    onSubmitRecoverPassword,
    formTypeOpened,
  }
}
