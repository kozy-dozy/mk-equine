import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SLICE_BASE_NAME } from './constants'

export interface SessionState {
    isAuthenticated: boolean
    initialized: boolean
    signedIn: boolean
    token: string | null
}

const initialState: SessionState = {
    isAuthenticated: false,
    initialized: false,
    signedIn: false,
    token: null,
}

const sessionSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        setInitialized(state, action: PayloadAction<boolean>) {
            state.initialized = action.payload
        },
        signInSuccess(state, action: PayloadAction<string>) {
            state.signedIn = true
            state.token = action.payload
            state.isAuthenticated = true
            state.initialized = true // ✅ safe to set true here too
        },
        signOutSuccess(state) {
            state.signedIn = false
            state.token = null
            state.isAuthenticated = false
            state.initialized = true // ✅ we know the answer: not signed in
        },
    },
})

export const { signInSuccess, signOutSuccess, setInitialized } =
    sessionSlice.actions

export default sessionSlice.reducer
