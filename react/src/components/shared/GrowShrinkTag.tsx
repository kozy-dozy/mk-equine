import { forwardRef } from 'react'
import { HiArrowUp, HiArrowDown } from 'react-icons/hi'
import styled, { css } from 'styled-components'

import Tag from '@/components/ui/Tag'

import type { ReactNode } from 'react'

type GrowShrinkTagProps = {
    value?: number
    showIcon?: boolean
    prefix?: ReactNode | string
    suffix?: ReactNode | string
    className?: string
}

const StyledTag = styled(Tag)<{ $value: number }>`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-weight: bold;
    border: 0;
    ${({ $value, theme }) =>
        $value > 0
            ? css`
                  color: ${theme.colors.status.success};
                  background: ${theme.colors.bg.hover};
              `
            : $value < 0
              ? css`
                    color: ${theme.colors.status.error};
                    background: ${theme.colors.bg.hover};
                `
              : css``}
`

const GrowShrinkTag = forwardRef<HTMLDivElement, GrowShrinkTagProps>(
    (props, ref) => {
        const { value = 0, prefix, suffix, showIcon = true, ...rest } = props
        return (
            <StyledTag ref={ref} $value={value} {...rest}>
                {value !== 0 && (
                    <span>
                        {showIcon &&
                            (value > 0 ? <HiArrowUp /> : <HiArrowDown />)}
                    </span>
                )}
                <span>
                    {prefix}
                    {value}
                    {suffix}
                </span>
            </StyledTag>
        )
    },
)

GrowShrinkTag.displayName = 'GrowShrinkTag'

export default GrowShrinkTag
