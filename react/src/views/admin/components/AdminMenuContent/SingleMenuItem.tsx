import { Link } from 'react-router-dom'
import styled from 'styled-components'

import AuthorityCheck from '@/components/shared/AuthorityCheck'
import Menu from '@/components/ui/Menu'
import Tooltip from '@/components/ui/Tooltip'

import MenuIcon from './MenuIcon'

import type { CommonProps } from '@/@types/common'
import type { NavigationTree } from '@/@types/navigation'
import type { Direction } from '@/@types/theme'

const { MenuItem } = Menu

const StyledMenuItem = styled(MenuItem)`
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding: 0 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    transition: background ${({ theme }) => theme.transition.fast};
    &:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
    }
`

interface CollapsedItemProps extends CommonProps {
    title: string
    direction?: Direction
}

interface DefaultItemProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    sideCollapsed?: boolean
    userAuthority: string[]
}

interface AdminMenuItemProps extends CollapsedItemProps, DefaultItemProps {}

const CollapsedItem = ({ title, children, direction }: CollapsedItemProps) => {
    return (
        <Tooltip
            title={title}
            placement={direction === 'rtl' ? 'left' : 'right'}
        >
            {children}
        </Tooltip>
    )
}

const DefaultItem = (props: DefaultItemProps) => {
    const { nav, onLinkClick, sideCollapsed = false, userAuthority } = props

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <StyledMenuItem key={nav.key} eventKey={nav.key}>
                <Link
                    to={nav.path}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                        height: '100%',
                    }}
                    target={nav.isExternalLink ? '_blank' : ''}
                    onClick={() =>
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }
                >
                    <MenuIcon icon={nav.icon} />
                    {!sideCollapsed && <span>{nav.title}</span>}
                </Link>
            </StyledMenuItem>
        </AuthorityCheck>
    )
}

export default function SingleMenuItem({
    nav,
    onLinkClick,
    sideCollapsed = false,
    userAuthority,
    direction,
}: Omit<AdminMenuItemProps, 'title' | 'translateKey'>) {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            {sideCollapsed ? (
                <CollapsedItem title={nav.title} direction={direction}>
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        userAuthority={userAuthority}
                        onLinkClick={onLinkClick}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    userAuthority={userAuthority}
                    onLinkClick={onLinkClick}
                />
            )}
        </AuthorityCheck>
    )
}
