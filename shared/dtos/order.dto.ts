export type OrderItemDto = {
    playerId: string
    name: string
    imageUrl?: string
    price: number
    qty: number
}

export type OrderDto = {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    items: OrderItemDto[]
    subtotal: number
    total: number
    status: 'pending' | 'complete'
    createdAt: string
}
