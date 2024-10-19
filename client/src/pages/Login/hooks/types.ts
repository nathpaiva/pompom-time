import type { Dispatch } from 'react'
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form'

import { EnumFormType } from '../types'

interface TCommonFields {
  email?: string
  password?: string
  fullName?: string
}

export interface FormSetupFields {
  login: TCommonFields
  register: TCommonFields
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
  onSubmit: (e: FormSetupFields) => void
  setFormTypeOpened: Dispatch<React.SetStateAction<EnumFormType>>
  onSubmitRecoverPassword: (e: FormSetupFields) => void
  formTypeOpened: EnumFormType

  formSetup: {
    login: ILoginFormConfig
    register: IRegisterFormConfig
    reset: IResetFormConfig
  }
}

// import type { Dispatch } from 'react'
// import type {
//   FieldErrors,
//   UseFormHandleSubmit,
//   UseFormRegister,
// } from 'react-hook-form'

// import { EnumFormType } from '../types'

// interface TCommonFields {
//   email: string
//   password: string
// }

// export interface FormSetupFields {
//   [EnumFormType.login]: TCommonFields
//   [EnumFormType.register]: TCommonFields & {
//     fullName?: string
//   }
//   [EnumFormType.reset]: TCommonFields
// }

// // interface ILoginFormConfig {
// //   handleSubmit: UseFormHandleSubmit<FormSetupFields, undefined>
// //   registerInput: UseFormRegister<FormSetupFields>
// //   errors: FieldErrors<FormSetupFields>
// // }

// // interface IRegisterFormConfig {
// //   handleSubmit: UseFormHandleSubmit<FormSetupFields, undefined>
// //   registerInput: UseFormRegister<FormSetupFields>
// //   errors: FieldErrors<FormSetupFields>
// // }

// // interface IResetFormConfig {
// //   handleSubmit: UseFormHandleSubmit<FormSetupFields, undefined>
// //   registerInput: UseFormRegister<FormSetupFields>
// //   errors: FieldErrors<FormSetupFields>
// // }

// export interface TUseIdentityForm {
//   onSubmit: (e: FormSetupFields) => void
//   setFormTypeOpened: Dispatch<React.SetStateAction<EnumFormType>>
//   onSubmitRecoverPassword: (e: FormSetupFields) => void
//   formTypeOpened: EnumFormType

//   formSetup: FormSetup
//   // formSetup: {
//   //   login: ILoginFormConfig
//   //   register: IRegisterFormConfig
//   //   reset: IResetFormConfig
//   // }
// }

// // this type must be an object based in EnumFormType
// type FormSetup = {
//   [key in EnumFormType]: {
//     handleSubmit: UseFormHandleSubmit<FormSetupFields, undefined>
//     registerInput: UseFormRegister<FormSetupFields>
//     errors: FieldErrors<FormSetupFields>
//   }
// }
