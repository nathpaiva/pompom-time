import { Button } from '@chakra-ui/react'

import { TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'
import { CardForm, CardFormProps } from '../CardForm'

type RegisterFormProps = Omit<CardFormProps, 'children' | 'formKey'> & {
  onSubmit: TUseIdentityForm['onSubmit']
}

export const RegisterForm = ({
  formSetup,
  formTypeOpened,
  show,
  handleClick,
  onSubmit,
}: RegisterFormProps) => {
  return (
    <CardForm
      formSetup={formSetup}
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
