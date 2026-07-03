import styled from 'styled-components'
import type { ComponentType, FC } from 'react'

const HeaderActionItem = styled.div<{ $hoverable?: boolean }>`
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: 0;
    transition: background 0.15s;
    ${({ $hoverable, theme }) =>
        $hoverable &&
        `
        &:hover {
            background: ${theme.colors.bg.hover};
        }
    `}
`

export type WithHeaderItemProps = {
    className?: string
    hoverable?: boolean
}

const withHeaderItem = <T extends WithHeaderItemProps>(
    Component: ComponentType<Omit<T, keyof WithHeaderItemProps>>,
): FC<T> => {
    const WithHeaderItem: FC<T> = (props: T) => {
        const { className, hoverable = true, ...rest } = props
        return (
            <HeaderActionItem className={className} $hoverable={hoverable}>
                <Component {...(rest as Omit<T, keyof WithHeaderItemProps>)} />
            </HeaderActionItem>
        )
    }
    WithHeaderItem.displayName = `withHeaderItem(${
        Component.displayName || Component.name || 'Component'
    })`
    return WithHeaderItem
}

export default withHeaderItem
