import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiGetFeatureFlags } from '@/services/shared/FeatureFlagsService'

import type { FeatureFlagsDto } from '@shared/dtos'

export type FeatureFlagsState = {
    flags: FeatureFlagsDto
    loading: boolean
    error: string | null
}

const DEFAULT_FLAGS: FeatureFlagsDto = {
    compareEnabled: true,
    darkModeEnabled: true,
    cartEnabled: false,
}

const initialState: FeatureFlagsState = {
    flags: DEFAULT_FLAGS,
    loading: false,
    error: null,
}

export const fetchFeatureFlags = createAsyncThunk(
    'featureFlags/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiGetFeatureFlags()
            const data = (res as any).data ?? res
            return {
                compareEnabled: Boolean(data.compareEnabled),
                darkModeEnabled: Boolean(data.darkModeEnabled),
                cartEnabled: Boolean(data.cartEnabled),
                updatedAt: data.updatedAt,
            } as FeatureFlagsDto
        } catch (error: any) {
            return rejectWithValue(
                error?.message || 'Failed to fetch feature flags',
            )
        }
    },
)

const featureFlagsSlice = createSlice({
    name: 'feature_flags',
    initialState,
    reducers: {
        resetFeatureFlagsError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeatureFlags.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFeatureFlags.fulfilled, (state, action) => {
                state.loading = false
                state.flags = action.payload
            })
            .addCase(fetchFeatureFlags.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { resetFeatureFlagsError } = featureFlagsSlice.actions
export default featureFlagsSlice.reducer
