import { TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useState } from 'react'

import {
  TabList,
  LoginForm,
  ResetForm,
  RegisterForm,
  Greet,
} from './components'
import { useIdentityForm } from './hooks'
import { EnumFormType } from './types'

export const Login = () => {
  const {
    onSubmit,
    setFormTypeOpened,
    onSubmitRecoverPassword,
    formTypeOpened,
    formSetup,
  } = useIdentityForm()

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <>
      <Greet />
      <Tabs variant="enclosed">
        <TabList setFormTypeOpened={setFormTypeOpened} />

        <TabPanels>
          <TabPanel>
            {/* login form */}
            {formTypeOpened === EnumFormType.login ? (
              <LoginForm
                formSetup={formSetup}
                formTypeOpened={formTypeOpened}
                setFormTypeOpened={setFormTypeOpened}
                show={show}
                handleClick={handleClick}
                onSubmit={onSubmit}
              />
            ) : (
              // reset form
              <ResetForm
                formSetup={formSetup}
                formTypeOpened={formTypeOpened}
                changeFormType={setFormTypeOpened}
                onSubmitRecoverPassword={onSubmitRecoverPassword}
              />
            )}
          </TabPanel>

          {/* register form */}
          <TabPanel>
            <RegisterForm
              formSetup={formSetup}
              formTypeOpened={formTypeOpened}
              show={show}
              handleClick={handleClick}
              onSubmit={onSubmit}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
