import { Button } from '@chakra-ui/react'

import { TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'
import { CardForm } from '../CardForm'

export const RegisterForm = ({
  formSetup,
  formTypeOpened,
  show,
  handleClick,
  onSubmit,
}: {
  formSetup: TUseIdentityForm['formSetup']
  formTypeOpened: EnumFormType
  show: boolean
  handleClick: () => void
  onSubmit: TUseIdentityForm['onSubmit']
}) => {
  return (
    <CardForm
      formSetup={formSetup[EnumFormType.register]}
      formTypeOpened={formTypeOpened}
      onSubmit={onSubmit}
      formKey={EnumFormType.register}
      show={show}
      handleClick={handleClick}
    >
      {/* actions */}
      <Button type="submit" form={EnumFormType.register} colorScheme="purple">
        Create
      </Button>
    </CardForm>
  )
}
