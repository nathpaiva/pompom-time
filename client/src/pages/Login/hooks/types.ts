import type { Dispatch, RefObject } from 'react'
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form'

import { EnumFormType } from '../types'

interface TCommonFields {
  email?: string
  password?: string
}

export interface FormSetupFields {
  login: TCommonFields
  register: TCommonFields & {
    fullName?: string
  }
  reset: TCommonFields
}

interface ILoginFormConfig {
  handleSubmit: UseFormHandleSubmit<FormSetupFields, undefined>
  registerInput: UseFormRegister<FormSetupFields>
  errors: FieldErrors<FormSetupFields>
}

interface IRegisterFormConfig {
  handleSubmit: UseFormHandleSubmit<FormSetupFields, undefined>
  registerInput: UseFormRegister<FormSetupFields>
  errors: FieldErrors<FormSetupFields>
}

interface IResetFormConfig {
  handleSubmit: UseFormHandleSubmit<FormSetupFields, undefined>
  registerInput: UseFormRegister<FormSetupFields>
  errors: FieldErrors<FormSetupFields>
}

export interface TUseIdentityForm {
  // isLoggedIn: boolean
  containerRef: RefObject<HTMLDivElement>
  onSubmit: (e: FormSetupFields) => void
  setFormTypeOpened: Dispatch<React.SetStateAction<EnumFormType>>
  onSubmitRecoverPassword: (e: FormSetupFields) => void
  formTypeOpened: EnumFormType
  showPage: boolean
  formSetup: {
    login: ILoginFormConfig
    register: IRegisterFormConfig
    reset: IResetFormConfig
  }
}
