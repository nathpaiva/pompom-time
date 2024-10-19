import {
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'

import { FormSetupFields, TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'

// const FORM_FIELDS = {
//   [EnumFormType.login]: [
//     'email',
//     'password',
//   ] as (keyof TUseIdentityForm['formSetup']['login']['registerInput'])[],
//   [EnumFormType.register]: [
//     'email',
//     'password',
//     'fullName',
//   ] as (keyof TUseIdentityForm['formSetup']['register']['registerInput'])[],
//   [EnumFormType.reset]: [
//     'email',
//   ] as (keyof TUseIdentityForm['formSetup']['reset']['registerInput'])[],
// } as Record<EnumFormType, string[]>

// import { UseFormRegister } from 'react-hook-form'

type FieldsType =
  TUseIdentityForm['formSetup'][EnumFormType]['registerInput']['name']

type FormFieldsType = {
  [key in EnumFormType]: FieldsType[]
}
//   [EnumFormType.login]: TUseIdentityForm['formSetup'][EnumFormType.login]['registerInput']['name'][]
//   [EnumFormType.register]: TUseIdentityForm['formSetup'][EnumFormType.login]['registerInput']['name'][]
//   [EnumFormType.reset]: TUseIdentityForm['formSetup'][EnumFormType.login]['registerInput']['name'][]
// }

export const FORM_FIELDS: FormFieldsType = {
  [EnumFormType.login]: ['email', 'password'],
  [EnumFormType.register]: ['email', 'password', 'fullName'],
  [EnumFormType.reset]: ['email'],
}

const LABEL_COPY = {
  email: 'Email',
  password: 'Password',
  fullName: 'Name',
} as Record<FieldsType, string>

export const CardForm = ({
  formSetup,
  formTypeOpened,
  onSubmit,
  children,
  formKey,
  show,
  handleClick,
}: {
  formSetup: TUseIdentityForm['formSetup'][EnumFormType]
  formTypeOpened: EnumFormType
  onSubmit:
    | TUseIdentityForm['onSubmit']
    | TUseIdentityForm['onSubmitRecoverPassword']
  children: React.ReactNode
  formKey: EnumFormType
  show?: boolean
  handleClick?: () => void
}) => {
  console.log(`CardForm: formKey: ${formKey}`, FORM_FIELDS[formKey])

  const formTypeOpenedEnum = formSetup

  return (
    <Card
      key={formKey}
      as="form"
      onSubmit={(event) => {
        formTypeOpenedEnum.handleSubmit(onSubmit)(event)
      }}
      id={formKey}
      data-testid={formKey}
      aria-hidden={formTypeOpened !== EnumFormType.login}
    >
      <Card
        sx={{
          width: '70%',
          mx: 'auto',
          p: '2rem',
          gap: '20px',
          label: {
            backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
          },
        }}
        variant="outline"
      >
        {FORM_FIELDS[formKey].map((field) => {
          let errorMessage
          let registerFiled = {}

          if (
            field === 'email' ||
            field === 'password' ||
            field === 'fullName'
          ) {
            errorMessage = formTypeOpenedEnum.errors[formKey]?.[field]?.message

            registerFiled = formTypeOpenedEnum.registerInput(
              `${formKey}.${field}`,
              {
                required: `${LABEL_COPY[field]} is required`,
              },
            )
          }

          return (
            <FormControl
              key={field}
              as="fieldset"
              display="grid"
              variant="floating"
              isInvalid={!!errorMessage}
            >
              <InputGroup size="md">
                <Input
                  type={
                    field === 'password' ? (show ? 'text' : 'password') : field
                  }
                  data-testid={`${formKey}-${field}`}
                  placeholder=" "
                  autoComplete={`current-${field}`}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...registerFiled}
                />
                <FormLabel>{LABEL_COPY[field]}</FormLabel>
                {field === 'password' && (
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleClick}
                      colorScheme="purple"
                    >
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                )}
              </InputGroup>
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            </FormControl>
          )
        })}

        {children}
      </Card>
    </Card>
  )
}
