import { Link } from 'react-router-dom'
import styled from 'styled-components'

import type { CommonProps } from '@/@types/common'
import type { ComponentPropsWithoutRef } from 'react'

interface ActionLinkProps extends CommonProps, ComponentPropsWithoutRef<'a'> {
    themeColor?: boolean
    to?: string
    href?: string
    reloadDocument?: boolean
}

const StyledLink = styled(Link)<{ $themeColor?: boolean }>`
    color: ${({ $themeColor, theme }) =>
        $themeColor ? theme.colors.primary : 'inherit'};
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`

const StyledA = styled.a<{ $themeColor?: boolean }>`
    color: ${({ $themeColor, theme }) =>
        $themeColor ? theme.colors.primary : 'inherit'};
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`

const ActionLink = (props: ActionLinkProps) => {
    const {
        children,
        themeColor = true,
        to,
        reloadDocument,
        href = '',
        ...rest
    } = props

    return to ? (
        <StyledLink
            to={to}
            reloadDocument={reloadDocument}
            $themeColor={themeColor}
            {...rest}
        >
            {children}
        </StyledLink>
    ) : (
        <StyledA href={href} $themeColor={themeColor} {...rest}>
            {children}
        </StyledA>
    )
}

export default ActionLink
