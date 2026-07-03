import { Navigate, useLocation } from 'react-router-dom'

import Loading from '@/components/shared/Loading'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useAppSelector } from '@/store'

const { authenticatedEntryPath } = appConfig

function getRedirect(search: string) {
    const params = new URLSearchParams(search)
    const raw = params.get(REDIRECT_URL_KEY)
    if (!raw) return null

    const decoded = decodeURIComponent(raw)
    if (!decoded.startsWith('/')) return null // safety
    return decoded
}

export default function PublicRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const location = useLocation()
    const { token, signedIn, initialized } = useAppSelector(
        (s) => s.auth.session,
    )

    console.log('[PublicRoute] initialized:', initialized, 'token:', token, 'signedIn:', signedIn)

    if (!initialized) return <Loading loading />

    const isAuthenticated = !!token && !!signedIn
    if (!isAuthenticated) return <>{children}</>

    // If authenticated, check for redirect parameter
    const redirect = getRedirect(location.search)
    if (redirect) return <Navigate replace to={redirect} />

    // Otherwise redirect to authenticated entry path (not admin dashboard)
    return <Navigate replace to={authenticatedEntryPath} />
}
