export const INTEGRATIONS_CONFIG = {
    // S3/Asset Storage
    s3: {
        imageBaseUrl: import.meta.env.VITE_S3_IMAGE_URL || '',
        logoPath: '/global/logo.png',
        // Brand logo variants (upload these to <VITE_S3_IMAGE_URL>/global/):
        logoDarkPath: '/global/mk-logo-dark.png', // brown logo — for light backgrounds
        logoLightPath: '/global/mk-logo-light.png', // gold logo — for dark backgrounds
        faviconPath: '/global/favicon.ico',
    },

    // Google Services
    google: {
        analyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
        mapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
    },

    // Error Monitoring
    sentry: {
        dsn: import.meta.env.VITE_SENTRY_DSN || '',
    },

    // Payment
    stripe: {
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    },

    // API
    api: {
        baseUrl: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api',
    },
} as const

// Helper functions
export const getLogoUrl = () => {
    return `${INTEGRATIONS_CONFIG.s3.imageBaseUrl}${INTEGRATIONS_CONFIG.s3.logoPath}`
}

// Brown logo (for light backgrounds)
export const getLogoDarkUrl = () => {
    return `${INTEGRATIONS_CONFIG.s3.imageBaseUrl}${INTEGRATIONS_CONFIG.s3.logoDarkPath}`
}

// Gold logo (for dark backgrounds)
export const getLogoLightUrl = () => {
    return `${INTEGRATIONS_CONFIG.s3.imageBaseUrl}${INTEGRATIONS_CONFIG.s3.logoLightPath}`
}

export const getFaviconUrl = () => {
    return `${INTEGRATIONS_CONFIG.s3.imageBaseUrl}${INTEGRATIONS_CONFIG.s3.faviconPath}`
}

export const getAssetUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${INTEGRATIONS_CONFIG.s3.imageBaseUrl}${cleanPath}`
}
