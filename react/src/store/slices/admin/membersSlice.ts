import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {
    apiGetMembers,
    apiDeleteMember,
    apiGetMemberById,
} from '@/services/shared/MemberService'

import type { TableQueries } from '@/@types/common'
import type { MemberDto } from '@shared/dtos'

export type FilterQueries = {
    firstName?: string
    lastName?: string
    email?: string
    emailVerified?: boolean | '' // '' for "any"
    isAdmin?: boolean | '' // derived from authority
    dateFrom?: string // optional
    dateTo?: string // optional
}

export type MemberListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedMember: MemberDto | null
    tableData: TableQueries
    filterData: FilterQueries
    memberList: MemberDto[]
    detailsLoading: boolean
    deleting: boolean
}

export type MemberEditState = {
    loading: boolean
    memberData: MemberDto
}

export const SLICE_NAME = 'memberList'

export type GetMembersResponse = {
    data: MemberDto[]
    total: number
}

export type GetMembersRequest = TableQueries & {
    filterData?: Record<string, unknown>
}

// POST /members  (paged list)
export const getMembers = createAsyncThunk<
    GetMembersResponse,
    GetMembersRequest
>(SLICE_NAME + '/getMembers', async (data) => {
    const res = await apiGetMembers(data)
    return res
})

// GET /members/:id
export const getMemberById = createAsyncThunk(
    SLICE_NAME + '/getMemberById',
    async (id: string) => {
        const res = await apiGetMemberById<MemberDto>(id)
        return res
    },
)

// DELETE /members/:id
export const deleteMember = createAsyncThunk<boolean, { id: string }>(
    SLICE_NAME + '/deleteMember',
    async ({ id }) => {
        await apiDeleteMember(id)
        return true
    },
)

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

const initialState: MemberListState = {
    loading: false,
    deleteConfirmation: false,
    selectedMember: null,
    memberList: [],
    tableData: initialTableData,
    filterData: {
        firstName: '',
        lastName: '',
        email: '',
        emailVerified: '',
        isAdmin: '',
        dateFrom: '',
        dateTo: '',
    },
    detailsLoading: false,
    deleting: false,
}

const memberListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedMember: (state, action) => {
            state.selectedMember = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMembers.fulfilled, (state, action) => {
                state.memberList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getMembers.pending, (state) => {
                state.loading = true
            })
            .addCase(getMembers.rejected, (state) => {
                state.loading = false
            })
            .addCase(getMemberById.pending, (state) => {
                state.detailsLoading = true
            })
            .addCase(getMemberById.fulfilled, (state, action) => {
                state.detailsLoading = false
                state.selectedMember = action.payload
            })
            .addCase(getMemberById.rejected, (state) => {
                state.detailsLoading = false
            })
            .addCase(deleteMember.pending, (state) => {
                state.deleting = true
            })
            .addCase(deleteMember.fulfilled, (state) => {
                state.deleting = false
            })
            .addCase(deleteMember.rejected, (state) => {
                state.deleting = false
            })
    },
})

export const {
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedMember,
} = memberListSlice.actions

export default memberListSlice.reducer
