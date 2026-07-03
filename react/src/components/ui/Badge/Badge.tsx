import { forwardRef } from 'react'
import styled from 'styled-components'

import type { CommonProps } from '../@types/common'
import type { CSSProperties } from 'react'

export interface BadgeProps extends CommonProps {
    badgeStyle?: CSSProperties
    content?: string | number
    maxCount?: number
}

const BadgeWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    position: relative;
`
const BadgeInner = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.inverse};
    background: #f87171;
    border-radius: ${({ theme }) => theme.radius.full};
    position: absolute;
    top: -${({ theme }) => theme.spacing.xs};
    right: -${({ theme }) => theme.spacing.xs};
    z-index: 1;
`
const BadgeDot = styled.span`
    width: 4px;
    height: 4px;
    background: #f87171;
    border-radius: ${({ theme }) => theme.radius.full};
    display: inline-block;
    position: absolute;
    top: -${({ theme }) => theme.spacing['xxs']};
    right: -${({ theme }) => theme.spacing['xxs']};
    z-index: 1;
`

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
    const { badgeStyle, children, content, maxCount = 99, ...rest } = props

    const dot = typeof content !== 'number' && typeof content !== 'string'

    if (children) {
        return (
            <BadgeWrapper ref={ref} {...rest}>
                {dot ? (
                    <BadgeDot style={badgeStyle} />
                ) : (
                    <BadgeInner style={badgeStyle}>
                        {typeof content === 'number' && content > maxCount
                            ? `${maxCount}+`
                            : content}
                    </BadgeInner>
                )}
                {children}
            </BadgeWrapper>
        )
    }
    return dot ? (
        <BadgeDot ref={ref as any} style={badgeStyle} {...rest} />
    ) : (
        <BadgeInner ref={ref as any} style={badgeStyle} {...rest}>
            {content}
        </BadgeInner>
    )
})

Badge.displayName = 'Badge'

export default Badge
