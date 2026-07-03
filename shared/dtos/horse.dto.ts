export type HorseStatus = 'available' | 'pending' | 'sold'

export interface HorseDto {
    id: string
    name: string
    breed: string
    age: number
    sex: string
    discipline: string
    price: number
    status: HorseStatus
    description: string
    imageUrl: string
    sortOrder: number
    createdAt?: string
    updatedAt?: string
}

export type HorseUpsertInput = Omit<HorseDto, 'id' | 'createdAt' | 'updatedAt'>
