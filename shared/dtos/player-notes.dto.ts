export interface PlayerNotesDto {
    id: string
    userId: string
    playerId: string
    notes: string
    createdAt: string
    updatedAt: string
}

export type PlayerNotesFormValues = {
    notes: string
}
