import React from 'react'
import { Tab, TabList, TabPanel, TabPanels, Tabs, TabsProps } from '@chakra-ui/react'

export type tabItems = {
  key: number
  Component: React.ComponentType
  label: string,
  propsComponent: object
  // [key in keyof T]: string
}

interface ICustomTabsProps {
  tabs: tabItems[]
}

const CustomTabs: React.FC<ICustomTabsProps> = (props) => {
  return (
    <Tabs {...props}>
      <TabList>
        {props.tabs.map((tab) => (
          <Tab key={tab.key}>{tab.label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {props.tabs.map((tab) => {
          const { Component, propsComponent } = tab;

          return (
            <TabPanel key={tab.key}>
              <Component {...propsComponent} />
            </TabPanel>
          )
        })}
      </TabPanels>
    </Tabs>
  )
}

export default CustomTabs
