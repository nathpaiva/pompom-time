import { Button, SystemStyleObject, Text } from '@chakra-ui/react'

import { EnumFormType } from '../../types'

interface IFormMainActions {
  formFocus: EnumFormType
}

const BUTTON_SIZE = 200
const LEFT_RIGHT_SIZE = '5px'

const commonVariableSx: SystemStyleObject = {
  '--button-size': `${BUTTON_SIZE}px`,
  '--padding-size': 'var(--button-size)',
  '--left-right-position': LEFT_RIGHT_SIZE,
  '--translateX-to': 'calc(var(--button-size) + var(--left-right-position))',
}

const buttonCommonSx: SystemStyleObject = {
  ...commonVariableSx,
  minWidth: 'var(--button-size)',
  position: 'absolute',
  bottom: '10px',
  transition: 'transform 250ms, padding-left 250ms, padding-right 250ms',
}

const textCommonSx: SystemStyleObject = {
  ...commonVariableSx,
  position: 'absolute',
  bottom: '55px',
}

export const FormMainActions = ({ formFocus }: IFormMainActions) => {
  const isLoginFocused = formFocus === EnumFormType.login
  const isResetFocused = formFocus === EnumFormType.reset
  const isRegisterFocused = !isLoginFocused && !isResetFocused

  return (
    <>
      <Text
        fontSize="sm"
        sx={{
          ...textCommonSx,
          left: 'var(--left-right-position)',
          transform:
            isRegisterFocused || isResetFocused
              ? // hides text when the form is  register or reset
                'translateX(calc(var(--translateX-to) * -1))'
              : 'translateX(0)',
          transition:
            isRegisterFocused || isResetFocused
              ? 'transform  250ms'
              : 'transform .3s 250ms',
        }}
      >
        Still don't have an account?
      </Text>
      <Button
        sx={{
          ...buttonCommonSx,
          left: 'var(--left-right-position)',
          paddingLeft: isRegisterFocused
            ? // grows button when the form is focused
              'var(--button-size)'
            : // shrink button when the form is not focused
              'var(--chakra-space-4)',
          transform: isResetFocused
            ? // hides button when the form is reset
              'translateX(calc(var(--translateX-to) * -1))'
            : 'translateX(0)',
        }}
        type="submit"
        form="register"
        colorScheme="purple"
      >
        Register
      </Button>

      <Text
        fontSize="sm"
        sx={{
          ...textCommonSx,
          right: 'var(--left-right-position)',
          transform:
            isLoginFocused || isResetFocused
              ? // hides text when the form is login or reset
                'translateX(var(--translateX-to))'
              : 'translateX(0)',
          transition: isLoginFocused
            ? 'transform  250ms'
            : 'transform .3s 250ms',
        }}
      >
        Do you have an account?
      </Text>
      <Button
        sx={{
          ...buttonCommonSx,
          right: 'var(--left-right-position)',
          paddingRight: isLoginFocused
            ? // grows button when the form is focused
              'var(--button-size)'
            : // shrink button when the form is not focused
              'var(--chakra-space-4)',
          transform: isResetFocused
            ? // hides button when the form is reset
              'translateX(var(--translateX-to))'
            : 'translateX(0)',
        }}
        type="submit"
        form="login"
        colorScheme="purple"
      >
        Login
      </Button>
    </>
  )
}
