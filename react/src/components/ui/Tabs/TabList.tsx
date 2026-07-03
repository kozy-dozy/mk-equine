import { forwardRef } from 'react'
import styled from 'styled-components'

import { useTabs } from './context'

export type TabListProps = {
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
}

const TabListWrap = styled.div<{ $variant: string }>`
    display: flex;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: ${({ $variant, theme }) =>
        $variant === 'underline'
            ? `1px solid ${theme.colors.border.default}`
            : 'none'};
    gap: ${({ $variant, theme }) =>
        $variant === 'pill' ? theme.spacing.xs : '0'};
    padding: ${({ $variant, theme }) =>
        $variant === 'pill' ? theme.spacing.xs : '0'};
`

const TabList = forwardRef<HTMLDivElement, TabListProps>((props, ref) => {
    const { className, children, ...rest } = props
    const { variant } = useTabs()

    return (
        <TabListWrap ref={ref} role="tablist" className={className} $variant={variant ?? 'underline'} {...rest}>
            {children}
        </TabListWrap>
    )
})

TabList.displayName = 'TabList'

export default TabList
