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
import { EnumFormType } from '../../types'

export interface IFormComponentPropsCommon {
  onChangeHandle: (e: FormEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  formTitle: string
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

export const FormComponent = ({
  onChangeHandle,
  formType,
  onSubmit,
  switchToReset,
  formTitle,
}: IFormComponentProps) => {
  const containerSize =
    formType !== EnumFormType.reset
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
        p: '2rem',
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
        {formType === EnumFormType.register && (
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
            display: formType !== EnumFormType.reset ? 'block' : 'none',
          }}
        >
          {/* if is login should show recover pass button */}
          {formType === EnumFormType.login && (
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
          sx={{ display: formType === EnumFormType.reset ? 'block' : 'none' }}
        >
          Send recovery email
        </Button>
        {/* reset */}
        <Button
          variant="link"
          sx={{
            display: formType === EnumFormType.reset ? 'block' : 'none',
          }}
          onClick={switchToReset}
        >
          Never mind
        </Button>
      </div>
    </Box>
  )
}
