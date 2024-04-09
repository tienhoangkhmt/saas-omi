import * as React from 'react'

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Stack,
  TableRowProps,
  Tr,
} from '@chakra-ui/react'
import { rand, randFirstName, randUser } from '@ngneat/falso'
import {
  AppShell,
  ChevronDownIcon,
  ChevronUpIcon,
  ContextMenu,
  ContextMenuList,
  ContextMenuTrigger,
  EmptyState,
  OverflowMenu,
} from '@saas-ui/react'
import { Meta } from '@storybook/react'
import {
  RiAddFill,
  RiArrowDownFill,
  RiArrowUpFill,
  RiSubtractFill,
} from 'react-icons/ri'

import {
  ColumnDef,
  ColumnFiltersState,
  DataGrid,
  DataGridCell,
  DataGridCheckbox,
  DataGridProps,
  PaginationState,
  SortingState,
  TableInstance,
  useColumnVisibility,
  useColumns,
} from '.'
import { Page, PageBody, PageHeader } from '../page'
import { Toolbar } from '../toolbar'
import { DataGridPagination } from './data-grid-pagination'

export default {
  title: 'Components/Data Display/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: any) => (
      <Container mb="40px" maxW="container.xl" height="$100vh">
        <Story />
      </Container>
    ),
  ],
} as Meta

const Template: React.FC<DataGridProps<ExampleData>> = ({
  data,
  columns,
  initialState,
  ...args
}) => (
  <DataGrid<ExampleData>
    data={data}
    columns={columns}
    initialState={initialState}
    {...args}
  />
)

const statuses = {
  new: {
    label: 'New',
  },
  active: {
    label: 'Active',
  },
  inactive: {
    label: 'Inactive',
  },
}

const StatusCell: DataGridCell<ExampleData> = (cell) => {
  const status = statuses[cell.getValue<keyof typeof statuses>()]
  return <Box>{status.label}</Box>
}

const ActionCell: DataGridCell<ExampleData> = () => {
  return (
    <Stack onClick={(e) => e.stopPropagation()} alignItems="flex-end">
      <OverflowMenu size="xs">
        <MenuItem>Delete</MenuItem>
      </OverflowMenu>
    </Stack>
  )
}

const columns: ColumnDef<ExampleData>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    meta: {
      isNumeric: true,
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'address.country',
    header: 'Country',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: StatusCell,
  },
  {
    accessorKey: 'action',
    header: '',
    cell: ActionCell,
    size: 50,
    enableSorting: false,
  },
]

const makeData = (length = 1000) => {
  return randUser({
    length,
  }).map((user) => {
    return {
      ...user,
      phone: user.phone.split(',')[0],
      status: rand(['new', 'active', 'inactive']),
    }
  })
}

const data = makeData()

type ExampleData = {
  status: string
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  img: string
  address: {
    street: string
    city: string
    zipCode: string
    country?: string
  }
  phone: string
}
const initialState = {
  columnVisibility: { phone: false, employees: false },
}

export const Basic = {
  render: Template,
  args: {
    columns,
    data,
    initialState,
  },
}

export const Sortable = {
  render: Template,
  args: {
    columns,
    data,
    initialState,
    isSortable: true,
  },
}

export const Selectable = {
  render: Template,
  args: {
    columns,
    data,
    initialState,
    isSelectable: true,
  },
}

export const ColorScheme = {
  render: Template,
  args: {
    columns,
    data,
    initialState,
    isSelectable: true,
    colorScheme: 'cyan',
  },
}

export const Empty = {
  render: Template,
  args: {
    columns,
    data: [],
    initialState,
    emptyState: () => (
      <EmptyState
        title="No data"
        description="There is no data to be displayed."
      />
    ),
  },
}

export const InitialSelected = {
  render: Template,
  args: {
    columns,
    data,
    initialState: {
      ...initialState,
      rowSelection: { 1: true },
    },
    isSelectable: true,
  },
}

export const SelectedChange = {
  render: Template,
  args: {
    columns,
    data,
    initialState,
    isSelectable: true,
    onSelectedRowsChange: (rows: string[]) => console.log(rows),
  },
}

export const SelectableAndSortable = {
  render: Template,
  args: {
    columns,
    data,
    initialState,
    isSortable: true,
    isSelectable: true,
  },
}

export const Numeric = {
  render: Template,
  args: {
    columns,
    data,
    initialState: {
      columnVisibility: { phone: true },
    },
  },
}

