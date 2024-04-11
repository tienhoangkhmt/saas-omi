'use client'

import { Box } from '@chakra-ui/react'
import { LayoutSidebarNav } from '../components/double-sidebar'
import HeaderLayout from '../components/nav-layout'
import { AppLayout, AppLayoutProps } from './app-layout'

/**
 * Default sidebar layout.
 */
export const SidebarLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebar = <LayoutSidebarNav />,
}) => {
  return (
    <Box>
      <AppLayout sidebar={sidebar}>
        <HeaderLayout />
        {children}
      </AppLayout>
    </Box>
  )
}
