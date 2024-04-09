export interface FocusState {
  row: number
  column: number
}

export type FocusMode = 'grid' | 'list'

export interface FocusModelOptions {
  mode?: FocusMode
  debug?: boolean
  onFocusChange?: (focus: FocusState) => void
  getSelectedRows?: () => any[]
  onToggleRowSelected?: (row: number) => void
  onSelectRows?: (start: number, end?: number) => void
  onExpandRow?: (row: number) => void
  onCollapseRow?: (row: number) => void
}

const ROW_SELECTORS = 'tr, [role="row"]'
const BODY_ROW_SELECTORS = 'tbody tr, tbody [role="row"]'
const SELECTED_ROW_SELECTORS =
  'tr[aria-selected="true"], [role="row"][aria-selected="true"]'
const CELL_SELECTORS = 'td, [role="gridcell"]'
const FOCUSABLE_SELECTORS = 'a, button, input, textarea, select, [tabindex]'

const SPACEBAR = ' '

const closest = (target: HTMLElement | EventTarget, selector: string) => {
  const el = target as HTMLElement
  if (el.matches(selector)) {
    return el
  }
  return el.closest(selector)
}

const matches = (target: HTMLElement | EventTarget, selector: string) => {
  return (target as HTMLElement).matches(selector)
}

export class FocusModel {
  #focusedRow = 0
  #focusedCol = 0

  #highlightedRow: number | null = null
  #highlightedCol: number | null = null

  #initialSelectedRow: number | null = null

  enabled = true

  constructor(
    public gridEl: HTMLElement,
    private options: FocusModelOptions,
  ) {
    this.init()
  }

  init() {
    this.#debug('init', this.gridEl, this.options)

    this.gridEl?.addEventListener('mousedown', this.handleMouseDown)
    this.gridEl?.addEventListener('keydown', this.handleKeyDown)
    this.gridEl?.addEventListener('mouseover', this.handleMouseOver)
  }

