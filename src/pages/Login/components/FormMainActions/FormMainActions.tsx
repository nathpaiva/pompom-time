import { Button } from '@chakra-ui/react'

import { EnumFormType } from '../../types'

interface IFormMainActions {
  formFocus: EnumFormType
}

const buttonStyle = {
  position: 'absolute',
  bottom: 0,
}

export const FormMainActions = ({ formFocus }: IFormMainActions) => {
  return (
    <>
      {/* TODO: add animation when the button is for the form action */}
      {/* actions button */}
      <Button
        sx={{
          ...buttonStyle,
          left: 0,
          paddingRight: ({ theme }) =>
            formFocus === EnumFormType.register ? '200px' : theme,
          opacity: formFocus === EnumFormType.reset ? 0 : 1,
          transition: 'opacity .3s 250ms, padding-right .3s 250ms',
        }}
        type="submit"
        form="register"
      >
        Register
      </Button>

      {/* TODO: add animation when the button is for the form action */}
      <Button
        sx={{
          ...buttonStyle,
          right: 0,
          paddingRight: ({ theme }) =>
            formFocus === EnumFormType.login ? '200px' : theme,
          opacity: formFocus === EnumFormType.reset ? 0 : 1,
          transition: 'opacity .5s 250ms, padding-right .5s 250ms',
        }}
        type="submit"
        form="login"
      >
        Login
      </Button>
    </>
  )
}