const withLinks = columns.concat().map((column) => {
  if (!('accessorKey' in column)) {
    return column
  }
  if (column.accessorKey === 'firstName') {
    return Object.assign({}, column, {
      meta: {
        href: (data: ExampleData) => {
          return `/customers/${data.id}`
        },
        ...column.meta,
      },
    })
  }
  return column
})

export const WithLink = {
  render: Template,
  args: {
    columns: withLinks,
    data,
    initialState,
  },
}

export const TableInstanceRef = () => {
  const ref = React.useRef<TableInstance<ExampleData>>(null)

  return (
    <>
      <Stack direction="row" mb="8">
        <Button onClick={() => ref.current?.toggleAllRowsSelected()}>
          Toggle select all
        </Button>
      </Stack>
      <DataGrid<ExampleData>
        instanceRef={ref}
        columns={columns}
        data={data}
        isSelectable
        isSortable
      />
    </>
  )
}

export const WithPagination = {
  render: () => {
    return (
      <Template
        data={data}
        columns={columns}
        initialState={{ pagination: { pageSize: 10 } }}
      >
        <DataGridPagination />
      </Template>
    )
  },
}

export const WithRemotePagination = {
  render: () => {
    const [page, setPage] = React.useState(0)

    const paginatedData = React.useMemo(() => {
      return data.slice(page, page + 100)
    }, [page])

    return (
      <Template
        data={paginatedData}
        columns={columns}
        pageCount={data.length}
        initialState={{
          pagination: {
            pageSize: 100,
          },
        }}
      >
        <DataGridPagination onChange={({ pageIndex }) => setPage(pageIndex)} />
      </Template>
    )
  },
}

export const WithControlledPagination = {
  render: () => {
    const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

    return (
      <Template
        data={data}
        columns={columns}
        onPaginationChange={setPagination}
        initialState={{
          pagination,
        }}
        state={{
          pagination,
        }}
      >
        <DataGridPagination />
      </Template>
    )
  },
}

export const WithRemoteSort = {
  render: () => {
    const [sort, setSort] = React.useState<SortingState>([])

    const sortedData = React.useMemo(() => {
      const key = sort[0]?.id
      const desc = sort[0]?.desc

      return data.concat().sort((a: any, b: any) => {
        if (key && a[key] > b[key]) {
          return desc ? -1 : 1
        }

        if (key && a[key] < b[key]) {
          return desc ? 1 : -1
        }

        return 0
      })
    }, [sort])

    return (
      <Template
        data={sortedData}
        columns={columns}
        isSortable
        state={{
          sorting: sort,
        }}
        enableMultiSort={false}
        onSortingChange={setSort}
      />
    )
  },
}

export const WithFilteredData = {
  render: () => {
    const ref = React.useRef<TableInstance<ExampleData>>(null)

    const filters = React.useMemo<ColumnFiltersState>(() => {
      return [
        {
          id: 'status',
          value: 'new',
        },
      ]
    }, [])

    const [status, setStatus] = React.useState('new')

    React.useEffect(() => {
      ref.current?.setColumnFilters(() => {
        return [
          {
            id: 'status',
            value: status,
          },
        ]
      })
    }, [status])

    return (
      <>
        <ButtonGroup isAttached mb="8">
          <Button isActive={status === 'new'} onClick={() => setStatus('new')}>
            New
          </Button>
          <Button
            isActive={status === 'active'}
            onClick={() => setStatus('active')}
          >
            Active
          </Button>
          <Button
            isActive={status === 'deleted'}
            onClick={() => setStatus('deleted')}
          >
            Deleted
          </Button>
        </ButtonGroup>
        <DataGrid<ExampleData>
          instanceRef={ref}
          columns={columns}
          data={data}
          isSelectable
          isSortable
          initialState={{
            pagination: {
              pageSize: 20,
            },
            columnFilters: filters,
          }}
        />
      </>
    )
  },
}

export const WithRemoteFilters = {
  render: () => {
    const ref = React.useRef<TableInstance<ExampleData>>(null)

    const [status, setStatus] = React.useState('new')

    const filteredData = React.useMemo(() => {
      return data.filter((row) => {
        return row.status === status
      })
    }, [status])

    return (
      <>
        <ButtonGroup isAttached mb="8">
          <Button isActive={status === 'new'} onClick={() => setStatus('new')}>
            New
          </Button>
          <Button
            isActive={status === 'active'}
            onClick={() => setStatus('active')}
          >
            Active
          </Button>
          <Button
            isActive={status === 'deleted'}
            onClick={() => setStatus('deleted')}
          >
            Deleted
          </Button>
        </ButtonGroup>
        <DataGrid<ExampleData>
          instanceRef={ref}
          columns={columns}
          data={filteredData}
          isSelectable
          isSortable
          initialState={{
            pagination: {
              pageSize: 20,
            },
          }}
        />
      </>
    )
  },
}

