import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import { useRef } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'

import Input from '@kozydozy/ui/Input'
import { useAppDispatch, useAppSelector } from '@/store'
import { getMembers, setTableData } from '@/store/slices/admin/membersSlice'

import type { TableQueries } from '@/@types/common'
import type { ChangeEvent } from 'react'

const MemberTableSearch = () => {
    const dispatch = useAppDispatch()

    const searchInput = useRef<HTMLInputElement>(null)

    const tableData = useAppSelector((state) => state.memberList.tableData)

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            fetchData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData(newTableData)
        }
    }

    const fetchData = (data: TableQueries) => {
        dispatch(setTableData(data))
        dispatch(getMembers(data))
    }

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={searchInput}
            size="sm"
            style={{ width: 208 }}
            placeholder="Search member"
            prefix={<HiOutlineSearch style={{ fontSize: 20 }} />}
            onChange={onEdit}
        />
    )
}

export default MemberTableSearch
