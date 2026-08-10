import { TabList as UITabList, Tab } from '@chakra-ui/react'

import { EnumFormType } from '../../types'

const tabStyles = {
  fontFamily: 'heading',
  fontWeight: '700',
  fontSize: '14px',
  color: 'pompom.textMuted',
  border: 'none',
  borderBottom: '2.5px solid transparent',
  _selected: {
    color: 'pompom.primary',
    borderColor: 'pompom.primary',
  },
}

export const TabList = ({
  setFormTypeOpened,
}: {
  setFormTypeOpened: React.Dispatch<React.SetStateAction<EnumFormType>>
}) => (
  <UITabList border="none">
    <Tab
      data-testid={`${EnumFormType.login}-tab`}
      onClick={() => {
        setFormTypeOpened(EnumFormType.login)
      }}
      sx={tabStyles}
    >
      Sign in
    </Tab>

    <Tab
      data-testid={`${EnumFormType.register}-tab`}
      onClick={() => {
        setFormTypeOpened(EnumFormType.register)
      }}
      sx={tabStyles}
    >
      Sign up
    </Tab>
  </UITabList>
)
