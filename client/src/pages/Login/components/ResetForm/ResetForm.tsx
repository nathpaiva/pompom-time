import { Button } from '@chakra-ui/react'

import { TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'
import { CardForm } from '../CardForm'

export const ResetForm = ({
  formSetup,
  formTypeOpened,
  changeFormType,
  onSubmitRecoverPassword,
}: {
  formSetup: TUseIdentityForm['formSetup']
  formTypeOpened: EnumFormType
  changeFormType: TUseIdentityForm['setFormTypeOpened']
  onSubmitRecoverPassword: TUseIdentityForm['onSubmitRecoverPassword']
}) => {
  return (
    <CardForm
      formSetup={formSetup[EnumFormType.reset]}
      formTypeOpened={formTypeOpened}
      onSubmit={onSubmitRecoverPassword}
      formKey={EnumFormType.reset}
    >
      <Button
        type="submit"
        form={EnumFormType.reset}
        borderRadius="pompomPill"
        bg="pompom.primary"
        color="white"
        fontFamily="heading"
        fontWeight="700"
        _hover={{ bg: 'pompom.primary' }}
      >
        Send recovery email
      </Button>
      <Button
        variant="link"
        size="xs"
        fontFamily="heading"
        fontWeight="700"
        color="pompom.primary"
        onClick={() => {
          changeFormType(EnumFormType.login)
        }}
      >
        Never mind
      </Button>
    </CardForm>
  )
}
