import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useCallback, useMemo, useRef } from 'react'
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import DataTable from '@/components/shared/DataTable'
import Avatar from '@kozydozy/ui/Avatar'
import Badge from '@kozydozy/ui/Badge'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    setTableData,
    getMembers,
    toggleDeleteConfirmation,
    setSelectedMember,
} from '@/store/slices/admin/membersSlice'
import useThemeClass from '@kozydozy/foundation/hooks/useThemeClass'

import MemberDeleteConfirmation from './MemberDeleteConfirmation'

import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import type { MemberDto } from '@shared/dtos'

const BadgeLabel = styled.span<{ $active: boolean }>`
    margin-left: ${({ theme }) => theme.spacing.sm};
    font-weight: 600;
    text-transform: capitalize;
    color: ${({ $active }) => ($active ? '#10b981' : '#71717a')};
`

const BadgeRow = styled.div`
    display: flex;
    align-items: center;
`

const ActionRow = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: ${({ theme }) => theme.fontSize.xl};
`

const ActionIcon = styled.span<{ $color?: string }>`
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.sm};
    color: ${({ $color }) => $color ?? 'inherit'};
`

const YesNoBadge = ({
    value,
    yesLabel = 'Yes',
    noLabel = 'No',
}: {
    value: boolean
    yesLabel?: string
    noLabel?: string
}) => {
    return (
        <BadgeRow>
            <Badge style={{ background: value ? '#10b981' : '#a1a1aa' }} />
            <BadgeLabel $active={value}>{value ? yesLabel : noLabel}</BadgeLabel>
        </BadgeRow>
    )
}

const ActionColumn = ({ row }: { row: MemberDto }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedMember(row.id))
    }

    const onView = useCallback(() => {
        navigate(`/admin/members/${row.id}`)
    }, [navigate, row.id])

    return (
        <ActionRow>
            <ActionIcon $color={textTheme} onClick={onView}>
                <HiOutlineEye />
            </ActionIcon>
            <ActionIcon $color="#ef4444" onClick={onDelete}>
                <HiOutlineTrash />
            </ActionIcon>
        </ActionRow>
    )
}

// function formatCreatedAt(createdAt: MemberDto['createdAt']) {
//     // supports ISO string, unix seconds, unix ms
//     if (typeof createdAt === 'string') {
//         const d = dayjs(createdAt)
//         return d.isValid() ? d.format('MM/DD/YYYY') : createdAt
//     }

//     // number: guess seconds vs ms
//     const isSeconds = createdAt < 10_000_000_000
//     return dayjs(isSeconds ? createdAt * 1000 : createdAt).format('MM/DD/YYYY')
// }

const MembersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()

    // 🔁 Change these selectors to match your members slice path
    const {
        pageIndex = 1,
        pageSize = 10,
        sort,
        query,
        total = 0,
    } = useAppSelector((state) => state.memberList.tableData)

    const loading = useAppSelector((state) => state.memberList.loading)
    const data = useAppSelector((state) => state.memberList.memberList)

    const fetchData = useCallback(() => {
        dispatch(getMembers({ pageIndex, pageSize, sort, query }))
    }, [dispatch, pageIndex, pageSize, sort, query])

    useEffect(() => {
        // dispatch(setSelectedRows([]))
        fetchData()
    }, [dispatch, fetchData, pageIndex, pageSize, sort])

    useEffect(() => {
        tableRef.current?.resetSelected()
    }, [data])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total],
    )

    const columns: ColumnDef<MemberDto>[] = useMemo(
        () => [
            {
                header: '',
                accessorKey: 'avatar',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                            }}
                        >
                            <Avatar
                                size={36}
                                src={row.avatar || undefined}
                                alt={`${row.firstName} ${row.lastName}`}
                                shape="circle"
                            />
                        </div>
                    )
                },
            },
            {
                header: 'First',
                accessorKey: 'firstName',
            },
            {
                header: 'Last',
                accessorKey: 'lastName',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Verified',
                accessorKey: 'emailVerified',
                enableSorting: false,
                cell: (props) => (
                    <YesNoBadge
                        value={props.row.original.emailVerified ?? false}
                    />
                ),
            },
            // {
            //     header: 'Admin',
            //     cell: (props) => (
            //         <YesNoBadge
            //             value={props.row.original.authority.includes('admin')}
            //             yesLabel="Admin"
            //             noLabel="No"
            //         />
            //     ),
            // },
            // {
            //     header: 'Date Added',
            //     accessorKey: 'createdAt',
            //     cell: (props) => (
            //         <span>{formatCreatedAt(props.row.original.createdAt)}</span>
            //     ),
            // },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                avatarColumns={[0]}
                avatarProps={{ style: { borderRadius: 6 } }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <MemberDeleteConfirmation />
        </>
    )
}

export default MembersTable
