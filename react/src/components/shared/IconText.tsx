import styled from 'styled-components'
import type { CommonProps } from '@/@types/common'
import type { ReactNode, ElementType } from 'react'

export interface IconTextProps extends CommonProps {
    icon?: ReactNode | string
    asElement?: ElementType
}

const StyledIconText = styled.span`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const IconText = ({
    asElement: Component = StyledIconText,
    icon,
    children,
    ...rest
}: IconTextProps) => {
    return (
        <Component {...rest}>
            {icon}
            {children}
        </Component>
    )
}

export default IconText
