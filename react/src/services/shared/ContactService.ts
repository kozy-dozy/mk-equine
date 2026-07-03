import ApiService from './ApiService'

export type ContactPayload = {
    name: string
    email: string
    message: string
}

export async function apiSubmitContact(data: ContactPayload) {
    return ApiService.fetchData<{ message: string }, ContactPayload>({
        url: '/contact',
        method: 'POST',
        data,
    })
}
