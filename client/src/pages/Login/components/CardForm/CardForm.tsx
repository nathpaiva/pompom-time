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

import type { TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'

type FieldsType =
  TUseIdentityForm['formSetup'][EnumFormType]['registerInput']['name']

type FormFieldsType = {
  [key in EnumFormType]: FieldsType[]
}

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

export interface CardFormProps {
  formSetup: TUseIdentityForm['formSetup'][EnumFormType]
  formTypeOpened: EnumFormType
  onSubmit:
    | TUseIdentityForm['onSubmit']
    | TUseIdentityForm['onSubmitRecoverPassword']
  children: React.ReactNode
  formKey: EnumFormType
  /**
   * this prop is used to show/hide the password
   * @default false
   */
  show?: boolean
  /**
   * this prop is a function that is called to show/hide the password
   * @default undefined
   */
  handleClick?: () => void
}

export const CardForm = ({
  formSetup: formTypeOpenedEnum,
  formTypeOpened,
  onSubmit,
  children,
  formKey,
  show,
  handleClick,
}: CardFormProps) => {
  const isFormHidden = !(formKey === formTypeOpened)

  return (
    <Card
      key={formKey}
      as="form"
      onSubmit={(event) => {
        formTypeOpenedEnum.handleSubmit(onSubmit)(event)
      }}
      id={formKey}
      data-testid={`form-component-${formKey}`}
      aria-hidden={isFormHidden}
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
