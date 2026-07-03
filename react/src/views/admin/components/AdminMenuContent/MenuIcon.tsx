import styled from 'styled-components'
import type { ElementType, ComponentPropsWithRef } from 'react'

import navigationIcon from '@/configs/navigation-icon.config'

type MenuIconProps = {
    icon: string
    gutter?: boolean
}

export const Icon = <T extends ElementType>({
    component,
    ...props
}: {
    component: T
} & ComponentPropsWithRef<T>) => {
    const Component = component
    return <Component {...props} />
}

const IconSpan = styled.span<{ $gutter?: boolean }>`
    font-size: 2rem;
    ${({ $gutter, theme }) => $gutter && `margin-left: ${theme.spacing.sm};`}
    display: inline-flex;
    align-items: center;
`

export default function MenuIcon({ icon, gutter = true }: MenuIconProps) {
    if (typeof icon !== 'string' && !icon) {
        return <></>
    }
    return <IconSpan $gutter={gutter}>{navigationIcon[icon]}</IconSpan>
}
