import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import type { ElementType, ReactNode, MouseEvent } from 'react'

export interface MenuItemProps {
    asElement?: ElementType
    id?: string
    className?: string
    style?: React.CSSProperties
    disabled?: boolean
    eventKey?: string
    isActive?: boolean
    menuItemHeight?: string | number
    onSelect?: (eventKey: string, e: MouseEvent) => void
    variant?: 'light' | 'dark' | 'themed' | 'transparent'
    children?: ReactNode
}

const lightVariant = css`
    color: ${({ theme }) => theme.colors.text.secondary};
    &:hover:not([data-disabled="true"]) {
        color: ${({ theme }) => theme.colors.text.primary};
        background: ${({ theme }) => theme.colors.bg.hover};
    }
    &[data-active="true"] {
        color: ${({ theme }) => theme.colors.text.primary};
        background: ${({ theme }) => theme.colors.bg.hover};
    }
`

const darkVariant = css`
    color: ${({ theme }) => theme.colors.text.secondary};
    &:hover:not([data-disabled="true"]) {
        color: ${({ theme }) => theme.colors.text.primary};
        background: rgba(255,255,255,0.08);
    }
    &[data-active="true"] {
        color: ${({ theme }) => theme.colors.text.primary};
        background: rgba(255,255,255,0.12);
    }
`

const StyledMenuItem = styled.div<{ $variant: string; $disabled: boolean }>`
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
    font-weight: 600;
    padding: 0 ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.md};
    display: flex;
    align-items: center;
    width: 100%;
    white-space: nowrap;
    gap: ${({ theme }) => theme.spacing.sm};
    transition:
        background ${({ theme }) => theme.transition.fast},
        color ${({ theme }) => theme.transition.fast};

    ${({ $variant }) => ($variant === 'dark' ? darkVariant : lightVariant)}
`

const MenuItem = forwardRef<HTMLElement, MenuItemProps>((props, ref) => {
    const {
        asElement: Component = 'div',
        children,
        className,
        disabled,
        eventKey,
        isActive,
        menuItemHeight = 35,
        onSelect,
        style,
        variant = 'light',
        ...rest
    } = props

    const handleClick = (e: MouseEvent) => {
        if (onSelect) {
            onSelect(eventKey as string, e)
        }
    }

    return (
        <StyledMenuItem
            ref={ref as React.Ref<HTMLDivElement>}
            as={Component}
            className={className}
            $variant={variant}
            $disabled={!!disabled}
            data-active={isActive ? 'true' : 'false'}
            data-disabled={disabled ? 'true' : 'false'}
            style={{ height: `${menuItemHeight}px`, ...style }}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </StyledMenuItem>
    )
})

MenuItem.displayName = 'BaseMenuItem'

export default MenuItem