export const CustomStickyHeaders = {
  render: () => {
    return (
      <AppShell height="400px" top="0">
        <DataGrid<ExampleData>
          sx={{
            '& thead': {
              boxShadow: 'sm',
            },
          }}
          columns={columns}
          data={data}
          isSelectable
          isSortable
          initialState={{
            pagination: {
              pageSize: 100,
            },
          }}
        />
      </AppShell>
    )
  },
}

const columnsWithSelection: ColumnDef<ExampleData>[] = [
  {
    id: 'selection',
    cell: ({ row }) =>
      row.getCanSelect() ? (
        <DataGridCheckbox
          isChecked={row.getIsSelected()}
          isIndeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label={row.getIsSelected() ? 'Deselect row' : 'Select row'}
        />
      ) : null,
  },
  ...columns,
]

export const WithCustomCheckbox = {
  render: () => {
    return (
      <DataGrid<ExampleData>
        columns={columnsWithSelection}
        data={data}
        isSelectable
        isSortable
        initialState={{
          pagination: {
            pageSize: 100,
          },
        }}
        enableRowSelection={(row) => {
          return row.original.status !== 'inactive'
        }}
      />
    )
  },
}

const withSubRows = data.map((row) => {
  return {
    ...row,
    subRows: [
      {
        ...row,
        id: `${row.id}-1`,
      },
      {
        ...row,
        id: `${row.id}-2`,
      },
    ],
  }
})

export const WithSubRows = {
  render: () => {
    return (
      <DataGrid<ExampleData>
        columns={columns}
        data={withSubRows}
        isSortable
        isExpandable
        initialState={{
          pagination: {
            pageSize: 100,
          },
          expanded: {
            0: true,
          },
        }}
      />
    )
  },
}

const withDeepSubRows = data.map((row, i) => {
  return {
    ...row,
    subRows: [
      {
        ...data[i + 1],
        id: `${row.id}-1`,
        subRows: [
          {
            ...data[i + 2],
            id: `${row.id}-1-1`,
            subRows: [
              {
                ...data[i + 3],
                id: `${row.id}-1-1-1`,
              },
            ],
          },
        ],
      },
    ],
  }
})

export const WithDeepSubRows = {
  render: () => {
    return (
      <DataGrid<ExampleData>
        columns={columns}
        data={withDeepSubRows}
        isSortable
        isExpandable
        initialState={{
          pagination: {
            pageSize: 100,
          },
          columnVisibility: {
            phone: false,
          },
        }}
      />
    )
  },
}

const columnsWithExpander: ColumnDef<ExampleData>[] = [
  {
    id: 'expand',
    header: '',
    size: 1,
    enableSorting: false,
    meta: {
      cellProps: {
        px: 2,
        textOverflow: 'initial',
      },
    },
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <IconButton
          size="xs"
          isRound
          variant="ghost"
          fontSize="1.2em"
          aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          icon={row.getIsExpanded() ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={row.getToggleExpandedHandler()}
        />
      ) : null
    },
  },
  ...columns,
]

export const WithCustomExpander = {
  render: () => {
    return (
      <DataGrid<ExampleData>
        columns={columnsWithExpander}
        data={withSubRows}
        isSortable
        initialState={{
          pagination: {
            pageSize: 100,
          },
          expanded: {
            0: true,
          },
        }}
      />
    )
  },
}

export const WithSubRowsAndSelections = {
  render: () => {
    return (
      <DataGrid<ExampleData>
        columns={columns}
        data={withSubRows}
        variant="striped"
        isHoverable
        isSelectable
        isSortable
        isExpandable
        initialState={{
          pagination: {
            pageSize: 100,
          },
          expanded: {
            0: true,
          },
        }}
      />
    )
  },
}

export const WithCustomIcons = {
  render: () => {
    return (
      <DataGrid<ExampleData>
        columns={columns}
        data={withSubRows}
        isSortable
        isExpandable
        icons={{
          sortAscending: <RiArrowUpFill />,
          sortDescending: <RiArrowDownFill />,
          rowExpanded: <RiSubtractFill />,
          rowCollapsed: <RiAddFill />,
        }}
      />
    )
  },
}

const makeColumns = (num: number) =>
  [...Array(num)].map((_, i) => {
    return {
      accessorKey: i.toString(),
      header: 'Column ' + i.toString(),
      size: Math.floor(Math.random() * 150) + 100,
    }
  })

