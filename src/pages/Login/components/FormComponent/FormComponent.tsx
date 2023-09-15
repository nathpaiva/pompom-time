import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  SystemStyleObject,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'

import { IMAGE_CONTAINER_WIDTH_SIZE_PX } from '../../constants'
import { EnumFormType } from '../../types'

export interface IFormComponentPropsCommon {
  onChangeHandle: (e: FormEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  formTitle: string
  sxContainer?: SystemStyleObject
  sxForm?: SystemStyleObject
  formIsHidden?: boolean
}

interface TLoginForm {
  formType: EnumFormType.login
  switchToReset: () => void
}
interface TRegisterForm {
  formType: EnumFormType.register
  switchToReset?: never
}

interface TResetForm {
  formType: EnumFormType.reset
  switchToReset: () => void
}

type IFormComponentProps = IFormComponentPropsCommon &
  (TLoginForm | TRegisterForm | TResetForm)

// TODO: organize the code to group by form type
// - clean form after submit
// - add input value to all forms, if the inputFormData is filled
export const FormComponent = ({
  onChangeHandle,
  formType,
  onSubmit,
  switchToReset,
  formTitle,
  sxContainer,
  sxForm,
  formIsHidden,
}: IFormComponentProps) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const containerSize =
    formType !== EnumFormType.reset
      ? `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`
      : '100%'

  return (
    <Box
      as="form"
      onSubmit={onSubmit}
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
          ...sxForm,
        }}
      >
        {/* reset form */}
        {/* if is register should add input name  */}
        {formType === EnumFormType.register && (
          <FormControl as="fieldset" display="grid" variant="floating">
            <Input
              onChange={onChangeHandle}
              type="name"
              name="fullName"
              data-testid={`${formType}-fullName`}
              placeholder=" "
            />
            <FormLabel>Name</FormLabel>
          </FormControl>
        )}
        {/* all forms */}
        <FormControl as="fieldset" display="grid" variant="floating">
          <Input
            onChange={onChangeHandle}
            type="email"
            name="email"
            data-testid={`${formType}-email`}
            placeholder=" "
          />
          <FormLabel>Email</FormLabel>
        </FormControl>
        {/* login & register  */}
        {formType !== EnumFormType.reset && (
          <FormControl as="fieldset" display="grid" variant="floating">
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder=" "
                name="password"
                data-testid={`${formType}-password`}
                onChange={onChangeHandle}
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
                onClick={switchToReset}
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
          <Button variant="link" size="xs" onClick={switchToReset}>
            Never mind
          </Button>
        )}
      </Card>
    </Box>
  )
}
