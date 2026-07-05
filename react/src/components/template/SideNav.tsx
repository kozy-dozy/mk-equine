import styled, { css } from 'styled-components'

import Logo from '@/components/template/Logo'
import ScrollBar from '@kozydozy/ui/ScrollBar'
import adminNavigationConfig from '@/configs/navigation/admin'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
} from '@kozydozy/foundation/constants/theme.constant'
import { useAppSelector } from '@/store'
import useResponsive from '@kozydozy/foundation/hooks/useResponsive'
import AdminMenuContent from '@/views/admin/components/AdminMenuContent'

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

type NavModeType = 'light' | 'dark' | 'themed' | 'transparent'

const SideNavEl = styled.div<{
    $navMode: NavModeType
    $themeColor: string
    $primaryColorLevel: number
    $expanded: boolean
}>`
    display: flex;
    flex-direction: column;
    flex: auto;
    flex-shrink: 0;
    z-index: 20;
    transition: all 0.2s ease-in-out;
    print-color-adjust: exact;

    ${({ $expanded }) =>
        $expanded &&
        css`
            position: sticky;
            top: 0;
            height: 100vh;
        `}

    ${({ $navMode, $themeColor, $primaryColorLevel, theme }) => {
        if ($navMode === 'light') {
            return css`
                background: ${theme.colors.bg.card};
                border-right: 1px solid ${theme.colors.border.default};
            `
        }
        if ($navMode === 'dark') {
            return css`
                background: ${theme.colors.bg.card};
                border-right: 1px solid ${theme.colors.border.dark};
            `
        }
        if ($navMode === 'transparent') {
            return css`
                background: transparent;
            `
        }
        if ($navMode === 'themed') {
            return css`
                background: var(
                    --color-${$themeColor}-${$primaryColorLevel},
                    #4f46e5
                );
                border-right: none;
            `
        }
        return ''
    }}
`

const SideNavHeader = styled.div`
    display: flex;
    align-items: center;
`

const SideNavContent = styled.div`
    height: calc(100vh - 4rem);
    overflow-y: auto;
`

const LogoWrapCollapsed = styled.div`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
`

const LogoWrapExpanded = styled.div`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
`

export default function SideNav() {
    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )
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

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) {
            return NAV_MODE_DARK
        }

        if (navMode === NAV_MODE_TRANSPARENT) {
            return mode
        }

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

    return (
        <>
            {larger.md && (
                <SideNavEl
                    style={
                        sideNavCollapse ? sideNavCollapseStyle : sideNavStyle
                    }
                    $navMode={navMode as NavModeType}
                    $themeColor={themeColor}
                    $primaryColorLevel={primaryColorLevel}
                    $expanded={!sideNavCollapse}
                >
                    <SideNavHeader>
                        {sideNavCollapse ? (
                            <LogoWrapCollapsed>
                                <Logo
                                    mode={
                                        logoMode() === 'dark' ? 'dark' : 'light'
                                    }
                                    logoWidth={36}
                                />
                            </LogoWrapCollapsed>
                        ) : (
                            <LogoWrapExpanded>
                                <Logo
                                    mode={
                                        logoMode() === 'dark' ? 'dark' : 'light'
                                    }
                                    logoWidth={40}
                                />
                            </LogoWrapExpanded>
                        )}
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
                </SideNavEl>
            )}
        </>
    )
}
