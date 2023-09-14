import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { FormEvent } from 'react'

import { IMAGE_CONTAINER_WIDTH_SIZE_PX } from '../../constants'
import { EnumForm } from '../../types'
import { Greet } from '../Greet'

export interface IFormComponentPropsCommon {
  onChangeHandle: (e: FormEvent<HTMLInputElement>) => void
  errorMessage?: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
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
        transition: 'transform 250ms',
      }}
      id={formType}
      data-move
    >
      <Greet />

      <div>
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

        <FormControl as="fieldset" rowGap="2" display="grid">
          <FormLabel>Email</FormLabel>
          <Input
            onChange={onChangeHandle}
            type="email"
            name="email"
            placeholder="Email"
          />
        </FormControl>
        {/*  */}

        <Button
          type="submit"
          form={formType}
          sx={{ display: EnumForm.reset === formType ? 'block' : 'none' }}
        >
          Get Password Reset Link
        </Button>
        <Button
          variant="link"
          sx={{
            display: EnumForm.reset === formType ? 'block' : 'none',
          }}
          onClick={switchToReset}
        >
          Never mind
        </Button>

        <FormControl
          as="fieldset"
          rowGap="2"
          display="grid"
          sx={{
            display: EnumForm.reset !== formType ? 'block' : 'none',
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

        <div>{errorMessage}</div>
      </div>
    </Box>
  )
}
