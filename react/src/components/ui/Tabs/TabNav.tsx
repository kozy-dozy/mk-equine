import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import useCallbackRef from '../hooks/useCallbackRef'

import { useTabs } from './context'

import type { TabsValue } from './context'
import type { ReactNode } from 'react'

export interface TabNavProps {
    disabled?: boolean
    icon?: string | ReactNode
    value: TabsValue
    className?: string
    style?: React.CSSProperties
    children?: ReactNode
}

const underlineStyle = css<{ $isSelected: boolean; $disabled: boolean }>`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    border-bottom: 2px solid
        ${({ $isSelected, theme }) =>
            $isSelected ? theme.colors.primary : 'transparent'};
    color: ${({ $isSelected, $disabled, theme }) =>
        $disabled
            ? theme.colors.text.disabled
            : $isSelected
              ? theme.colors.primary
              : theme.colors.text.secondary};
    &:hover {
        color: ${({ $disabled, theme }) =>
            $disabled ? theme.colors.text.disabled : theme.colors.primary};
    }
`

const pillStyle = css<{ $isSelected: boolean; $disabled: boolean }>`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
    border-radius: ${({ theme }) => theme.radius.md};
    margin-right: ${({ theme }) => theme.spacing.xs};
    background: ${({ $isSelected, theme }) =>
        $isSelected ? theme.colors.primaryLight : 'transparent'};
    color: ${({ $isSelected, $disabled, theme }) =>
        $disabled
            ? theme.colors.text.disabled
            : $isSelected
              ? theme.colors.primary
              : theme.colors.text.secondary};
    &:hover {
        color: ${({ $disabled, theme }) =>
            $disabled ? theme.colors.text.disabled : theme.colors.primary};
        background: ${({ $isSelected, theme }) =>
            $isSelected ? theme.colors.primaryLight : theme.colors.bg.hover};
    }
`

const TabNavWrap = styled.div<{
    $isSelected: boolean
    $disabled: boolean
    $variant: string
}>`
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all ${({ theme }) => theme.transition.fast};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
    white-space: nowrap;
    user-select: none;

    ${({ $variant }) =>
        $variant === 'pill'
            ? pillStyle
            : underlineStyle}
`

const TabNavIcon = styled.div`
    margin-right: 6px;
    font-size: ${({ theme }) => theme.fontSize.lg};
    display: flex;
`

const TabNav = forwardRef<HTMLDivElement, TabNavProps>((props, ref) => {
    const {
        value: valueProp,
        disabled,
        className,
        icon,
        children,
        ...rest
    } = props

    const { value, onValueChange, variant } = useTabs()
    const isSelected = valueProp === value

    const onTabNavClick = useCallbackRef(() => {
        if (!isSelected && !disabled) {
            onValueChange?.(valueProp)
        }
    })

    return (
        <TabNavWrap
            ref={ref}
            className={className}
            $isSelected={isSelected}
            $disabled={!!disabled}
            $variant={variant ?? 'underline'}
            role="tab"
            aria-selected={isSelected}
            tabIndex={0}
            onClick={onTabNavClick}
            onKeyDown={onTabNavClick}
            {...rest}
        >
            {icon && <TabNavIcon>{icon}</TabNavIcon>}
            {children}
        </TabNavWrap>
    )
})

TabNav.displayName = 'TabNav'

export default TabNav
