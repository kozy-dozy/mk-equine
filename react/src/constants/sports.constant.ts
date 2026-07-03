import type { SportId } from '@shared/dtos'

export const SPORT_NAMES: Record<SportId, string> = {
    1: 'Basketball',
    2: 'Football',
    3: 'Soccer',
    4: 'Volleyball',
}

export const SPORT_IDS = [1, 2, 3, 4] as const

export const SPORT_OPTIONS = SPORT_IDS.map((id) => ({
    value: String(id),
    label: SPORT_NAMES[id],
}))

export const SPORT_POSITIONS: Record<SportId, { label: string; value: string }[]> = {
    1: [
        { label: 'Point Guard', value: 'PG' },
        { label: 'Shooting Guard', value: 'SG' },
        { label: 'Small Forward', value: 'SF' },
        { label: 'Power Forward', value: 'PF' },
        { label: 'Center', value: 'C' },
    ],
    2: [
        { label: 'Quarterback', value: 'QB' },
        { label: 'Running Back', value: 'RB' },
        { label: 'Wide Receiver', value: 'WR' },
        { label: 'Tight End', value: 'TE' },
        { label: 'Linebacker', value: 'LB' },
        { label: 'Cornerback', value: 'CB' },
    ],
    3: [
        { label: 'Forward', value: 'F' },
        { label: 'Midfielder', value: 'M' },
        { label: 'Defender', value: 'D' },
        { label: 'Goalkeeper', value: 'GK' },
    ],
    4: [
        { label: 'Setter', value: 'S' },
        { label: 'Outside Hitter', value: 'OH' },
        { label: 'Opposite Hitter', value: 'OPP' },
        { label: 'Middle Blocker', value: 'MB' },
        { label: 'Libero', value: 'L' },
    ],
}

export const GENDER_OPTIONS = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
]

export const GRAD_YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() + i
    return { value: String(year), label: String(year) }
})

// Stat labels shared across list + detail + compare views
export const STAT_LABELS: Record<string, { short: string; long: string }> = {
    // Basketball
    ppg: { short: 'PPG', long: 'Points Per Game' },
    rpg: { short: 'RPG', long: 'Rebounds Per Game' },
    apg: { short: 'APG', long: 'Assists Per Game' },
    threePtPct: { short: '3PT%', long: '3-Point Percentage' },
    ftPct: { short: 'FT%', long: 'Free Throw Percentage' },
    // Football
    passYds: { short: 'Pass Yds', long: 'Passing Yards' },
    passTDs: { short: 'Pass TDs', long: 'Passing Touchdowns' },
    ints: { short: 'INTs', long: 'Interceptions' },
    rushYds: { short: 'Rush Yds', long: 'Rushing Yards' },
    rushTDs: { short: 'Rush TDs', long: 'Rushing Touchdowns' },
    recYds: { short: 'Rec Yds', long: 'Receiving Yards' },
    recTDs: { short: 'Rec TDs', long: 'Receiving Touchdowns' },
    tackles: { short: 'Tackles', long: 'Total Tackles' },
    sacks: { short: 'Sacks', long: 'Quarterback Sacks' },
    fumbles: { short: 'Fumbles', long: 'Forced Fumbles' },
    defInts: { short: 'Def INTs', long: 'Defensive Interceptions' },
    // Soccer
    goals: { short: 'Goals', long: 'Goals Scored' },
    assists: { short: 'Assists', long: 'Goal Assists' },
    saves: { short: 'Saves', long: 'Goalkeeper Saves' },
    soccerTackles: { short: 'Tackles', long: 'Defensive Tackles' },
    passAccuracy: { short: 'Pass Acc%', long: 'Passing Accuracy' },
    // Volleyball
    attack: { short: 'Attack', long: 'Attack Rating' },
    setting: { short: 'Setting', long: 'Setting Rating' },
    serving: { short: 'Serving', long: 'Serving Rating' },
    passing: { short: 'Passing', long: 'Passing Rating' },
    defense: { short: 'Defense', long: 'Defense Rating' },
    blocking: { short: 'Blocking', long: 'Blocking Rating' },
}

// Ordered stat keys per sport for consistent display
export const SPORT_STAT_KEYS: Record<SportId, string[]> = {
    1: ['ppg', 'rpg', 'apg', 'threePtPct', 'ftPct'],
    2: ['passYds', 'passTDs', 'rushYds', 'rushTDs', 'recYds', 'recTDs', 'tackles', 'sacks', 'ints', 'defInts', 'fumbles'],
    3: ['goals', 'assists', 'saves', 'soccerTackles', 'passAccuracy'],
    4: ['attack', 'setting', 'serving', 'passing', 'defense', 'blocking'],
}

export const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL ?? ''

export function getPlayerImageUrl(image?: string): string | undefined {
    if (!image) return undefined
    if (image.startsWith('http')) return image
    return S3_BASE_URL ? `${S3_BASE_URL}/${image}` : undefined
}
