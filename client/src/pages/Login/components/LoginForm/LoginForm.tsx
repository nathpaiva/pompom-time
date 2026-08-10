import { Button, Flex } from '@chakra-ui/react'

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
    <Flex justify="flex-end">
      <Button
        variant="link"
        onClick={() => {
          setFormTypeOpened(EnumFormType.reset)
        }}
        size="xs"
        fontFamily="heading"
        fontWeight="700"
        fontSize="13px"
        color="pompom.primary"
      >
        Forgot password
      </Button>
    </Flex>

    <Button
      type="submit"
      form={formTypeOpened}
      borderRadius="pompomPill"
      bg="pompom.primary"
      color="white"
      fontFamily="heading"
      fontWeight="700"
      _hover={{ bg: 'pompom.primary' }}
    >
      Sign in
    </Button>
  </CardForm>
)
