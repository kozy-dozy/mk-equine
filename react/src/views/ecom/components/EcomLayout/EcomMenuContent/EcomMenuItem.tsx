import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import type { NavMode } from '@/@types/theme'

export type EcomMenuItemProps = {
    nav: {
        key: string
        title: string
        icon: string
        path: string
        isExternalLink?: boolean
    }
    isLink?: boolean
    manuVariant: NavMode
    darkBg?: boolean
    onLinkClick?: () => void
}

const NavItemSpan = styled.span`
    display: block;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.fontSize.base};
    font-weight: 600;
`

const NavItem = styled(NavLink)<{ $dark: boolean }>`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    display: flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ $dark, theme }) =>
        $dark ? theme.colors.text.inverse : theme.colors.text.primary};
    text-decoration: none;
    transition: color 0.3s;
    white-space: nowrap;

    &:hover {
        color: ${({ $dark, theme }) =>
            $dark ? theme.colors.accentGold : theme.colors.primary};
    }

    &.active {
        color: ${({ $dark, theme }) =>
            $dark ? theme.colors.accentGold : theme.colors.primary};
        font-weight: 700;
    }
`

export default function EcomMenuItem({
    nav,
    isLink,
    darkBg = false,
    onLinkClick,
}: EcomMenuItemProps) {
    const { title, path, isExternalLink } = nav
    const isDark = darkBg

    if (path && isLink) {
        return (
            <NavItem
                end
                to={path}
                target={isExternalLink ? '_blank' : undefined}
                $dark={isDark}
                onClick={onLinkClick}
            >
                {title}
            </NavItem>
        )
    }

    return <NavItemSpan>{title}</NavItemSpan>
}
