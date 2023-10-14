import {
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  SystemStyleObject,
} from '@chakra-ui/react'
import { useState } from 'react'

import { IMAGE_CONTAINER_WIDTH_SIZE_PX } from '../../constants'
import { TUseIdentityForm } from '../../hooks/types'
import { EnumFormType } from '../../types'

export interface IFormComponentPropsCommon {
  onSubmit:
    | TUseIdentityForm['onSubmit']
    | TUseIdentityForm['onSubmitRecoverPassword']
  formTitle: string
  sxContainer?: SystemStyleObject
  sxForm?: SystemStyleObject
  formIsHidden?: boolean
}

interface TLoginForm {
  formType: EnumFormType.login
  switchToForm: () => void
  formSetup: TUseIdentityForm['formSetup'][EnumFormType.login]
}

interface TRegisterForm {
  formType: EnumFormType.register
  switchToForm?: never
  formSetup: TUseIdentityForm['formSetup'][EnumFormType.register]
}

interface TResetForm {
  formType: EnumFormType.reset
  switchToForm: () => void
  formSetup: TUseIdentityForm['formSetup'][EnumFormType.reset]
}

type IFormComponentProps = IFormComponentPropsCommon &
  (TLoginForm | TRegisterForm | TResetForm)

// TODO: organize the code to group by form type
export function FormComponent({
  formType,
  onSubmit,
  switchToForm,
  formTitle,
  sxContainer,
  sxForm,
  formIsHidden,
  formSetup,
}: IFormComponentProps) {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const containerSize =
    formType !== EnumFormType.reset
      ? `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`
      : '100%'

  return (
    <Card
      key={formType}
      as="form"
      onSubmit={(event) => {
        formSetup.handleSubmit(onSubmit)(event)
      }}
      sx={{
        minHeight: '500px',
        minWidth: containerSize,
        transition: 'transform 250ms',
        p: '2rem',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        ...sxContainer,
      }}
      id={formType}
      data-testid={formType}
      data-move
      aria-hidden={formIsHidden}
    >
      <Heading textAlign="center" size="lg" mb={4}>
        {formTitle}
      </Heading>

      {/* form block */}
      <Card
        sx={{
          width: '70%',
          mx: 'auto',
          p: '2rem',
          gap: '20px',
          label: {
            backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
          },
          ...sxForm,
        }}
        variant="outline"
      >
        {/* reset form */}
        {/* if is register should add input name  */}
        {formType === EnumFormType.register && (
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            isInvalid={!!formSetup.errors?.[formType]?.fullName}
          >
            <Input
              type="name"
              placeholder=" "
              data-testid={`${formType}-fullName`}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...formSetup.registerInput(`${formType}.fullName`, {
                required: 'Name is required',
              })}
            />
            <FormLabel>Name</FormLabel>
            <FormErrorMessage>
              {formSetup.errors?.[formType]?.fullName?.message}
            </FormErrorMessage>
          </FormControl>
        )}

        {/* all forms */}
        <FormControl
          as="fieldset"
          display="grid"
          variant="floating"
          isInvalid={!!formSetup.errors?.[formType]?.email?.message}
        >
          <Input
            type="email"
            data-testid={`${formType}-email`}
            placeholder=" "
            autoComplete={
              formType !== EnumFormType.register ? 'new-email' : 'current-email'
            }
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...formSetup.registerInput(`${formType}.email`, {
              required: 'Email is required',
            })}
          />
          <FormLabel>Email</FormLabel>
          <FormErrorMessage>
            {formSetup.errors?.[formType]?.email?.message}
          </FormErrorMessage>
        </FormControl>

        {/* login & register  */}
        {formType !== EnumFormType.reset && (
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            isInvalid={!!formSetup.errors?.[formType]?.password}
          >
            <InputGroup size="md">
              <Input
                autoComplete={
                  formType === EnumFormType.login
                    ? 'current-password'
                    : 'new-password'
                }
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder=" "
                data-testid={`${formType}-password`}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...formSetup.registerInput(`${formType}.password`, {
                  required: 'password is required',
                })}
              />
              <FormLabel>Password</FormLabel>
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
            </InputGroup>

            {/* if is login should show recover pass button */}
            {formType === EnumFormType.login && (
              <Button
                variant="link"
                onClick={switchToForm}
                size="xs"
                sx={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '0',
                }}
              >
                Forgot Password
              </Button>
            )}
            <FormErrorMessage>
              {formSetup.errors?.[formType]?.password?.message}
            </FormErrorMessage>
          </FormControl>
        )}
        {/* actions */}

        {/* reset */}
        {formType === EnumFormType.reset && (
          <>
            <Button type="submit" form={formType} colorScheme="purple">
              Send recovery email
            </Button>
            <Button variant="link" size="xs" onClick={switchToForm}>
              Never mind
            </Button>
          </>
        )}
      </Card>
    </Card>
  )
}