const makeVirtualizedData = (num: number, columns: ColumnDef<any>[]) =>
  [...Array(num)].map(() => ({
    ...Object.fromEntries(
      columns.map((col) => [
        'accessorKey' in col ? col.accessorKey : col.id,
        randFirstName(),
      ]),
    ),
  }))

type Person = ReturnType<typeof makeData>[0]

export const WithLargeDataSet = {
  render: () => {
    const columns = React.useMemo(() => makeColumns(1_000), [])

    const [data] = React.useState(makeVirtualizedData(1_000, columns))

    return (
      <DataGrid<Person>
        columns={columns}
        data={data}
        initialState={{
          pagination: {
            pageSize: -1, // render allow rows.
          },
        }}
      />
    )
  },
}

export const SlotProps = {
  render: () => {
    return (
      <DataGrid<ExampleData>
        columns={columns}
        data={withSubRows}
        isSortable
        slotProps={{
          row({ row }) {
            return {
              bg: row.original.status === 'new' ? 'red.50' : undefined,
            }
          },
          cell({ cell }) {
            return {
              bg: cell.column.id === 'status' ? 'blue.50' : undefined,
            }
          },
        }}
      />
    )
  },
}

export const UseColumns = {
  render: () => {
    const columns = useColumns<ExampleData>(
      (helper) => [
        helper.accessor('firstName', {
          header: 'First Name',
        }),
        helper.accessor('lastName', {
          header: 'Last Name',
        }),
        helper.accessor('email', {
          header: 'Email',
        }),
        helper.accessor('phone', {
          header: 'Phone',
          meta: {
            isNumeric: true,
          },
        }),
        helper.accessor('address.country', {
          header: 'Country',
        }),
        helper.accessor('status', {
          header: 'Status',
          cell: StatusCell,
        }),
        helper.display({
          id: 'action',
          header: '',
          cell: ActionCell,
          size: 50,
          enableSorting: false,
        }),
      ],
      [],
    )

    return <DataGrid<ExampleData> columns={columns} data={data} isSortable />
  },
}

const accessorKey = (column: ColumnDef<ExampleData>) => {
  if ('accessorKey' in column) {
    return column.accessorKey
  }
  return column.id
}

export const VisibleColumns = {
  render() {
    const columns = useColumns<ExampleData>(
      (helper) => [
        helper.accessor('firstName', {
          header: 'First Name',
        }),
        helper.accessor('lastName', {
          header: 'Last Name',
        }),
        helper.accessor('email', {
          header: 'Email',
        }),
        helper.accessor('phone', {
          header: 'Phone',
          meta: {
            isNumeric: true,
          },
        }),
        helper.accessor('address.country', {
          header: 'Country',
        }),
        helper.accessor('status', {
          header: 'Status',
          cell: StatusCell,
        }),
        helper.display({
          id: 'action',
          header: '',
          cell: ActionCell,
          size: 50,
          enableSorting: false,
        }),
      ],
      [],
    )

    const allColumns = columns
      .filter(
        (column) => !!accessorKey(column) && column.enableHiding !== false,
      )
      .map(accessorKey)

    const [visibleColumns, setVisibleColumns] = React.useState([
      'firstName',
      'email',
      'address.country',
    ])

    const columnVisibility = useColumnVisibility({
      columns,
      visibleColumns,
    })

    return (
      <Page title="Customers" height="400px">
        <PageHeader
          title="Customers"
          toolbar={
            <Toolbar>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button}>View</MenuButton>
                <MenuList zIndex="dropdown">
                  <MenuOptionGroup
                    value={visibleColumns}
                    type="checkbox"
                    onChange={(values) => setVisibleColumns(values as string[])}
                  >
                    {allColumns.map((c) => (
                      <MenuItemOption value={c}>{c}</MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </Toolbar>
          }
        />
        <PageBody p="0" contentWidth="full" position="relative">
          <DataGrid
            columns={columns.concat()}
            data={data}
            isSelectable
            state={{
              columnVisibility,
            }}
          />
        </PageBody>
      </Page>
    )
  },
}

export const RowContextMenu = {
  render() {
    return (
      <DataGrid
        columns={columns.concat()}
        data={data}
        slotProps={{
          row: () => ({
            as: RowWithContext,
          }),
        }}
      />
    )
  },
}

const RowWithContext = (props: TableRowProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Tr {...props} />
      </ContextMenuTrigger>
      <ContextMenuList>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Delete</MenuItem>
      </ContextMenuList>
    </ContextMenu>
  )
}
