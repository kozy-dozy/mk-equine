import { Link } from 'react-router-dom'
import styled from 'styled-components'

import AuthorityCheck from '@/components/shared/AuthorityCheck'
import Dropdown from '@/components/ui/Dropdown'
import Menu from '@/components/ui/Menu'

import MenuIcon from './MenuIcon'

import type { CommonProps } from '@/@types/common'
import type { NavigationTree } from '@/@types/navigation'
import type { Direction } from '@/@types/theme'

interface DefaultItemProps extends CommonProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    userAuthority: string[]
}

interface CollapsedItemProps extends DefaultItemProps {
    direction: Direction
}

interface CollapsedMenuItemProps extends CollapsedItemProps {
    sideCollapsed?: boolean
}

const { MenuItem, MenuCollapse } = Menu

const FlexRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const StyledMenuCollapse = styled(MenuCollapse)`
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const StyledMenuItem = styled(MenuItem)`
    padding: 0 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    transition: background ${({ theme }) => theme.transition.fast};
    &:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
    }
`

const DefaultItem = ({ nav, onLinkClick, userAuthority }: DefaultItemProps) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <StyledMenuCollapse
                key={nav.key}
                label={
                    <FlexRow>
                        <MenuIcon icon={nav.icon} />
                        <span>{nav.title}</span>
                    </FlexRow>
                }
                eventKey={nav.key}
                expanded={false}
            >
                {nav.subMenu.map((subNav) => (
                    <AuthorityCheck
                        key={subNav.key}
                        userAuthority={userAuthority}
                        authority={subNav.authority}
                    >
                        <StyledMenuItem eventKey={subNav.key}>
                            {subNav.path ? (
                                <Link
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    to={subNav.path}
                                    target={
                                        subNav.isExternalLink ? '_blank' : ''
                                    }
                                    onClick={() =>
                                        onLinkClick?.({
                                            key: subNav.key,
                                            title: subNav.title,
                                            path: subNav.path,
                                        })
                                    }
                                >
                                    <span>{subNav.title}</span>
                                </Link>
                            ) : (
                                <span>{subNav.title}</span>
                            )}
                        </StyledMenuItem>
                    </AuthorityCheck>
                ))}
            </StyledMenuCollapse>
        </AuthorityCheck>
    )
}

const CollapsedItem = ({
    nav,
    onLinkClick,
    userAuthority,
    direction,
}: CollapsedItemProps) => {
    const menuItem = (
        <StyledMenuItem key={nav.key} eventKey={nav.key}>
            <MenuIcon icon={nav.icon} />
        </StyledMenuItem>
    )

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <Dropdown
                trigger="hover"
                renderTitle={menuItem}
                placement={
                    direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'
                }
            >
                {nav.subMenu.map((subNav) => (
                    <AuthorityCheck
                        key={subNav.key}
                        userAuthority={userAuthority}
                        authority={subNav.authority}
                    >
                        <Dropdown.Item eventKey={subNav.key}>
                            {subNav.path ? (
                                <Link
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    to={subNav.path}
                                    target={
                                        subNav.isExternalLink ? '_blank' : ''
                                    }
                                    onClick={() =>
                                        onLinkClick?.({
                                            key: subNav.key,
                                            title: subNav.title,
                                            path: subNav.path,
                                        })
                                    }
                                >
                                    <span>{subNav.title}</span>
                                </Link>
                            ) : (
                                <span>{subNav.title}</span>
                            )}
                        </Dropdown.Item>
                    </AuthorityCheck>
                ))}
            </Dropdown>
        </AuthorityCheck>
    )
}

export default function CollapsedMenuItem({
    sideCollapsed,
    ...rest
}: CollapsedMenuItemProps) {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}
