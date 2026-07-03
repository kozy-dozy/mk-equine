import { Link, type LinkProps } from 'react-router-dom'
import styled, { css } from 'styled-components'

type Variant = 'solid' | 'default' | 'plain' | 'twoTone'
type Size = 'sm' | 'md' | 'lg'

export interface LinkButtonProps extends Omit<LinkProps, 'children'> {
    variant?: Variant
    size?: Size
    block?: boolean
    children: React.ReactNode
}

const sizeStyles = {
    sm: css`
        font-size: ${({ theme }) => theme.fontSize.sm};
        padding: 6px 14px;
    `,
    md: css`
        font-size: ${({ theme }) => theme.fontSize.base};
        padding: 10px 20px;
    `,
    lg: css`
        font-size: 15px;
        padding: 14px 32px;
    `,
}

const StyledLink = styled(Link)<{
    $variant: Variant
    $size: Size
    $block: boolean
}>`
    display: ${({ $block }) => ($block ? 'flex' : 'inline-flex')};
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
    width: ${({ $block }) => ($block ? '100%' : 'auto')};
    transition:
        background ${({ theme }) => theme.transition.fast},
        border-color ${({ theme }) => theme.transition.fast},
        color ${({ theme }) => theme.transition.fast},
        opacity ${({ theme }) => theme.transition.fast};

    ${({ $size }) => sizeStyles[$size]}

    ${({ $variant, theme }) =>
        $variant === 'solid' &&
        css`
            background: ${theme.colors.primary};
            color: ${theme.colors.text.inverse};
            border: 1px solid transparent;
            &:hover {
                background: ${theme.colors.primaryHover};
            }
            &:active {
                opacity: 0.88;
            }
        `}

    ${({ $variant, theme }) =>
        $variant === 'default' &&
        css`
            background: ${theme.colors.bg.card};
            color: ${theme.colors.text.primary};
            border: 1px solid ${theme.colors.border.default};
            &:hover {
                border-color: ${theme.colors.primary};
                color: ${theme.colors.primary};
            }
        `}

    ${({ $variant, theme }) =>
        $variant === 'plain' &&
        css`
            background: transparent;
            color: ${theme.colors.text.secondary};
            border: 1px solid transparent;
            &:hover {
                color: ${theme.colors.primary};
            }
        `}

    ${({ $variant, theme }) =>
        $variant === 'twoTone' &&
        css`
            background: ${theme.colors.primaryLight};
            color: ${theme.colors.primary};
            border: 1px solid transparent;
            &:hover {
                background: ${theme.colors.primary};
                color: ${theme.colors.text.inverse};
            }
        `}
`

export default function LinkButton({
    variant = 'default',
    size = 'md',
    block = false,
    children,
    ...rest
}: LinkButtonProps) {
    return (
        <StyledLink $variant={variant} $size={size} $block={block} {...rest}>
            {children}
        </StyledLink>
    )
}
