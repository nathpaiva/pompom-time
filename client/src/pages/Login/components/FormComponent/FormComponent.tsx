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
import { UseFormReset, useForm } from 'react-hook-form'

import { IMAGE_CONTAINER_WIDTH_SIZE_PX } from '../../constants'
import { IFormInput } from '../../hooks'
import { EnumFormType } from '../../types'

export interface IFormComponentPropsCommon {
  onSubmit: (e: IFormInput, reset: UseFormReset<IFormInput>) => void
  formTitle: string
  sxContainer?: SystemStyleObject
  sxForm?: SystemStyleObject
  formIsHidden?: boolean
}

interface TLoginForm {
  formType: EnumFormType.login
  switchToForm: () => void
}
interface TRegisterForm {
  formType: EnumFormType.register
  switchToForm?: never
}

interface TResetForm {
  formType: EnumFormType.reset
  switchToForm: () => void
}

type IFormComponentProps = IFormComponentPropsCommon &
  (TLoginForm | TRegisterForm | TResetForm)

// TODO: organize the code to group by form type
export const FormComponent = ({
  formType,
  onSubmit,
  switchToForm,
  formTitle,
  sxContainer,
  sxForm,
  formIsHidden,
}: IFormComponentProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IFormInput>()
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const containerSize =
    formType !== EnumFormType.reset
      ? `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`
      : '100%'

  return (
    <Card
      as="form"
      onSubmit={(event) => {
        handleSubmit((_event) => onSubmit(_event, reset))(event)
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
            isInvalid={!!errors.fullName}
          >
            <Input
              type="name"
              placeholder=" "
              data-testid={`${formType}-fullName`}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('fullName', {
                required: 'Name is required',
              })}
            />
            <FormLabel>Name</FormLabel>
            <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
          </FormControl>
        )}

        {/* all forms */}
        <FormControl
          as="fieldset"
          display="grid"
          variant="floating"
          isInvalid={!!errors.email}
        >
          <Input
            type="email"
            data-testid={`${formType}-email`}
            placeholder=" "
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('email', {
              required: 'Email is required',
            })}
          />
          <FormLabel>Email</FormLabel>
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        {/* login & register  */}
        {formType !== EnumFormType.reset && (
          <FormControl
            as="fieldset"
            display="grid"
            variant="floating"
            isInvalid={!!errors.password}
          >
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder=" "
                data-testid={`${formType}-password`}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('password', {
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
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
        )}
        {/* actions */}

        {/* reset */}
        {formType === EnumFormType.reset && (
          <Button type="submit" form={formType} colorScheme="purple">
            Send recovery email
          </Button>
        )}

        {/* reset */}
        {formType === EnumFormType.reset && (
          <Button variant="link" size="xs" onClick={switchToForm}>
            Never mind
          </Button>
        )}
      </Card>
    </Card>
  )
}
