export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface AvailabilityRuleDto {
    id: string
    dayOfWeek: DayOfWeek
    startTime: string
    endTime: string
    slotDurationMinutes: number
    active: boolean
    createdAt: string
    updatedAt: string
}

export interface AvailabilityBlockDto {
    id: string
    startDateTime: string
    endDateTime: string
    reason?: string
    createdAt: string
    updatedAt: string
}

export type BookingStatus =
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'completed'

export interface BookingDto {
    id: string
    startDateTime: string
    endDateTime: string
    consultationType: string
    guestName: string
    guestEmail: string
    guestPhone?: string
    memberId?: string
    notes?: string
    status: BookingStatus
    createdAt: string
    updatedAt: string
}

export interface AvailableSlot {
    startDateTime: string
    endDateTime: string
}
