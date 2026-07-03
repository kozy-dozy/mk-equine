export interface CollegeDto {
    id: string
    name: string
    city: string
    state: string
    lat?: number
    lng?: number
    division?: string
    url?: string
}

export interface CollegeWithDistanceDto extends CollegeDto {
    distanceMiles: number
}
