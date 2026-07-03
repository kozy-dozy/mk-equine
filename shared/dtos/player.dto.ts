// Sport IDs
export type SportId = 1 | 2 | 3 | 4
// 1 = Basketball, 2 = Football, 3 = Soccer, 4 = Volleyball

export type Gender = 'M' | 'F'


export interface BasketballStatsDto {
    ppg: number
    rpg: number
    apg: number
    threePtPct: number
    ftPct: number
}

export interface FootballStatsDto {
    passYds: number
    passTDs: number
    ints: number
    rushYds: number
    rushTDs: number
    recYds: number
    recTDs: number
    tackles: number
    sacks: number
    fumbles: number
    defInts: number
}

export interface SoccerStatsDto {
    goals: number
    assists: number
    saves: number
    soccerTackles: number
    passAccuracy: number
}

export interface VolleyballStatsDto {
    attack: number
    setting: number
    serving: number
    passing: number
    defense: number
    blocking: number
}

export type PlayerStatsDto =
    | BasketballStatsDto
    | FootballStatsDto
    | SoccerStatsDto
    | VolleyballStatsDto


export interface PlayerDto {
    id: string
    sportId: SportId
    gender: Gender
    firstName: string
    lastName: string
    position: string // short code, e.g. "PG"
    positionLong: string // full name, e.g. "Point Guard"
    height: string // e.g. "6'5\""
    weight?: number // lbs — omitted for female players
    wingspan: string // e.g. "6'8\""
    verticalLeap: number // inches
    schoolName: string
    schoolUrl: string
    city: string
    state: string
    gpa: number
    graduationYear: number
    skills: string[]
    highlights: string // YouTube URL
    coachNotes: string
    committed?: string // school name if committed, else undefined
    twitter?: string
    facebook?: string
    linkedin?: string
    instagram?: string
    image: string[] // S3 URLs (multiple images supported)
    active: boolean
    createdBy: string
    stats: PlayerStatsDto
    createdAt: string
    updatedAt: string
}


export interface BasketballPlayerDto extends Omit<PlayerDto, 'stats'> {
    sportId: 1
    stats: BasketballStatsDto
}

export interface FootballPlayerDto extends Omit<PlayerDto, 'stats'> {
    sportId: 2
    stats: FootballStatsDto
}

export interface SoccerPlayerDto extends Omit<PlayerDto, 'stats'> {
    sportId: 3
    stats: SoccerStatsDto
}

export interface VolleyballPlayerDto extends Omit<PlayerDto, 'stats'> {
    sportId: 4
    stats: VolleyballStatsDto
}


export type PlayerFormValues = Omit<
    PlayerDto,
    'id' | 'active' | 'createdBy' | 'createdAt' | 'updatedAt'
> & {
    image: string[]
}
