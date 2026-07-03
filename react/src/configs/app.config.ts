export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    signupUrl: string
    forgotPasswordUrl: string
    resetPasswordUrl: string
    tourPath: string
    locale: string
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/admin/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    signupUrl: '/sign-up',
    forgotPasswordUrl: '/forgot-password',
    resetPasswordUrl: '/reset-password',
    tourPath: '/',
    locale: 'en',
}

export default appConfig
