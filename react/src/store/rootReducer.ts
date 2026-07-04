import { combineReducers, Action, Reducer } from 'redux'

import adminDashboard, {
    AdminDashboardState,
} from './slices/admin/dashboardSlice'
import memberList, { MemberListState } from './slices/admin/membersSlice'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import featureFlags, {
    FeatureFlagsState,
} from './slices/domain/featureFlagsSlice'
import member, { MemberState } from './slices/domain/memberSlice'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'

// Admin slices

export type RootState = {
    auth: AuthState
    base: BaseState
    featureFlags: FeatureFlagsState
    member: MemberState
    locale: LocaleState
    theme: ThemeState
    // Admin
    adminDashboard: AdminDashboardState
    memberList: MemberListState
}

export interface AsyncReducers {
    [key: string]: Reducer<any, Action>
}

const staticReducers = {
    auth,
    base,
    featureFlags,
    member,
    locale,
    theme,
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
