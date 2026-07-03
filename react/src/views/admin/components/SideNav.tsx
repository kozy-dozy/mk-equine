import styled, { useTheme } from 'styled-components'
import Logo from '@/components/template/Logo'
import ScrollBar from '@/components/ui/ScrollBar'
import adminNavigationConfig from '@/configs/navigation/admin'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
} from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import AdminMenuContent from '@/views/admin/components/AdminMenuContent'

const SideNavContainer = styled.div<{
    $collapsed: boolean
    bg: string
}>`
    width: ${({ $collapsed }) =>
        $collapsed ? `${SIDE_NAV_COLLAPSED_WIDTH}px` : `${SIDE_NAV_WIDTH}px`};
    min-width: ${({ $collapsed }) =>
        $collapsed ? `${SIDE_NAV_COLLAPSED_WIDTH}px` : `${SIDE_NAV_WIDTH}px`};
    height: 100vh;
    background: ${({ bg }) => bg};
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: width 0.2s;
    z-index: ${({ theme }) => theme.zIndex.dropdown};
`

const SideNavHeader = styled.div`
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
    background: transparent;
`

const SideNavContent = styled.div`
    flex: 1 1 auto;
    overflow: hidden;
    background: transparent;
`

export default function SideNav() {
    const navMode = useAppSelector((state) => state.theme.navMode)
    const mode = useAppSelector((state) => state.theme.mode)
    const direction = useAppSelector((state) => state.theme.direction)
    const currentRouteKey = useAppSelector(
        (state) => state.base.common.currentRouteKey,
    )
    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )
    const userAuthority = useAppSelector((state) => state.auth.user.authority)
    const { larger } = useResponsive()
    const theme = useTheme()

    // Pick background color based on navMode
    let bg = theme.colors.bg.card
    if (navMode === NAV_MODE_THEMED) {
        bg = theme.colors.primary
    } else if (navMode === NAV_MODE_DARK) {
        bg = theme.colors.bg.card
    }

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) return NAV_MODE_DARK
        if (navMode === NAV_MODE_TRANSPARENT) return mode
        return navMode
    }

    const menuContent = (
        <AdminMenuContent
            navMode={navMode}
            collapsed={sideNavCollapse}
            navigationTree={adminNavigationConfig}
            routeKey={currentRouteKey}
            userAuthority={userAuthority as string[]}
            direction={direction}
        />
    )

    if (!larger.md) return null

    return (
        <SideNavContainer $collapsed={sideNavCollapse} bg={bg}>
            <SideNavHeader>
                <Logo
                    mode={logoMode() === 'dark' ? 'dark' : 'light'}
                    style={{ height: 40, width: 40 }}
                />
            </SideNavHeader>
            {sideNavCollapse ? (
                menuContent
            ) : (
                <SideNavContent>
                    <ScrollBar autoHide direction={direction}>
                        {menuContent}
                    </ScrollBar>
                </SideNavContent>
            )}
        </SideNavContainer>
    )
}