  #debug = (...args: any[]) => {
    if (this.options.debug === true) {
      console.debug('[FocusModel]', ...args)
    }
  }

  handleMouseDown = (e: MouseEvent) => {
    const target = e.target as EventTarget

    const mode = this.options.mode

    const row = closest(target, ROW_SELECTORS) as HTMLTableRowElement

    if (!row || row.dataset.row === undefined) {
      return
    }

    const rowIndex = Number.parseInt(row.dataset.row)

    if (mode === 'list') {
      if (!matches(target, FOCUSABLE_SELECTORS)) {
        row.focus()
      }

      this.setFocusedRow(rowIndex)
    } else if (mode === 'grid') {
      const cell = closest(target, CELL_SELECTORS) as HTMLTableCellElement

      if (!cell || cell !== target) {
        return
      }

      const colIndex = Array.from(row.querySelectorAll(CELL_SELECTORS)).indexOf(
        cell,
      )

      this.setFocusedCol(rowIndex, colIndex)
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    let focusedRow = this.#focusedRow
    let focusedCol = this.#focusedCol

    const mode = this.options.mode

    const keyMap: Record<KeyboardEvent['key'], () => void> = {
      ArrowDown: () => {
        const index = focusedRow + 1

        if (!this.isValidRow(index)) {
          return
        }

        if (e.shiftKey) {
          if (!this.#initialSelectedRow) {
            this.#initialSelectedRow = focusedRow
          }

          if (!this.hasSelectedRows()) {
            this.selectRows(focusedRow)
            return
          }

          const isBefore = index < this.#initialSelectedRow!

          isBefore
            ? this.selectRows(index, this.#initialSelectedRow!)
            : this.selectRows(this.#initialSelectedRow!, index)
        } else {
          this.#initialSelectedRow = null
        }

        focusedRow = index
      },
      ArrowUp: () => {
        const index = focusedRow - 1

        if (!this.isValidRow(index)) {
          return
        }

        if (e.shiftKey) {
          if (!this.#initialSelectedRow) {
            this.#initialSelectedRow = focusedRow
          }

          if (!this.hasSelectedRows()) {
            this.selectRows(focusedRow)
            return
          }

          const isAfter = index > this.#initialSelectedRow!

          isAfter
            ? this.selectRows(this.#initialSelectedRow!, index)
            : this.selectRows(index, this.#initialSelectedRow!)
        } else {
          this.#initialSelectedRow = null
        }

        focusedRow = index
      },
      Tab: () => {
        if (e.shiftKey) {
          if (mode === 'grid' && this.isValidCell(focusedRow, focusedCol - 1)) {
            focusedCol -= 1
          } else if (this.isValidRow(focusedRow - 1)) {
            focusedRow -= 1
          }
        } else {
          if (mode === 'grid' && this.isValidCell(focusedRow, focusedCol + 1)) {
            focusedCol += 1
          } else if (this.isValidRow(focusedRow + 1)) {
            focusedRow += 1
          }
        }
      },
      ArrowRight: () => {
        if (mode === 'grid' && this.isValidCell(focusedRow, focusedCol + 1)) {
          focusedCol += 1
        } else if (mode === 'list') {
          this.options.onExpandRow?.(focusedRow)
        }
      },
      ArrowLeft: () => {
        if (mode === 'grid' && this.isValidCell(focusedRow, focusedCol - 1)) {
          focusedCol -= 1
        } else if (mode === 'list') {
          this.options.onCollapseRow?.(focusedRow)
        }
      },
      Home: () => {
        if (mode === 'grid') {
          focusedCol = 0
        }

        if (e.ctrlKey || mode === 'list') {
          focusedRow = 0
        }
      },
      End: () => {
        const rows =
          this.gridEl?.querySelectorAll<HTMLTableRowElement>(
            BODY_ROW_SELECTORS,
          ) ?? []

        const lastRowIndex = rows.length - 1

        if (mode === 'grid') {
          focusedCol =
            rows[lastRowIndex].querySelectorAll<HTMLTableCellElement>(
              CELL_SELECTORS,
            )?.length - 1 ?? 0
        }

        if (e.ctrlKey || mode === 'list') {
          focusedRow = lastRowIndex
        }
      },
      // space
      [SPACEBAR]: () => {
        if (this.options.onToggleRowSelected) {
          this.options.onToggleRowSelected?.(focusedRow)
          e.preventDefault()
        }
      },
      Enter: () => {
        const el = target.querySelector<HTMLElement>(FOCUSABLE_SELECTORS)
        if (el) {
          this.enabled = false

          el.click()
        }
      },
    }

    if (this.enabled) {
      keyMap[e.key]?.()
    } else if (e.key === 'Escape') {
      this.enabled = true

      switch (mode) {
        case 'grid':
          this.setFocusedCol(focusedRow, focusedCol)
          break
        case 'list':
          this.setFocusedRow(focusedRow)
          break
      }
    }

    if (focusedRow === this.#focusedRow && focusedCol === this.#focusedCol) {
      return
    }

    mode === 'grid'
      ? this.setFocusedCol(focusedRow, focusedCol)
      : this.setFocusedRow(focusedRow)

    e.preventDefault() // prevent scrolling
  }

  handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement

    const row = closest(target, ROW_SELECTORS) as HTMLTableRowElement

    if (!row || row.dataset.row === undefined) {
      return
    }

    const rowIndex = Number.parseInt(row.dataset.row)

    this.#highlightedRow = rowIndex

    if (this.options.mode === 'grid') {
      const cell = closest(target, CELL_SELECTORS) as HTMLTableCellElement

      if (!cell) {
        return
      }

      const colIndex = Array.from(row.querySelectorAll(CELL_SELECTORS)).indexOf(
        cell,
      )

      if (colIndex === this.#highlightedCol) {
        return
      }

      this.#highlightedCol = colIndex
    }
  }

  setFocusedRow = (row: number) => {
    this.gridEl
      ?.querySelector<HTMLTableRowElement>(`[data-row="${row}"]`)
      ?.focus()

    this.#focusedRow = row

    this.options.onFocusChange?.({ row, column: 0 })
  }

  setFocusedCol = (row: number, col: number) => {
    this.gridEl
      ?.querySelector<HTMLTableCellElement>(
        `[data-row="${row}"] > [data-col="${col}"]`,
      )
      ?.focus()

    // make sure we enable keyboard events
    this.enabled = true

    this.#focusedRow = row
    this.#focusedCol = col

    this.options.onFocusChange?.({ row, column: col })
  }

  isValidRow(row: number) {
    return !!this.gridEl?.querySelector<HTMLTableRowElement>(
      `[data-row="${row}"]`,
    )
  }

  isValidCell(row: number, col: number) {
    return !!this.gridEl?.querySelector<HTMLTableCellElement>(
      `[data-row="${row}"] > [data-col="${col}"]`,
    )
  }

  hasSelectedRows() {
    return this.options.getSelectedRows
      ? this.options.getSelectedRows().length
      : this.gridEl?.querySelector(SELECTED_ROW_SELECTORS) !== null
  }

  selectRows(start: number, end?: number) {
    this.options.onSelectRows?.(start, end)
  }

  get focusedRow() {
    return this.#focusedRow
  }

  get focusedCol() {
    return this.#focusedCol
  }

  destroy() {
    this.gridEl?.removeEventListener('mousedown', this.handleMouseDown)
    this.gridEl?.removeEventListener('mouseover', this.handleMouseOver)
    this.gridEl?.removeEventListener('keydown', this.handleKeyDown)
  }
}
