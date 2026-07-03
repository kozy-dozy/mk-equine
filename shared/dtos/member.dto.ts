export interface MemberDto {
    id: string
    firstName: string
    lastName: string
    email: string
    authority: string[]
    emailVerified?: boolean
    avatar?: string
    createdAt?: string
}

export type ProfileValues = {
    firstName: string
    lastName: string
    email: string
    avatar: string
    avatarFile?: File | null
}
