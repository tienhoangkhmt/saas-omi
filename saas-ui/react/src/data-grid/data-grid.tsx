'use client'

import * as React from 'react'

import {
  BoxProps,
  SystemStyleObject,
  Table,
  TableCellProps,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Thead,
  ThemingProps,
  Tr,
  chakra,
  useCallbackRef,
  useMergeRefs,
  useMultiStyleConfig,
  useTheme,
} from '@chakra-ui/react'
import { callAllHandlers, cx, dataAttr, runIfFn } from '@chakra-ui/utils'
import {
  Cell,
  ColumnSort,
  Row,
  Table as TableInstance,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { VirtualizerOptions, useVirtualizer } from '@tanstack/react-virtual'

import { DefaultDataGridCell } from './data-grid-cell'
import { getSelectionColumn } from './data-grid-checkbox'
import { DataGridIcons, DataGridProvider } from './data-grid-context'
import { getExpanderColumn } from './data-grid-expander'
import { DataGridHeader } from './data-grid-header'
import { DataGridTranslations } from './data-grid-translations'
import { FocusChangeHandler } from './data-grid.types'
import { escapeId } from './data-grid.utils'
import { FocusMode, useFocusModel } from './focus-model'
import { NoResults } from './no-results'

export interface DataGridProps<Data extends object>
  extends Omit<TableOptions<Data>, 'getCoreRowModel'>,
    ThemingProps<'SuiDataGrid'> {
  /**
   * The React Table instance reference
   */
  instanceRef?: React.Ref<TableInstance<Data>>
  /**
   * Enable sorting on all columns
   */
  isSortable?: boolean
  /**
   * Enable row selection
   */
  isSelectable?: boolean
  /**
   * Enable row hover styles
   */
  isHoverable?: boolean
  /**
   * Enable expandable rows
   */
  isExpandable?: boolean
  /**
   * Triggers whenever the row selection changes.
   * @params rows The selected row id'
   */
  onSelectedRowsChange?: (rows: Array<string>) => void
  /**
   * Triggers when sort changed.
   * Use incombination with `manualSortBy` to enable remote sorting.
   */
  onSortChange?: (columns: ColumnSort[]) => void
  /**
   * Callback fired when a row or cell is focused.
   */
  onFocusChange?: FocusChangeHandler<Data>
  /**
   * Callback fired when a row is clicked.
   */
  onRowClick?: (row: Row<Data>, e: React.MouseEvent, meta?: any) => void
  /**
   * Callback fired when clear filters is clicked.
   */
  onResetFilters?: () => void
  /**
   * Use this for controlled pagination.
   */
  pageCount?: number
  /**
   * Empty state component, rendered when there is no data and no filters enabled.
   */
  emptyState?: React.FC<any>
  /**
   * No results component, rendered when filters are enabled and there are no results.
   */
  noResults?: React.FC<any>
  /**
   * Enable keyboard navigation
   * @default 'list'
   */
  focusMode?: FocusMode
  /**
   * The table class name attribute
   */
  className?: string
  /**
   * Grid styles
   */
  sx?: SystemStyleObject
  /**
   * Set to false to disable sticky headers
   * @default true
   */
  stickyHeader?: boolean
  /**
   * DataGrid children
   */
  children?: React.ReactNode
  /**
   * Callback fired when the grid is scrolled.
   */
  onScroll?: React.UIEventHandler<HTMLDivElement>
  /**
   * React Virtual props
   * @deprecated Use rowVirtualizerOptions instead
   */
  virtualizerProps?: VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>
  /**
   * React Virtual options for the column virtualizer
   * @see https://tanstack.com/virtual/v3/docs/adapters/react-virtual
   */
  columnVirtualizerOptions?: VirtualizerOptions<
    HTMLDivElement,
    HTMLTableRowElement
  > & { enabled?: boolean }
  /**
   * React Virtual options for the row virtualizer
   * @see https://tanstack.com/virtual/v3/docs/adapters/react-virtual
   */
  rowVirtualizerOptions?: VirtualizerOptions<
    HTMLDivElement,
    HTMLTableRowElement
  > & { enabled?: boolean }
  /**
   * Custom icons
   * This prop is memoized and will not update after initial render.
   */
  icons?: DataGridIcons
  /**
   * Pass custom properties to child (slots) components.
   */
  slotProps?: {
    container?:
      | BoxProps
      | ((params: { table: TableInstance<Data> }) => BoxProps)
    inner?: BoxProps | ((params: { table: TableInstance<Data> }) => BoxProps)
    table?:
      | TableProps
      | ((params: { table: TableInstance<Data> }) => TableProps)
    row?:
      | TableRowProps
      | ((params: {
          row: Row<Data>
          table: TableInstance<Data>
        }) => TableRowProps)
    cell?:
      | TableCellProps
      | ((params: {
          cell: Cell<Data, any>
          table: TableInstance<Data>
        }) => TableCellProps)
  }
  translations?: Partial<DataGridTranslations>
}

export const DataGrid = React.forwardRef(
  <Data extends object>(
    props: DataGridProps<Data>,
    ref: React.ForwardedRef<HTMLTableElement>,
  ) => {
    const {
      instanceRef,
      columns,
      data,
      initialState,
      getSubRows = (row: any) => row.subRows,
      defaultColumn,
      getRowId,
      isSortable,
      isSelectable,
      isHoverable = true,
      isExpandable,
      onSelectedRowsChange,
      onSortChange,
      onFocusChange,
      onRowClick,
      onResetFilters,
      onScroll,
      emptyState: EmptyStateComponent = NoResults,
      noResults: NoResultsComponent = NoResults,
      pageCount,
      focusMode = 'list',
      colorScheme,
      size,
      variant,
      stickyHeader = true,
      className,
      sx,
      virtualizerProps,
      columnVirtualizerOptions,
      rowVirtualizerOptions = virtualizerProps,
      icons,
      slotProps,
      children,
      ...rest
    } = props

    const theme = useTheme()
    const styleConfig = theme.components?.SuiDataGrid

    const styles = useMultiStyleConfig('SuiDataGrid', {
      size,
      variant,
      colorScheme,
    })

    const instance = useReactTable<Data>({
      columns: React.useMemo(() => {
        const selectionColumn =
          columns?.[0]?.id === 'selection' ? columns[0] : undefined

        const expanderColumn = columns.find(({ id }) => id === 'expand')

        return getSelectionColumn<Data>(isSelectable, selectionColumn)
          .concat(getExpanderColumn(isExpandable, expanderColumn))
          .concat(
            columns
              ?.filter(({ id }) => id !== 'selection')
              .map((column: any) => {
                if (!column.accessorKey) {
                  column.accessorKey = column.id
                }
                if (!column.cell) {
                  column.cell = DefaultDataGridCell
                }
                return column
              }),
          )
      }, [columns]),
      data,
      initialState: React.useMemo(() => initialState, []),
      defaultColumn,
      getSubRows,
      getRowId,
      manualPagination: pageCount !== undefined,
      pageCount,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      ...rest,
    })

    const focusModel = useFocusModel({
      mode: focusMode,
      table: instance,
      onFocusChange,
    })

    // This exposes the useTable api through the tableRef
    React.useImperativeHandle(instanceRef, () => instance, [instanceRef])

    const state = instance.getState()
    const rows = instance.getRowModel().rows
    const visibleColumns = instance.getVisibleLeafColumns()

    const scrollRef = React.useRef<HTMLDivElement>(null)

    const columnVirtualizer = useVirtualizer({
      count: visibleColumns.length,
      estimateSize: (index) => visibleColumns[index].getSize(),
      getScrollElement: () => scrollRef.current,
      horizontal: true,
      overscan: 3,
      ...columnVirtualizerOptions,
    })

    const rowVirtualizer = useVirtualizer({
      getScrollElement: () => scrollRef.current,
      estimateSize: () => {
        switch (size) {
          case 'xl':
            return 69
          case 'lg':
            return 61
          case 'sm':
            return 45
          case 'md':
          default:
            return 53
        }
      },
      count: rows.length,
      indexAttribute: 'data-row',
      overscan: 10,
      ...rowVirtualizerOptions,
    })

    const virtualColumns = columnVirtualizer.getVirtualItems()
    const virtualRows = rowVirtualizer.getVirtualItems()
    const totalSize = rowVirtualizer.getTotalSize()

    const _onSelectedRowsChange = useCallbackRef(onSelectedRowsChange)

    React.useEffect(() => {
      _onSelectedRowsChange?.(Object.keys(state.rowSelection))
    }, [_onSelectedRowsChange, state.rowSelection, instance])

    const _onSortChange = useCallbackRef(onSortChange)

    React.useEffect(() => {
      _onSortChange?.(state.sorting)
    }, [_onSortChange, state.sorting])

    const noResults =
      !rows.length &&
      (state.columnFilters.length || state.globalFilter ? (
        <NoResultsComponent onReset={onResetFilters} />
      ) : (
        <EmptyStateComponent />
      ))

    const innerStyles = {
      ...styles.inner,
      ...(noResults ? { display: 'flex', alignItems: 'center' } : {}),
    }

    let virtualPaddingLeft: number | undefined
    let virtualPaddingRight: number | undefined

    if (columnVirtualizer && virtualColumns?.length) {
      virtualPaddingLeft = virtualColumns[0]?.start ?? 0
      virtualPaddingRight =
        columnVirtualizer.getTotalSize() -
        (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
    }

    const virtualPaddingTop =
      virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
    const virtualPaddingBottom =
      virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0

    const { columnSizing, columnSizingInfo, columnVisibility } = state

    const columnSizeVars = React.useMemo(() => {
      const headers = instance.getFlatHeaders()
      const colSizes: { [key: string]: number } = {}
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i]!
        colSizes[`--header-${escapeId(header.id)}-size`] = header.getSize()
        colSizes[`--col-${escapeId(header.column.id)}-size`] =
          header.column.getSize()
      }
      return colSizes
    }, [columns, columnSizing, columnSizingInfo, columnVisibility])

    const tableProps = runIfFn(slotProps?.table, { table: instance })

    const table = (
      <Table
        ref={useMergeRefs(ref, focusModel.gridRef)}
        {...tableProps}
        className={cx('sui-data-grid', tableProps?.className)}
        styleConfig={styleConfig}
        colorScheme={colorScheme}
        size={size}
        variant={variant}
        sx={sx}
        style={{
          ...columnSizeVars,
        }}
      >
        <Thead data-sticky={dataAttr(stickyHeader)}>
          {instance.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {virtualPaddingLeft ? (
                <th style={{ display: 'flex', width: virtualPaddingLeft }} />
              ) : null}
              {virtualColumns.map((vc) => {
                const header = headerGroup.headers[vc.index]
                return (
                  <DataGridHeader
                    key={header.id}
                    header={header}
                    isSortable={isSortable}
                  />
                )
              })}
              {virtualPaddingRight ? (
                <th style={{ display: 'flex', width: virtualPaddingRight }} />
              ) : null}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {virtualPaddingTop > 0 && (
            <tr>
              <td style={{ height: `${virtualPaddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]
            const visibleCells = row.getVisibleCells()

            const onClick = (e: React.MouseEvent) => onRowClick?.(row, e)

            const ariaProps: TableRowProps = {}
            if (isExpandable) {
              ariaProps['aria-expanded'] = row.getIsExpanded()
            }
            if (isSelectable) {
              ariaProps['aria-selected'] = row.getIsSelected()
            }

            const rowProps = runIfFn(slotProps?.row, { row, table: instance })

            return (
              <Tr
                {...rowProps}
                ref={rowVirtualizer.measureElement}
                key={virtualRow.index}
                onClick={callAllHandlers(onClick, rowProps?.onClick)}
                data-row={virtualRow.index}
                data-selected={dataAttr(row.getIsSelected())}
                data-hover={dataAttr(isHoverable)}
                {...ariaProps}
                {...focusModel.getRowProps(row)}
                sx={{
                  '--data-grid-row-depth': String(row.depth),
                  ...rowProps?.sx,
                }}
              >
                {virtualPaddingLeft ? (
                  <td style={{ display: 'flex', width: virtualPaddingLeft }} />
                ) : null}
                {virtualColumns.map((vc) => {
                  const cell = visibleCells[vc.index]
                  const meta = cell.column.columnDef.meta ?? {}

                  const colId = escapeId(cell.column.id)

                  const cellProps = runIfFn(slotProps?.cell, {
                    cell,
                    table: instance,
                  })

                  return (
                    <Td
                      key={cell.id}
                      isNumeric={meta.isNumeric}
                      data-col={vc.index}
                      flex={`var(--col-${colId}-size) 0 auto`}
                      width={`calc(var(--col-${colId}-size) * 1px)`}
                      minWidth={`max(var(--col-${colId}-size) * 1px, 40px)`}
                      {...focusModel.getCellProps(cell)}
                      {...meta.cellProps}
                      {...cellProps}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  )
                })}
                {virtualPaddingRight ? (
                  <td style={{ display: 'flex', width: virtualPaddingRight }} />
                ) : null}
              </Tr>
            )
          })}
          {virtualPaddingBottom > 0 && (
            <tr>
              <td style={{ height: `${virtualPaddingBottom}px` }} />
            </tr>
          )}
        </Tbody>
      </Table>
    )

    const containerProps = runIfFn(slotProps?.container, { table: instance })
    const innerProps = runIfFn(slotProps?.inner, { table: instance })

    return (
      <DataGridProvider<Data>
        instance={instance}
        colorScheme={colorScheme}
        variant={variant}
        size={size}
        icons={icons}
      >
        <chakra.div
          {...containerProps}
          className={cx('sui-data-grid', className, containerProps?.className)}
          __css={styles.container}
        >
          <chakra.div
            {...innerProps}
            ref={scrollRef}
            className={cx('sui-data-grid__inner', innerProps?.className)}
            __css={innerStyles}
            onScroll={onScroll}
          >
            {noResults || table}
          </chakra.div>
          {children}
        </chakra.div>
      </DataGridProvider>
    )
  },
) as (<Data extends object>(
  props: DataGridProps<Data> & {
    ref?: React.ForwardedRef<HTMLTableElement>
  },
) => React.ReactElement) & { displayName?: string }

DataGrid.displayName = 'DataGrid'
