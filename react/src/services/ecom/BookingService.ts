import ApiService from '@/services/shared/ApiService'

import type {
    AvailabilityBlockDto,
    AvailabilityRuleDto,
    AvailableSlot,
    BookingDto,
    BookingStatus,
} from '@shared/dtos'

// Public
export function apiGetAvailableSlots(from: string, to: string) {
    return ApiService.fetchData<AvailableSlot[], { from: string; to: string }>({
        url: '/booking/available-slots',
        method: 'POST',
        data: { from, to },
    })
}

export type CreateBookingPayload = {
    startDateTime: string
    endDateTime: string
    consultationType?: string
    guestName: string
    guestEmail: string
    guestPhone?: string
    notes?: string
}

export function apiCreateBooking(payload: CreateBookingPayload) {
    return ApiService.fetchData<BookingDto, CreateBookingPayload>({
        url: '/booking/create',
        method: 'POST',
        data: payload,
    })
}

// Admin — rules
export function apiAdminGetAvailabilityRules() {
    return ApiService.fetchData<AvailabilityRuleDto[], void>({
        url: '/booking/availability/rules',
        method: 'GET',
    })
}

export function apiAdminSetAvailabilityRules(
    rules: Partial<AvailabilityRuleDto>[],
) {
    return ApiService.fetchData<
        AvailabilityRuleDto[],
        { rules: Partial<AvailabilityRuleDto>[] }
    >({
        url: '/booking/availability/rules',
        method: 'PUT',
        data: { rules },
    })
}

// Admin — blocks
export function apiAdminGetAvailabilityBlocks(from?: string, to?: string) {
    return ApiService.fetchData<AvailabilityBlockDto[], void>({
        url: '/booking/availability/blocks',
        method: 'GET',
        params: { from, to },
    })
}

export function apiAdminCreateAvailabilityBlock(payload: {
    startDateTime: string
    endDateTime: string
    reason?: string
}) {
    return ApiService.fetchData<AvailabilityBlockDto, typeof payload>({
        url: '/booking/availability/blocks',
        method: 'POST',
        data: payload,
    })
}

export function apiAdminDeleteAvailabilityBlock(id: string) {
    return ApiService.fetchData<{ message: string }, void>({
        url: `/booking/availability/blocks/${id}`,
        method: 'DELETE',
    })
}

// Admin — bookings
export function apiAdminGetBookings(from?: string, to?: string) {
    return ApiService.fetchData<BookingDto[], void>({
        url: '/booking',
        method: 'GET',
        params: { from, to },
    })
}

export function apiAdminUpdateBookingStatus(
    id: string,
    status: BookingStatus,
) {
    return ApiService.fetchData<BookingDto, { status: BookingStatus }>({
        url: `/booking/${id}/status`,
        method: 'PATCH',
        data: { status },
    })
}

export function apiAdminDeleteBooking(id: string) {
    return ApiService.fetchData<{ message: string }, void>({
        url: `/booking/${id}`,
        method: 'DELETE',
    })
}
