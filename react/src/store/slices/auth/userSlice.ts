import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    id?: string
    avatar?: string
    firstName?: string
    lastName?: string
    email?: string
    authority?: string[]
}

const initialState: UserState = {
    id: '',
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload?.id ?? ''
            state.avatar = action.payload?.avatar ?? ''
            state.firstName = action.payload?.firstName ?? ''
            state.lastName = action.payload?.lastName ?? ''
            state.email = action.payload?.email ?? ''
            state.authority = action.payload?.authority ?? []
        },
        // optional but nice
        // clearUser(state) {
        //     state.id = ''
        //     state.avatar = ''
        //     state.firstName = ''
        //     state.lastName = ''
        //     state.email = ''
        //     state.authority = []
        // },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
