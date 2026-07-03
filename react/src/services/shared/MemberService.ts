import ApiService from './ApiService'

import type {
    GetMembersRequest,
    GetMembersResponse,
} from '@/store/slices/admin/membersSlice'
import type { MemberDto } from '@shared/dtos'

// POST /members  (paged list)
export async function apiGetMembers(params: GetMembersRequest) {
    return ApiService.fetchData<GetMembersResponse, GetMembersRequest>({
        url: '/members',
        method: 'POST',
        data: params,
    })
}

// GET /members/:id
export async function apiGetMemberById<T = MemberDto>(id: string) {
    return ApiService.fetchData<T>({
        url: `/members/${id}`,
        method: 'GET',
    })
}

// PUT /members/:id
export async function apiUpdateMemberById<
    T = MemberDto,
    U extends Record<string, unknown> = Partial<MemberDto>,
>(id: string, data: U) {
    return ApiService.fetchData<T>({
        url: `/members/${id}`,
        method: 'PUT',
        data,
    })
}

// DELETE /members/:id
export async function apiDeleteMember<T>(id: string) {
    return ApiService.fetchData<T>({
        url: `/members/${id}`,
        method: 'DELETE',
    })
}
