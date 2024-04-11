'use client'

import { lazy, useState } from 'react'

import { Box, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { ErrorPage, Toolbar } from '@saas-ui-pro/react'
import { SearchInput } from '@saas-ui/react'
import { useQuery } from '@tanstack/react-query'

import CustomAvatar from '@app/features/common/components/Ui/Avatar'
import GroupQuickInfo from '@app/features/common/components/Ui/GroupQuickInfo'
import CustomSelect from '@app/features/common/components/Ui/Select'
import CustomTabs, { tabItems } from '@app/features/common/components/Ui/Tabs'
import ListContacts from '@app/features/common/components/list-contacts'
import HeaderLayout from '@app/features/common/components/nav-layout'
import { useWorkspace } from '@app/features/common/hooks/use-workspace'

import { getDashboard } from '@api/client'

import {
  DateRange,
  DateRangePicker,
  DateRangePresets,
  SegmentedControl,
  getRangeDiff,
  getRangeValue,
} from '@ui/lib'
import MessItems from '@app/features/common/components/Ui/GroupChatSocial/mess.item'

const WrapperBox = styled(Box)`
  &::-webkit-scrollbar {
    width: 15px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    width: 10px;
    border: 3px solid transparent;
    background-clip: content-box;
    background-color: #a8a7a7;
  }
`

const tabs: tabItems[] = [
  {
    key: 1,
    label: 'Activity',
    propsComponent: {},
    Component: lazy(
      () => import('@app/features/common/components/Ui/TimeLine'),
    ),
  },
  {
    key: 2,
    label: 'Info',
    propsComponent: {},
    Component: lazy(
      () => import('@app/features/common/components/list-contacts'),
    ),
  },
  {
    key: 3,
    label: 'Task',
    propsComponent: {},
    Component: lazy(
      () => import('@app/features/common/components/Ui/TimeLine'),
    ),
  },
  {
    key: 4,
    label: 'Note',
    propsComponent: {},
    Component: lazy(
      () => import('@app/features/common/components/Ui/TimeLine'),
    ),
  },
]

export function DashboardPage() {
  const workspace = useWorkspace()

  const [range, setRange] = useState('30d')
  const [dateRange, setDateRange] = useState(getRangeValue('30d'))
  const onPresetChange = (preset: string) => {
    if (preset !== 'custom') {
      setDateRange(getRangeValue(preset as DateRangePresets))
    }
    setRange(preset)
  }

  const onRangeChange = (range: DateRange) => {
    const diff = getRangeDiff(range)
    if ([1, 3, 7, 30].includes(diff)) {
      setRange(`${diff}`)
    } else {
      setRange('custom')
    }

    setDateRange(range)
  }

  const { data, isLoading } = useQuery({
    queryKey: [
      'dashboard',
      {
        workspace,
        startDate: dateRange.start.toString(),
        endDate: dateRange.end.toString(),
      },
    ] as const,
    queryFn: ({ queryKey }) => getDashboard(queryKey[1]),
    enabled: !!workspace,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const organization = data?.organization

  if (!isLoading && !organization) {
    return (
      <ErrorPage
        title="No organization found"
        description={`We couldn't find a organization named ${workspace}`}
      />
    )
  }

  const toolbar = <HeaderLayout />

  const footer = (
    <Toolbar justifyContent="flex-start" variant="secondary" size="xs">
      <SegmentedControl
        size="xs"
        segments={[
          {
            id: '1d',
            label: '1d',
          },
          {
            id: '3d',
            label: '3d',
          },
          {
            id: '7d',
            label: '7d',
          },
          { id: '30d', label: '30d' },
          { id: 'custom', label: 'Custom' },
        ]}
        value={range}
        onChange={onPresetChange}
      />
      <DateRangePicker value={dateRange} onChange={onRangeChange} />
    </Toolbar>
  )

  const border = '1px solid #EAEAEA'

  return (
    <WrapperBox
      className="scroll-bar-global"
      justifyContent="space-between"
      overflowY="hidden"
      display="flex"
      h="100%"
    >
      {/* <PageBody
        contentWidth="container.2xl"
        bg="page-body-bg-subtle"
        py={{ base: 4, xl: 8 }}
        px={{ base: 4, xl: 8 }}
      >    */}
      <Box flex="25%">
        <Box borderBottom={border} h={16}>
          <Text>Conversation</Text>
        </Box>
        <SearchInput placeholder="Search" />
        <Box>
          <ListContacts />
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
        borderRight={border}
        borderLeft={border}
        flex="45%"
      >
        <Box display="flex" borderBottom={border} h={16}>
          <GroupQuickInfo userName="Hoang" />
          <CustomSelect name="s" />
        </Box>
        <WrapperBox
          padding={2}
          // flex="1 1 auto"
          overflowY="auto"
          overflowX="hidden"
          h="100%"
        >
          <MessItems isRight />
          <MessItems />
          <MessItems isRight />
          <MessItems />
          <MessItems isRight />
          <MessItems />
        </WrapperBox>
        <Box bottom={0} bg="green.500" w="100%" borderBottom={border} h={16}>
          <CustomTabs tabs={tabs} />
        </Box>
      </Box>

      <Box flex="30%">
        <Box h={16} borderBottom={border}>
          <Text>Contact</Text>
        </Box>
        <Box>
          <Box textAlign="center">
            <CustomAvatar isBadge={false} />
            <Box display="flex" justifyContent="center">
              <Text>goi</Text>
              <Text>nhan tin</Text>
              <Text>tele</Text>
              <Text>gmail</Text>
            </Box>
          </Box>
          <CustomTabs tabs={tabs} />
        </Box>
      </Box>
    </WrapperBox>
  )
}
