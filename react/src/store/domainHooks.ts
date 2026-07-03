/**
 * Custom hooks for Redux state access and dispatch.
 */

import { useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from './hooks'
import { fetchFeatureFlags } from './slices/domain/featureFlagsSlice'
import {
    fetchMember,
    updateMember,
    clearMember,
} from './slices/domain/memberSlice'

/**
 * Initializes the member record on auth changes. Called once in root App.
 */
export function useInitializeReduxState() {
    const dispatch = useAppDispatch()
    const { signedIn, initialized } = useAppSelector((s) => s.auth.session)
    const hasFetched = useRef(false)

    useEffect(() => {
        if (!initialized) return

        if (!signedIn) {
            dispatch(clearMember())
            hasFetched.current = false
            return
        }

        if (!hasFetched.current) {
            hasFetched.current = true
            dispatch(fetchMember())
        }
    }, [initialized, signedIn, dispatch])
}

/**
 * Initializes feature flags once on app startup.
 */
export function useInitializeFeatureFlags() {
    const dispatch = useAppDispatch()
    const hasFetched = useRef(false)

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true
            dispatch(fetchFeatureFlags())
        }
    }, [dispatch])
}

export function useMember() {
    const dispatch = useAppDispatch()
    const { member, loading, error } = useAppSelector((s) => s.member)

    return {
        member,
        loading,
        error,
        refreshMember: () => dispatch(fetchMember()),
        updateMember: (payload: Record<string, any>) =>
            dispatch(updateMember(payload)),
        isAuthenticated: !!member?.id,
    }
}

export function useFeatureFlags() {
    const dispatch = useAppDispatch()
    const { flags, loading, error } = useAppSelector((s) => s.featureFlags)

    return {
        flags,
        loading,
        error,
        refresh: () => dispatch(fetchFeatureFlags()),
    }
}
