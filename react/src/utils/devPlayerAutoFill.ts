// utils/devPlayerAutoFill.ts
import { v4 as uuidv4 } from 'uuid'

import type {
    PlayerDto,
    SportId,
    Gender,
    BasketballStatsDto,
    FootballStatsDto,
    SoccerStatsDto,
    VolleyballStatsDto,
} from '@shared/dtos/player.dto'

const pick = <T>(arr: readonly T[] | T[]) =>
    arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min
const randFloat = (min: number, max: number, decimals = 2) =>
    Math.round((Math.random() * (max - min) + min) * Math.pow(10, decimals)) /
    Math.pow(10, decimals)

const firstNames = [
    'Alex',
    'Jordan',
    'Taylor',
    'Morgan',
    'Casey',
    'Riley',
    'Skyler',
    'Avery',
    'Peyton',
    'Drew',
]
const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Martinez',
    'Lee',
]
const cities = ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem']
const states = ['NC', 'SC', 'GA', 'VA', 'FL']
const schools = [
    { name: 'Central High', url: 'https://centralhigh.edu' },
    { name: 'Westside Prep', url: 'https://westsideprep.edu' },
    { name: 'Eastview Academy', url: 'https://eastviewacademy.edu' },
    { name: 'North Ridge', url: 'https://northridge.edu' },
    { name: 'Southside School', url: 'https://southsideschool.edu' },
]
const skillsPool = [
    'Leadership',
    'Speed',
    'Agility',
    'Shooting',
    'Passing',
    'Defense',
    'Teamwork',
    'Endurance',
    'Strategy',
    'Ball Handling',
]
const positions = {
    1: [
        // Basketball
        { code: 'PG', long: 'Point Guard' },
        { code: 'SG', long: 'Shooting Guard' },
        { code: 'SF', long: 'Small Forward' },
        { code: 'PF', long: 'Power Forward' },
        { code: 'C', long: 'Center' },
    ],
    2: [
        // Football
        { code: 'QB', long: 'Quarterback' },
        { code: 'RB', long: 'Running Back' },
        { code: 'WR', long: 'Wide Receiver' },
        { code: 'LB', long: 'Linebacker' },
        { code: 'CB', long: 'Cornerback' },
    ],
    3: [
        // Soccer
        { code: 'FWD', long: 'Forward' },
        { code: 'MID', long: 'Midfielder' },
        { code: 'DEF', long: 'Defender' },
        { code: 'GK', long: 'Goalkeeper' },
    ],
    4: [
        // Volleyball
        { code: 'OH', long: 'Outside Hitter' },
        { code: 'MB', long: 'Middle Blocker' },
        { code: 'S', long: 'Setter' },
        { code: 'L', long: 'Libero' },
    ],
} as const

const youtubeSamples = [
    'https://youtu.be/dQw4w9WgXcQ',
    'https://youtu.be/3JZ_D3ELwOQ',
    'https://youtu.be/L_jWHffIx5E',
    'https://youtu.be/tVj0ZTS4WF4',
]

function randomStats(
    sportId: SportId,
): BasketballStatsDto | FootballStatsDto | SoccerStatsDto | VolleyballStatsDto {
    switch (sportId) {
        case 1:
            return {
                ppg: randFloat(2, 30, 1),
                rpg: randFloat(1, 15, 1),
                apg: randFloat(0, 10, 1),
                threePtPct: randFloat(20, 50, 1),
                ftPct: randFloat(50, 95, 1),
            }
        case 2:
            return {
                passYds: randInt(0, 4000),
                passTDs: randInt(0, 40),
                ints: randInt(0, 20),
                rushYds: randInt(0, 2000),
                rushTDs: randInt(0, 30),
                recYds: randInt(0, 1500),
                recTDs: randInt(0, 20),
                tackles: randInt(0, 150),
                sacks: randInt(0, 20),
                fumbles: randInt(0, 10),
                defInts: randInt(0, 10),
            }
        case 3:
            return {
                goals: randInt(0, 40),
                assists: randInt(0, 20),
                saves: randInt(0, 100),
                soccerTackles: randInt(0, 80),
                passAccuracy: randFloat(60, 99, 1),
            }
        case 4:
            return {
                attack: randInt(0, 100),
                setting: randInt(0, 100),
                serving: randInt(0, 100),
                passing: randInt(0, 100),
                defense: randInt(0, 100),
                blocking: randInt(0, 100),
            }
        default:
            throw new Error('Invalid sportId')
    }
}

export function generateDevPlayerFixture(): PlayerDto {
    const sportId = pick([1, 2, 3, 4]) as SportId
    const gender = pick(['M', 'F']) as Gender
    const firstName = pick(firstNames)
    const lastName = pick(lastNames)
    const { name: schoolName, url: schoolUrl } = pick(schools)
    const city = pick(cities)
    const state = pick(states)
    const gradYear = randInt(2025, 2029)
    const gpa = randFloat(2.0, 4.0, 2)
    const pos = pick([...positions[sportId]]) as { code: string; long: string }
    const skills = Array.from(
        new Set(Array.from({ length: randInt(2, 5) }, () => pick(skillsPool))),
    )
    const height = `${randInt(5, 6)}'${randInt(0, 11)}"`
    const wingspan = `${randInt(5, 7)}'${randInt(0, 11)}"`
    const verticalLeap = randInt(20, 40)
    const weight = gender === 'M' ? randInt(140, 260) : undefined
    const highlights = pick(youtubeSamples)
    const coachNotes = pick([
        'Excellent work ethic and leadership.',
        'Shows great potential and coachability.',
        'Consistent performer in high-pressure situations.',
        'Needs to improve defensive skills.',
    ])
    const committed = Math.random() < 0.2 ? pick(schools).name : undefined
    const social = {
        twitter:
            Math.random() < 0.5
                ? `@${firstName}${lastName}${randInt(1, 99)}`
                : undefined,
        facebook: Math.random() < 0.3 ? `${firstName}.${lastName}` : undefined,
        linkedin: Math.random() < 0.2 ? `${firstName}${lastName}` : undefined,
        instagram:
            Math.random() < 0.5 ? `@${firstName}_${lastName}` : undefined,
    }
    const now = new Date().toISOString()
    return {
        id: uuidv4(),
        sportId,
        gender,
        firstName,
        lastName,
        position: pos.code,
        positionLong: pos.long,
        height,
        weight,
        wingspan,
        verticalLeap,
        schoolName,
        schoolUrl,
        city,
        state,
        gpa,
        graduationYear: gradYear,
        skills,
        highlights,
        coachNotes,
        committed,
        ...social,
        image: [],
        active: true,
        createdBy: 'dev',
        stats: randomStats(sportId),
        createdAt: now,
        updatedAt: now,
    }
}
