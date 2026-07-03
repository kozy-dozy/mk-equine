import ApiService from './ApiService'

import type { FeatureFlagsDto } from '@shared/dtos'

export function apiGetFeatureFlags() {
    return ApiService.fetchData<FeatureFlagsDto>({
        url: '/feature-flags',
        method: 'GET',
    })
}

// admin endpoints
export function apiGetAdminFeatureFlags() {
    return ApiService.fetchData<FeatureFlagsDto>({
        url: '/admin/feature-flags',
        method: 'GET',
    })
}

export function apiPatchAdminFeatureFlags(patch: Partial<FeatureFlagsDto>) {
    return ApiService.fetchData<FeatureFlagsDto>({
        url: '/admin/feature-flags',
        method: 'PATCH',
        data: patch,
    })
}
