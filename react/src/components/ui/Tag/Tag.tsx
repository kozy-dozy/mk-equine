import { forwardRef } from 'react'
import styled from 'styled-components'

import type { ReactNode } from 'react'

export interface TagProps {
    className?: string
    children: ReactNode
    style?: React.CSSProperties
}

const TagWrap = styled.div`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.radius.full};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    background: ${({ theme }) => theme.colors.bg.card};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: 600;
    white-space: nowrap;
`

const Tag = forwardRef<HTMLDivElement, TagProps>((props, ref) => {
    const { className, children, ...rest } = props
    return (
        <TagWrap ref={ref} className={className} {...rest}>
            {children}
        </TagWrap>
    )
})

Tag.displayName = 'Tag'

export default Tag
