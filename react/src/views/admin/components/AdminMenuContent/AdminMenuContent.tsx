import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Direction, NavMode } from '@/@types/theme'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import Menu from '@/components/ui/Menu'
import { themeConfig } from '@/configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import useMenuActive from '@/utils/hooks/useMenuActive'

import CollapsedMenuItem from './CollapsedMenuItem'
import SingleMenuItem from './SingleMenuItem'

import type { NavigationTree } from '@/@types/navigation'

export interface AdminMenuContentProps {
    navMode: NavMode
    collapsed?: boolean
    routeKey: string
    navigationTree?: NavigationTree[]
    userAuthority: string[]
    onMenuItemClick?: () => void
    direction?: Direction
}

const { MenuGroup } = Menu

const MenuWrapper = styled.div`
    padding: ${({ theme }) => `${theme.spacing.md} 0`};
`

export default function MenuContent(props: AdminMenuContentProps) {
    const {
        navMode = themeConfig.navMode,
        collapsed = false,
        routeKey,
        navigationTree = [],
        userAuthority = [],
        onMenuItemClick,
        direction = themeConfig.direction,
    } = props

    const [defaulExpandKey, setDefaulExpandKey] = useState<string[]>([])

    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    useEffect(() => {
        if (defaulExpandKey.length === 0 && activedRoute?.parentKey) {
            setDefaulExpandKey([activedRoute?.parentKey])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activedRoute?.parentKey])

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const getNavItem = (nav: NavigationTree) => {
        if (nav.subMenu.length === 0 && nav.type === NAV_ITEM_TYPE_ITEM) {
            return (
                <SingleMenuItem
                    key={nav.key}
                    nav={nav}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                    onLinkClick={handleLinkClick}
                />
            )
        }

        if (nav.subMenu.length > 0 && nav.type === NAV_ITEM_TYPE_COLLAPSE) {
            return (
                <CollapsedMenuItem
                    key={nav.key}
                    nav={nav}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                    onLinkClick={onMenuItemClick}
                />
            )
        }

        if (nav.type === NAV_ITEM_TYPE_TITLE) {
            if (nav.subMenu.length > 0) {
                return (
                    <AuthorityCheck
                        key={nav.key}
                        userAuthority={userAuthority}
                        authority={nav.authority}
                    >
                        <MenuGroup label={nav.title}>
                            {nav.subMenu.map((subNav) =>
                                subNav.subMenu.length > 0 ? (
                                    <CollapsedMenuItem
                                        key={subNav.key}
                                        nav={subNav}
                                        sideCollapsed={collapsed}
                                        userAuthority={userAuthority}
                                        direction={direction}
                                        onLinkClick={onMenuItemClick}
                                    />
                                ) : (
                                    <SingleMenuItem
                                        key={subNav.key}
                                        nav={subNav}
                                        sideCollapsed={collapsed}
                                        userAuthority={userAuthority}
                                        direction={direction}
                                        onLinkClick={onMenuItemClick}
                                    />
                                ),
                            )}
                        </MenuGroup>
                    </AuthorityCheck>
                )
            } else {
                ;<MenuGroup label={nav.title} />
            }
        }
    }

    return (
        <MenuWrapper>
            <Menu
                variant={navMode}
                sideCollapsed={collapsed}
                defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
                defaultExpandedKeys={defaulExpandKey}
            >
                {navigationTree.map((nav) => getNavItem(nav))}
            </Menu>
        </MenuWrapper>
    )
}
