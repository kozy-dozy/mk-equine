export type CartItemDto = {
    playerId: string
    name: string
    imageUrl?: string
    price: number
    qty: number
}

export type CartDto = {
    items: CartItemDto[]
}
