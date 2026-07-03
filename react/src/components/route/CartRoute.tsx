import { Navigate } from 'react-router-dom'

import Loading from '@/components/shared/Loading'
import { useAppSelector } from '@/store'

export default function CartRoute({ children }: { children: React.ReactNode }) {
    const { flags, loading } = useAppSelector((s) => s.featureFlags)

    if (loading) return <Loading loading />

    if (!flags.cartEnabled) return <Navigate replace to="/" />

    return <>{children}</>
}
