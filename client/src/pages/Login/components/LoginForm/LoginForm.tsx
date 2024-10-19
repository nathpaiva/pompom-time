import { Button } from '@chakra-ui/react'

import { TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'
import { CardForm } from '../CardForm'

export const LoginForm = ({
  formSetup,
  formTypeOpened,
  setFormTypeOpened,
  show,
  handleClick,
  onSubmit,
}: {
  formSetup: TUseIdentityForm['formSetup']
  formTypeOpened: EnumFormType
  setFormTypeOpened: TUseIdentityForm['setFormTypeOpened']
  show: boolean
  handleClick: () => void
  onSubmit: TUseIdentityForm['onSubmit']
}) => (
  <CardForm
    formSetup={formSetup[EnumFormType.login]}
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
