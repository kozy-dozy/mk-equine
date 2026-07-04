import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import Loading from '@/components/shared/Loading'
import { useAppSelector } from '@/store'
import useAuthority from '@/utils/hooks/useAuthority'

type AuthorityGuardProps = PropsWithChildren<{
    userAuthority?: string[]
    authority?: string[]
}>

const AuthorityGuard = (props: AuthorityGuardProps) => {
    const { userAuthority = [], authority = [], children } = props
    const { initialized } = useAppSelector((state) => state.auth.session)

    // ✅ hook must be called unconditionally
    const roleMatched = useAuthority(userAuthority, authority)

    if (!initialized) {
        return <Loading loading={true} />
    }

    if (!roleMatched) {
        return <Navigate replace to="/" />
    }

    // If children are provided, render them. Otherwise render Outlet for nested routes
    return <>{children || <Outlet />}</>
}

export default AuthorityGuard
