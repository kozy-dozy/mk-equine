import ApiService from './ApiService'

import type { HorseDto, HorseUpsertInput } from '@shared/dtos'

export async function apiListHorses() {
    return ApiService.fetchData<{ horses: HorseDto[] }>({
        url: '/horses',
        method: 'GET',
    })
}

export async function apiListAdminHorses() {
    return ApiService.fetchData<{ horses: HorseDto[] }>({
        url: '/horses/admin',
        method: 'GET',
    })
}

export async function apiCreateHorse(data: HorseUpsertInput) {
    return ApiService.fetchData<{ horse: HorseDto }, HorseUpsertInput>({
        url: '/horses',
        method: 'POST',
        data,
    })
}

export async function apiUpdateHorse(
    id: string,
    data: Partial<HorseUpsertInput>,
) {
    return ApiService.fetchData<{ horse: HorseDto }, Partial<HorseUpsertInput>>({
        url: `/horses/${id}`,
        method: 'PATCH',
        data,
    })
}

export async function apiDeleteHorse(id: string) {
    return ApiService.fetchData<{ ok: boolean }>({
        url: `/horses/${id}`,
        method: 'DELETE',
    })
}
