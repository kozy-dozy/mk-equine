import ApiService from './ApiService'

export type PresignResponse = {
    uploadUrl: string
    fileUrl: string
    key?: string
}

export type GetMemberAvatarUploadUrlRequest = {
    fileType: string
    desiredFileName: string
}

export type GetMemberAvatarUploadUrlResponse = {
    uploadUrl: string
    fileUrl: string
}

export async function apiGetProductUploadUrl(data: {
    fileType: string
    desiredFileName: string
}) {
    return ApiService.fetchData<
        PresignResponse,
        { fileType: string; desiredFileName: string }
    >({
        url: '/s3/upload-url',
        method: 'POST',
        data,
    })
}

export async function apiGetMemberAvatarUploadUrl<
    T = GetMemberAvatarUploadUrlResponse,
    U extends Record<string, unknown> = GetMemberAvatarUploadUrlRequest,
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/s3/member-avatar-upload-url',
        method: 'POST',
        data,
    })
}

export async function apiGetSiteAssetUploadUrl(data: {
    fileType: string
    desiredFileName: string
}) {
    return ApiService.fetchData<
        { uploadUrl: string; fileUrl: string },
        typeof data
    >({
        url: '/s3/upload-url',
        method: 'POST',
        data,
    })
}
