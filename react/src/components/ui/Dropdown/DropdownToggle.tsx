import { forwardRef } from 'react'
import {
    HiChevronDown,
    HiChevronUp,
    HiChevronRight,
    HiChevronLeft,
} from 'react-icons/hi'
import styled from 'styled-components'

import type { CommonProps } from '../@types/common'
import type { DropdownPlacement } from '../@types/placement'
import type { ReactNode } from 'react'

export interface DropdownToggleSharedProps {
    renderTitle?: ReactNode
    placement?: DropdownPlacement
    toggleClassName?: string
    showArrow?: boolean
}

interface DropdownToggleProps extends CommonProps, DropdownToggleSharedProps {
    disabled?: boolean
    id?: string
}

const DropdownToggleDefaultContent = ({
    placement,
    children,
    showArrow,
}: {
    placement: DropdownPlacement
    children: string | ReactNode
    showArrow?: boolean
}) => {
    if (placement && placement.includes('middle-start')) {
        return (
            <>
                {children}
                {showArrow && <HiChevronRight />}
            </>
        )
    }

    if (placement && placement.includes('middle-end')) {
        return (
            <>
                {showArrow && <HiChevronLeft />}
                {children}
            </>
        )
    }

    if (placement && placement.includes('top')) {
        return (
            <>
                {children}
                {showArrow && <HiChevronUp />}
            </>
        )
    }

    return (
        <>
            {children}
            {showArrow && <HiChevronDown />}
        </>
    )
}

const StyledDropdownToggle = styled.button<{ $disabled?: boolean; $renderTitle?: boolean }>`
    display: inline-flex;
    align-items: center;
    padding: ${({ $renderTitle, theme }) => ($renderTitle ? '0' : `${theme.spacing.sm} ${theme.spacing.md}`)};
    border-radius: 0.375rem;
    background: ${({ $renderTitle, theme }) => ($renderTitle ? 'none' : theme.colors.bg.card)};
    border: ${({ $renderTitle, theme }) => ($renderTitle ? 'none' : `1px solid ${theme.colors.border.default}`)};
    font-size: ${({ theme }) => theme.fontSize.md};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
    transition: background 0.15s;
    &:hover {
        background: ${({ $renderTitle, theme }) => ($renderTitle ? 'none' : theme.colors.bg.hover)};
    }
`
const StyledInner = styled.span`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const DropdownToggle = forwardRef<HTMLButtonElement, DropdownToggleProps>(
    (props, ref) => {
        const {
            renderTitle,
            children,
            placement = 'bottom-start',
            disabled,
            showArrow,
            toggleClassName,
            ...rest
        } = props

        if (renderTitle) {
            return (
                <StyledDropdownToggle
                    ref={ref}
                    $renderTitle
                    type="button"
                    $disabled={disabled}
                    disabled={disabled}
                    {...rest}
                >
                    {renderTitle}
                </StyledDropdownToggle>
            )
        }

        return (
            <StyledDropdownToggle
                ref={ref}
                type="button"
                $disabled={disabled}
                disabled={disabled}
                {...rest}
            >
                <StyledInner>
                    <DropdownToggleDefaultContent
                        placement={placement}
                        showArrow={showArrow ?? true}
                    >
                        {children}
                    </DropdownToggleDefaultContent>
                </StyledInner>
            </StyledDropdownToggle>
        )
    },
)

DropdownToggle.displayName = 'DropdownToggle'

export default DropdownToggle
