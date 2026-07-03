/**
 * Centralized company/brand configuration for Express backend
 * This is the single source of truth for business identity and metadata
 * Also used by React frontend via shared DTOs
 */

export const COMPANY_CONFIG = {
    name: 'MK Equine',

    contact: {
        email: 'hello@mkequine.com',
        phone: '',
    },

    social: {
        twitter: '',
        instagram: '',
        facebook: '',
    },
} as const

export type CompanyConfig = typeof COMPANY_CONFIG
