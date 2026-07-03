/**
 * Stripe and payment configuration
 * Centralize tax rates, fees, and order numbering
 */

export const STRIPE_CONFIG = {
    /**
     * Tax rate as decimal (0.07 = 7%)
     * Change here to update across all order calculations
     */
    taxRate: 0.07,

    /**
     * Delivery fee in dollars
     * Applied when delivery method is selected
     */
    deliveryFee: 24.99,

    /**
     * Order number prefix
     * Format: {PREFIX}-{YYYYMMDD}-{RAND}
     * Example: KD-20260227-A1B2
     */
    orderNumberPrefix: 'KD',
} as const

export type StripeConfig = typeof STRIPE_CONFIG

/**
 * Helper to generate order number with current date
 */
export function generateOrderNumber(
    prefix: string = STRIPE_CONFIG.orderNumberPrefix,
): string {
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${prefix}-${y}${m}${day}-${rand}`
}
