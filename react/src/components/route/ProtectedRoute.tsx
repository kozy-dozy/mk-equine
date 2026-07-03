import { Navigate, useLocation } from 'react-router-dom'

import Loading from '@/components/shared/Loading'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useAppSelector } from '@/store'

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const location = useLocation()
    const { token, signedIn, initialized } = useAppSelector(
        (s) => s.auth.session,
    )

    if (!initialized) return <Loading loading />

    const authenticated = !!token && !!signedIn

    if (!authenticated) {
        const redirect = encodeURIComponent(location.pathname + location.search)
        return (
            <Navigate replace to={`/sign-in?${REDIRECT_URL_KEY}=${redirect}`} />
        )
    }

    return <>{children}</>
}
