import * as React from 'react'

import { Box, Image } from '@chakra-ui/react'
import {
  Sidebar,
  SidebarOverlay,
  SidebarProps,
  SidebarSection,
} from '@saas-ui/react'
import { CustomNavItem } from './Ui/NavBar'

export interface AppSidebarProps extends SidebarProps {}

export const LayoutSidebarNav: React.FC<AppSidebarProps> = (props) => {
  const { colorScheme } = props

  const [sidebar, setSideBar] = React.useState({
    open: false,
    itemId: null,
    width: 56,
  })

  const onClick = () => {
    console.log('click menu item')
    setSideBar((prev) => ({
      ...prev,
      open: !prev.open,
      width: !prev.open ? 280 : 56,
    }))
  }

  return (
    <Box display="flex">
      <Sidebar
        toggleBreakpoint={false}
        variant={sidebar.open ? 'default' : 'compact'}
        transition="width"
        transitionDuration="normal"
        width={sidebar.open ? '280px' : '14'}
        minWidth="auto"
        p={0}
        flexWrap={sidebar.open ? 'wrap' : 'nowrap'}
        overflow="hidden"
      >
        <SidebarSection p={0} direction={sidebar.open ? 'row' : 'column'}>
          <Sidebar
            variant="compact"
            bg="purple.500"
            borderWidth="0"
            spacing="3"
            _dark={{
              bg: 'purple.500',
            }}
            colorScheme={colorScheme}
            h="$100vh"
          >
            <SidebarSection>
              <Image
                src="https://saas-ui.dev/favicons/favicon-96x96.png"
                boxSize="7"
              />
            </SidebarSection>
            <SidebarSection>
              <CustomNavItem cursor="pointer" onClick={onClick} isActive>
                Home
              </CustomNavItem>
              <CustomNavItem
                cursor="pointer"
                onClick={onClick}
                nameIcon="users"
              >
                Users
              </CustomNavItem>
              <CustomNavItem
                cursor="pointer"
                onClick={onClick}
                nameIcon="setting"
              >
                Settings
              </CustomNavItem>
            </SidebarSection>
          </Sidebar>
        </SidebarSection>
        <Box flex="1 1 auto" minW={56}>
          <CustomNavItem cursor="pointer" onClick={onClick}>
            Home
          </CustomNavItem>
          <CustomNavItem cursor="pointer" onClick={onClick} nameIcon="users">
            Users
          </CustomNavItem>
          <CustomNavItem cursor="pointer" onClick={onClick} nameIcon="setting">
            Settings
          </CustomNavItem>
        </Box>
        <SidebarOverlay zIndex="1" />
      </Sidebar>
      {/* </HStack> */}
    </Box>
  )
}
