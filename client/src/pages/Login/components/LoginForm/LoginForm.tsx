import { Button } from '@chakra-ui/react'

import { TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'
import { CardForm, type CardFormProps } from '../CardForm'

type LoginFormProps = Omit<CardFormProps, 'children' | 'formKey'> & {
  setFormTypeOpened: TUseIdentityForm['setFormTypeOpened']
  onSubmit: TUseIdentityForm['onSubmit']
}

export const LoginForm = ({
  formSetup,
  formTypeOpened,
  setFormTypeOpened,
  show,
  handleClick,
  onSubmit,
}: LoginFormProps) => (
  <CardForm
    formSetup={formSetup}
    formTypeOpened={formTypeOpened}
    onSubmit={onSubmit}
    formKey={EnumFormType.login}
    show={show}
    handleClick={handleClick}
  >
    {/* actions */}
    <Button type="submit" form={formTypeOpened} colorScheme="purple">
      Login
    </Button>

    {/* if is login should show recover pass button */}
    <Button
      variant="link"
      onClick={() => {
        setFormTypeOpened(EnumFormType.reset)
      }}
      size="xs"
    >
      Forgot Password
    </Button>
  </CardForm>
)
