import { useState, Suspense, lazy } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import NavToggle from '@/components/shared/NavToggle'
import Drawer from '@/components/ui/Drawer'
import adminNavigationConfig from '@/configs/navigation/admin'
import { DIR_RTL } from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import useResponsive from '@/utils/hooks/useResponsive'

// Styled-component for Drawer body background
const AdminMobileDrawerBodyStyle = createGlobalStyle`
    .admin-mobile-drawer-body {
        background: ${({ theme }) => theme.colors.bg.card};
        padding: 0;
    }
`

const MobileNavToggleWrap = styled.div`
    font-size: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: ${({ theme }) => theme.spacing.sm};
`

const AdminMenuContent = lazy(
    () => import('@/views/admin/components/AdminMenuContent'),
)

type MobileNavToggleProps = {
    toggled?: boolean
}

const MobileNavToggle = withHeaderItem<
    MobileNavToggleProps & WithHeaderItemProps
>(NavToggle)

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const navMode = useAppSelector((state) => state.theme.navMode)
    const direction = useAppSelector((state) => state.theme.direction)
    const currentRouteKey = useAppSelector(
        (state) => state.base.common.currentRouteKey,
    )
    const userAuthority = useAppSelector((state) => state.auth.user.authority)
    const { smaller } = useResponsive()

    return (
        <>
            <AdminMobileDrawerBodyStyle />
            {smaller.md && (
                <>
                    <MobileNavToggleWrap onClick={openDrawer}>
                        <MobileNavToggle toggled={isOpen} />
                    </MobileNavToggleWrap>
                    <Drawer
                        title="Navigation"
                        isOpen={isOpen}
                        bodyClass="admin-mobile-drawer-body"
                        width={330}
                        placement={direction === DIR_RTL ? 'right' : 'left'}
                        onClose={onDrawerClose}
                        onRequestClose={onDrawerClose}
                    >
                        <Suspense fallback={<></>}>
                            {isOpen && (
                                <AdminMenuContent
                                    navMode={navMode}
                                    collapsed={false}
                                    navigationTree={adminNavigationConfig}
                                    routeKey={currentRouteKey}
                                    userAuthority={userAuthority as string[]}
                                    direction={direction}
                                    onMenuItemClick={onDrawerClose}
                                />
                            )}
                        </Suspense>
                    </Drawer>
                </>
            )}
        </>
    )
}
