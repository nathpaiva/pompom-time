import { TabList as UITabList, Tab } from '@chakra-ui/react'

import { EnumFormType } from '../../types'

export const TabList = ({
  setFormTypeOpened,
}: {
  setFormTypeOpened: React.Dispatch<React.SetStateAction<EnumFormType>>
}) => (
  <UITabList>
    <Tab
      data-testid={`${EnumFormType.login}-tab`}
      onClick={() => {
        setFormTypeOpened(EnumFormType.login)
      }}
    >
      Login
    </Tab>

    <Tab
      data-testid={`${EnumFormType.register}-tab`}
      onClick={() => {
        setFormTypeOpened(EnumFormType.register)
      }}
    >
      Register
    </Tab>
  </UITabList>
)
