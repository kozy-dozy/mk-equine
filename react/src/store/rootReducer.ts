import { combineReducers, Action, Reducer } from 'redux'

import {
    foundationReducers,
    type FoundationState,
} from '@kozydozy/foundation'

import adminDashboard, {
    AdminDashboardState,
} from './slices/admin/dashboardSlice'
import memberList, { MemberListState } from './slices/admin/membersSlice'
import featureFlags, {
    FeatureFlagsState,
} from './slices/domain/featureFlagsSlice'
import member, { MemberState } from './slices/domain/memberSlice'

// The auth / base / locale / theme slices now come from @kozydozy/foundation
// (composed via `foundationReducers`). Only MK Equine's domain/admin slices are
// declared here.
export type RootState = FoundationState & {
    featureFlags: FeatureFlagsState
    member: MemberState
    // Admin
    adminDashboard: AdminDashboardState
    memberList: MemberListState
}

export interface AsyncReducers {
    [key: string]: Reducer<any, Action>
}

const staticReducers = {
    ...foundationReducers,
    featureFlags,
    member,
    // Admin
    adminDashboard,
    memberList,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) => (state: RootState | undefined, action: Action) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers,
        })
        return combinedReducer(state, action)
    }

export default rootReducer
