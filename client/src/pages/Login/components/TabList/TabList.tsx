import { TabList as UITabList, Tab } from '@chakra-ui/react'

import { EnumFormType } from '../../types'

export const TabList = ({
  setFormTypeOpened,
}: {
  setFormTypeOpened: React.Dispatch<React.SetStateAction<EnumFormType>>
}) => (
  <UITabList>
    <Tab
      onClick={() => {
        setFormTypeOpened(EnumFormType.login)
      }}
    >
      Login
    </Tab>
    <Tab
      onClick={() => {
        setFormTypeOpened(EnumFormType.register)
      }}
    >
      Register
    </Tab>
  </UITabList>
)
