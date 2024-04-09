'use client'

import { LayoutSidebarNav } from '../components/double-sidebar'
import { AppLayout, AppLayoutProps } from './app-layout'

/**
 * Default sidebar layout.
 */
export const SidebarLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebar = <LayoutSidebarNav />,
  ...rest
}) => {
  return (
    <AppLayout sidebar={sidebar} {...rest}>
      {children}
    </AppLayout>
  )
}
