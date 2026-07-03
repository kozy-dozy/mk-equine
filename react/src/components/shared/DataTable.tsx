import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnSort,
    Row,
    CellContext,
} from '@tanstack/react-table'
import {
    forwardRef,
    useMemo,
    useRef,
    useEffect,
    useState,
    useImperativeHandle,
} from 'react'
import styled from 'styled-components'

import Checkbox from '@/components/ui/Checkbox'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'

import TableRow from './loaders/TableRow'
import Loading from './Loading'

import type { CheckboxProps } from '@/components/ui/Checkbox'
import type { MkEquineProps } from '@/components/ui/MkEquine'
import type { ForwardedRef, ChangeEvent } from 'react'


// Table container with shadow and radius
const TableContainer = styled.div`
    background: ${({ theme }) => theme.colors.bg.card};
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    overflow: hidden;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    width: 100%;
    /* Ensure inner table is also 100% */
    table {
        width: 100%;
    }
`


// Zebra striping for rows (theme-aware)
const StyledTBody = styled.tbody`
    tr:nth-child(even) {
        background: ${({ theme }) => theme.colors.bg.card};
    }
    tr {
        transition: background 0.2s;
    }
    tr:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
    }
`

// Enhanced header (fallback to bg.card)
const StyledTh = styled.th`
    font-size: ${({ theme }) => theme.fontSize.base};
    font-weight: 700;
    background: ${({ theme }) => theme.colors.bg.card};
    color: ${({ theme }) => theme.colors.text.primary};
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border.default};
    text-align: left;
    letter-spacing: 0.03em;
    white-space: nowrap;
`

// Enhanced cell
const StyledTd = styled.td`
    padding: 0 ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
    vertical-align: middle;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

type DataTableProps<T> = {
    columns: ColumnDef<T>[]
    data?: unknown[]
    loading?: boolean
    onCheckBoxChange?: (checked: boolean, row: T) => void
    onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
    onPaginationChange?: (page: number) => void
    onSelectChange?: (num: number) => void
    onSort?: (sort: OnSortParam) => void
    pageSizes?: number[]
    selectable?: boolean
    mkEquineAvatarColumns?: number[]
    mkEquineAvatarProps?: MkEquineProps
    pagingData?: {
        total: number
        pageIndex: number
        pageSize: number
    }
}

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void
    indeterminate: boolean
    onCheckBoxChange?: (event: CheckBoxChangeEvent) => void
    onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void
}

const StyledCheckbox = styled(Checkbox)`
    margin-bottom: 0;
`

const HeaderCell = styled.div<{ $sortable: boolean; $loading: boolean }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    ${({ $sortable }) => $sortable && `cursor: pointer; user-select: none;`}
    ${({ $loading }) => $loading && `pointer-events: none;`}
`

const SorterWrap = styled.span`
    margin-left: ${({ theme }) => theme.spacing.xs};
`

const PageSizeSelectWrap = styled.div`
    min-width: 130px;
`

