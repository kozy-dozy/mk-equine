import { forwardRef, useContext } from 'react'
import styled from 'styled-components'

import { SIZES } from '../utils/constants'

import SegmentContext, { useSegment } from './context'

import type { SegmentValue } from './context'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode, ComponentPropsWithRef } from 'react'

type ChildrenParams = {
    active: boolean
    disabled: boolean
    value: string
    onSegmentItemClick: () => void
}

export interface SegmentItemProps
    extends
        Omit<CommonProps, 'children'>,
        Omit<ComponentPropsWithRef<'button'>, 'children'> {
    children: ((params: ChildrenParams) => ReactNode) | ReactNode
    disabled?: boolean
    size?: TypeAttributes.Size
    value?: string
}

const unwrapArray = (arg: (params: ChildrenParams) => ReactNode) =>
    Array.isArray(arg) ? arg[0] : arg

const SegmentItem = forwardRef<HTMLButtonElement, SegmentItemProps>(
    (props, ref) => {
        const { size } = useContext(SegmentContext)

        const { children, disabled = false, value: valueProp, ...rest } = props

        const {
            value: valueContext,
            onActive,
            onDeactivate,
            selectionType,
        } = useSegment()

        const active = (valueContext as string[]).includes(valueProp as string)

        // getSegmentSize is now handled by styled-components

        const onSegmentItemClick = () => {
            if (!disabled) {
                if (!active) {
                    if (selectionType === 'single') {
                        onActive?.([valueProp as string])
                    }
                    if (selectionType === 'multiple') {
                        const nextValue = [
                            ...(valueContext as string[]),
                            ...[valueProp],
                        ] as string[]
                        onActive?.(nextValue)
                    }
                } else if (selectionType === 'multiple') {
                    onDeactivate?.(valueProp as SegmentValue)
                }
            }
        }

        return typeof children === 'function' ? (
            unwrapArray(children)({
                active,
                onSegmentItemClick,
                disabled,
                value: valueProp,
                ...rest,
            })
        ) : (
            <StyledSegmentButton
                ref={ref}
                $active={active}
                $disabled={disabled}
                $size={size}
                onClick={onSegmentItemClick}
                {...rest}
            >
                {children}
            </StyledSegmentButton>
        )
    },
)

const StyledSegmentButton = styled.button<{
    $active?: boolean
    $disabled?: boolean
    $size?: TypeAttributes.Size
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    border-radius: ${({ theme }) => theme.radius.md};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
    background: ${({ $active, theme }) =>
        $active ? theme.colors.primary : theme.colors.bg.card};
    color: ${({ $active, theme }) =>
        $active ? theme.colors.bg.card : theme.colors.text.primary};
    box-shadow: ${({ $active, theme }) => ($active ? theme.shadow.sm : 'none')};
    transition:
        background 0.18s,
        color 0.18s,
        box-shadow 0.18s;
    margin: 0 ${({ theme }) => theme.spacing.xxs};

    /* Size variants */
    ${({ $size, theme }) => {
        switch ($size) {
            case SIZES.LG:
                return `height: 44px; padding: 0 ${theme.spacing.xl}; font-size: ${theme.fontSize.lg};`
            case SIZES.SM:
                return `height: 32px; padding: 0 ${theme.spacing.md}; font-size: ${theme.fontSize.md};`
            case SIZES.XS:
                return `height: 28px; padding: 0 ${theme.spacing.sm}; font-size: ${theme.fontSize.sm};`
            default:
                return `height: 38px; padding: 0 ${theme.spacing.lg}; font-size: ${theme.fontSize.base};`
        }
    }}

    &.segment-item-default {
        /* legacy class, no-op */
    }
    &.segment-item-active {
        /* legacy class, no-op */
    }
    &.segment-item-disabled {
        /* legacy class, no-op */
    }
`

SegmentItem.displayName = 'SegmentItem'

export default SegmentItem
