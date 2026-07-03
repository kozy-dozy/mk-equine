import styled from 'styled-components'
import { forwardRef } from 'react'
import { MenuContextProvider } from './context/menuContext'
import type { CommonProps, TypeAttributes } from '../@types/common'

export interface MenuProps extends CommonProps {
    defaultActiveKeys?: Array<string>
    defaultExpandedKeys?: Array<string>
    menuItemHeight?: number
    onSelect?: (eventKey: string, e: React.MouseEvent) => void
    sideCollapsed?: boolean
    variant?: TypeAttributes.MenuVariant
}

const StyledMenu = styled.nav<{
    $variant: string
}>`
    width: 100%;
    background: ${({ $variant, theme }) =>
        $variant === 'themed'
            ? theme.colors.primary
            : $variant === 'dark'
              ? theme.colors.bg.hover
              : theme.colors.bg.card};
    border-radius: ${({ theme }) => theme.radius.md};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
`

const Menu = forwardRef<HTMLElement, MenuProps>((props, ref) => {
    const {
        children,
        defaultActiveKeys = [],
        defaultExpandedKeys = [],
        menuItemHeight = 40,
        onSelect,
        sideCollapsed = false,
        variant = 'light',
        className,
        ...rest
    } = props

    return (
        <StyledMenu
            ref={ref as any}
            $variant={variant}
            className={className}
            {...rest}
        >
            <MenuContextProvider
                value={{
                    onSelect,
                    menuItemHeight,
                    variant,
                    sideCollapsed,
                    defaultExpandedKeys,
                    defaultActiveKeys,
                }}
            >
                {children}
            </MenuContextProvider>
        </StyledMenu>
    )
})

Menu.displayName = 'Menu'

export default Menu