const PaginationControls = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${({ theme }) => theme.spacing.md};
`

const { Tr, THead, Sorter } = Table

const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
    const {
        indeterminate,
        onChange,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        ...rest
    } = props

    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, indeterminate])

    const handleChange = (e: CheckBoxChangeEvent) => {
        onChange(e)
        onCheckBoxChange?.(e)
        onIndeterminateCheckBoxChange?.(e)
    }

    return (
        <StyledCheckbox
            ref={ref}
            onChange={(_, e) => handleChange(e)}
            {...rest}
        />
    )
}

export type DataTableResetHandle = {
    resetSorting: () => void
    resetSelected: () => void
}

function _DataTable<T>(
    props: DataTableProps<T>,
    ref: ForwardedRef<DataTableResetHandle>,
) {
    const {
        mkEquineAvatarColumns,
        columns: columnsProp = [],
        data = [],
        loading = false,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        onPaginationChange,
        onSelectChange,
        onSort,
        pageSizes = [10, 25, 50, 100],
        selectable = false,
        mkEquineAvatarProps,
        pagingData = {
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        },
    } = props

    const { pageSize, pageIndex, total } = pagingData

    const [sorting, setSorting] = useState<ColumnSort[] | null>(null)

    const pageSizeOption = useMemo(
        () =>
            pageSizes.map((number) => ({
                value: number,
                label: `${number} / page`,
            })),
        [pageSizes],
    )

    const handleCheckBoxChange = (checked: boolean, row: T) => {
        if (!loading) {
            onCheckBoxChange?.(checked, row)
        }
    }

    const handleIndeterminateCheckBoxChange = (
        checked: boolean,
        rows: Row<T>[],
    ) => {
        if (!loading) {
            onIndeterminateCheckBoxChange?.(checked, rows)
        }
    }

    const handlePaginationChange = (page: number) => {
        if (!loading) {
            onPaginationChange?.(page)
        }
    }

    const handleSelectChange = (value?: number) => {
        if (!loading) {
            onSelectChange?.(Number(value))
        }
    }

    useEffect(() => {
        if (Array.isArray(sorting)) {
            const sortOrder =
                sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            const id = sorting.length > 0 ? sorting[0].id : ''
            onSort?.({ order: sortOrder, key: id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting])

    const finalColumns: ColumnDef<T>[] = useMemo(() => {
        const columns = columnsProp

        if (selectable) {
            return [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <IndeterminateCheckbox
                            checked={table.getIsAllRowsSelected()}
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            onIndeterminateCheckBoxChange={(e) => {
                                handleIndeterminateCheckBoxChange(
                                    e.target.checked,
                                    table.getRowModel().rows,
                                )
                            }}
                        />
                    ),
                    cell: ({ row }) => (
                        <IndeterminateCheckbox
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            onCheckBoxChange={(e) =>
                                handleCheckBoxChange(
                                    e.target.checked,
                                    row.original,
                                )
                            }
                        />
                    ),
                },
                ...columns,
            ]
        }
        return columns
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnsProp, selectable])

    const table = useReactTable({
        data,
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: (sorter) => {
            setSorting(sorter as ColumnSort[])
        },
        state: {
            sorting: sorting as ColumnSort[],
        },
    })

    const resetSorting = () => {
        table.resetSorting()
    }

    const resetSelected = () => {
        table.toggleAllRowsSelected(false)
    }

    useImperativeHandle(ref, () => ({
        resetSorting,
        resetSelected,
    }))

    return (
        <Loading loading={loading && data.length !== 0} type="cover">
            <TableContainer>
                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <StyledTh
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <HeaderCell
                                                $sortable={header.column.getCanSort()}
                                                $loading={loading}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <span>
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                </span>
                                                {header.column.getCanSort() && (
                                                    <SorterWrap>
                                                        <Sorter
                                                            sort={header.column.getIsSorted()}
                                                        />
                                                    </SorterWrap>
                                                )}
                                            </HeaderCell>
                                        )}
                                    </StyledTh>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    {loading && data.length === 0 ? (
                        <TableRow
                            columns={(finalColumns as Array<T>).length}
                            rows={pagingData.pageSize}
                            avatarInColumns={mkEquineAvatarColumns}
                            avatarProps={mkEquineAvatarProps}
                        />
                    ) : (
                        <StyledTBody>
                            {table
                                .getRowModel()
                                .rows.slice(0, pageSize)
                                .map((row) => (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <StyledTd key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </StyledTd>
                                        ))}
                                    </Tr>
                                ))}
                        </StyledTBody>
                    )}
                </Table>
            </TableContainer>
            <PaginationControls>
                <Pagination
                    pageSize={pageSize}
                    currentPage={pageIndex}
                    total={total}
                    onChange={handlePaginationChange}
                />
                <PageSizeSelectWrap>
                    <Select
                        size="sm"
                        menuPlacement="top"
                        isSearchable={false}
                        value={pageSizeOption.filter(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOption}
                        onChange={(option) => handleSelectChange(option?.value)}
                    />
                </PageSizeSelectWrap>
            </PaginationControls>
        </Loading>
    )
}

const DataTable = forwardRef(_DataTable) as <T>(
    props: DataTableProps<T> & {
        ref?: ForwardedRef<DataTableResetHandle>
    },
) => ReturnType<typeof _DataTable>

export type { ColumnDef, Row, CellContext }
export default DataTable
