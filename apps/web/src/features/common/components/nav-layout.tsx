import { Button } from '@chakra-ui/react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarLink,
} from '@saas-ui/react'

import { SaasUILogo } from '@ui/lib/src/logo/saas-ui'

const HeaderLayout = () => {
  return (
    <Navbar borderBottomWidth="1px">
      <NavbarBrand>
        <SaasUILogo />
      </NavbarBrand>
      <NavbarContent justifyContent="flex-end" spacing="2">
        <NavbarItem>
          <Button >Login</Button>
        </NavbarItem>
        <NavbarItem>
          <Button variant="primary">Sign up</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default HeaderLayout
