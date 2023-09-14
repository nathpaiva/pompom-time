import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import { FormEvent } from 'react'

import { IMAGE_CONTAINER_WIDTH_SIZE_PX } from '../../constants'
import { EnumForm } from '../../types'

export interface IFormComponentPropsCommon {
  onChangeHandle: (e: FormEvent<HTMLInputElement>) => void
  errorMessage?: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  formTitle: string
}

interface TLoginForm {
  formType: EnumForm.login
  switchToReset: () => void
}
interface TRegisterForm {
  formType: EnumForm.register
  switchToReset?: never
}

interface TResetForm {
  formType: EnumForm.reset
  switchToReset: () => void
}

type IFormComponentProps = IFormComponentPropsCommon &
  (TLoginForm | TRegisterForm | TResetForm)

export const FormComponent = ({
  onChangeHandle,
  errorMessage,
  formType,
  onSubmit,
  switchToReset,
  formTitle,
}: IFormComponentProps) => {
  const containerSize =
    formType !== EnumForm.reset
      ? `calc(100% - ${IMAGE_CONTAINER_WIDTH_SIZE_PX})`
      : '100%'

  return (
    <Box
      as="form"
      onSubmit={onSubmit}
      sx={{
        bgColor: 'red.100',
        minHeight: '500px',
        minWidth: containerSize,
        transition: 'transform .5s 250ms',
      }}
      id={formType}
      data-move
    >
      <Heading textAlign="center" size="lg" mb={4}>
        {formTitle}
      </Heading>
      <div>
        {/* reset form */}
        {/* if is register should add input name  */}
        {formType === EnumForm.register && (
          <FormControl as="fieldset" rowGap="2" display="grid">
            <FormLabel>Full name</FormLabel>
            <Input
              onChange={onChangeHandle}
              type="name"
              name="fullName"
              placeholder="name"
            />
          </FormControl>
        )}
        {/* all forms */}
        <FormControl as="fieldset" rowGap="2" display="grid">
          <FormLabel>Email</FormLabel>
          <Input
            onChange={onChangeHandle}
            type="email"
            name="email"
            placeholder="Email"
          />
        </FormControl>
        {/* login & register  */}
        <FormControl
          as="fieldset"
          rowGap="2"
          display="grid"
          sx={{
            display: formType !== EnumForm.reset ? 'block' : 'none',
          }}
        >
          {/* if is login should show recover pass button */}
          {formType === EnumForm.login && (
            <Button
              variant="link"
              onClick={switchToReset}
              size="xs"
              sx={{
                position: 'absolute',
                right: '0',
              }}
            >
              Forgot Password
            </Button>
          )}
          <FormLabel>Password</FormLabel>
          <Input
            onChange={onChangeHandle}
            type="password"
            name="password"
            placeholder="Password"
          />
        </FormControl>
        {/* actions */}
        {/* reset */}
        <Button
          type="submit"
          form={formType}
          sx={{ display: formType === EnumForm.reset ? 'block' : 'none' }}
        >
          Send recovery email
        </Button>
        {/* reset */}
        <Button
          variant="link"
          sx={{
            display: formType === EnumForm.reset ? 'block' : 'none',
          }}
          onClick={switchToReset}
        >
          Never mind
        </Button>
        <div>{errorMessage}</div>
      </div>
    </Box>
  )
}
