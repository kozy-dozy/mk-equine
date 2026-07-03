import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {
    apiGetAdminDashboard,
    apiGetAdminOverview,
    type AdminOverviewResponse,
} from '@/services/admin/AdminService'

export const SLICE_NAME = 'adminDashboard'

export type StatCard = {
    label: string
    value: string
    sub?: string
}

export type MemberRow = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    isAdmin: boolean
    createdAt: string
    avatar?: string
}

export type AdminDashboardState = {
    loading: boolean
    stats: StatCard[]
    newestMembers: MemberRow[]
    overview: AdminOverviewResponse | null
}

export const getDashboard = createAsyncThunk(
    SLICE_NAME + '/getDashboard',
    async () => {
        const res = await apiGetAdminDashboard()
        const data = (res as any).data ?? res

        const stats: StatCard[] = [
            {
                label: 'Total Members',
                value: String(data.stats.membersTotal ?? 0),
                sub: `+${data.stats.membersNewThisWeek ?? 0} this week`,
            },
            {
                label: 'Total Players',
                value: String(data.stats.playersTotal ?? 0),
            },
            {
                label: 'Active Players',
                value: String(data.stats.playersActive ?? 0),
                sub: 'Visible to recruiters',
            },
            {
                label: 'Inactive Players',
                value: String(
                    (data.stats.playersTotal ?? 0) -
                        (data.stats.playersActive ?? 0),
                ),
                sub: 'Hidden from listings',
            },
        ]

        const newestMembers: MemberRow[] = (data.newestMembers ?? []).map(
            (m: any) => ({
                id: m.id,
                name:
                    `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim() ||
                    'Member',
                email: m.email ?? '',
                emailVerified: Boolean(m.emailVerified),
                isAdmin: Array.isArray(m.authority)
                    ? m.authority.includes('admin')
                    : false,
                createdAt: new Date(m.createdAt).toLocaleDateString(),
                avatar: m.avatar ?? '',
            }),
        )

        return { stats, newestMembers }
    },
)

export const getOverview = createAsyncThunk(
    `${SLICE_NAME}/getOverview`,
    async () => {
        const res = await apiGetAdminOverview()
        return (res as any).data ?? res
    },
)

const initialState: AdminDashboardState = {
    loading: false,
    stats: [],
    newestMembers: [],
    overview: null,
}

const dashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDashboard.pending, (state) => {
                state.loading = true
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.loading = false
                state.stats = action.payload.stats
                state.newestMembers = action.payload.newestMembers
            })
            .addCase(getDashboard.rejected, (state) => {
                state.loading = false
            })
            .addCase(getOverview.pending, (state) => {
                state.loading = true
            })
            .addCase(getOverview.fulfilled, (state, action) => {
                state.loading = false
                state.overview = action.payload
            })
            .addCase(getOverview.rejected, (state) => {
                state.loading = false
            })
    },
})

export default dashboardSlice.reducer
