import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'solid' | 'default' | 'plain' | 'twoTone'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    block?: boolean
    active?: boolean
    icon?: React.ReactNode
    color?: string
}

const sizeStyles = {
    sm: css`
        font-size: ${({ theme }) => theme.fontSize.sm};
        padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
    `,
    md: css`
        font-size: ${({ theme }) => theme.fontSize.base};
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
    `,
    lg: css`
        font-size: 15px;
        padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['2xl']}`};
    `,
}

const StyledButton = styled.button<{
    $variant: string
    $size: string
    $block: boolean
    $loading: boolean
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radius.sm};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition:
        background ${({ theme }) => theme.transition.fast},
        border-color ${({ theme }) => theme.transition.fast},
        color ${({ theme }) => theme.transition.fast},
        opacity ${({ theme }) => theme.transition.fast};
    white-space: nowrap;
    width: ${({ $block }) => ($block ? '100%' : 'auto')};
    opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};

    ${({ $size }) =>
        sizeStyles[$size as keyof typeof sizeStyles] ?? sizeStyles.md}

    /* solid */
    ${({ $variant, theme }) =>
        $variant === 'solid' &&
        css`
            background: ${theme.colors.primary};
            color: ${theme.colors.text.inverse};
            border: 1px solid transparent;
            &:hover:not(:disabled) {
                background: ${theme.colors.primaryHover};
            }
            &:active:not(:disabled) {
                opacity: 0.88;
            }
        `}

    /* default */
    ${({ $variant, theme }) =>
        $variant === 'default' &&
        css`
            background: ${theme.colors.bg.card};
            color: ${theme.colors.text.primary};
            border: 1px solid ${theme.colors.border.default};
            &:hover:not(:disabled) {
                border-color: ${theme.colors.primary};
                color: ${theme.colors.primary};
            }
        `}

    /* plain */
    ${({ $variant, theme }) =>
        $variant === 'plain' &&
        css`
            background: transparent;
            color: ${theme.colors.text.secondary};
            border: 1px solid transparent;
            &:hover:not(:disabled) {
                color: ${theme.colors.primary};
            }
        `}

    /* twoTone */
    ${({ $variant, theme }) =>
        $variant === 'twoTone' &&
        css`
            background: ${theme.colors.primaryLight};
            color: ${theme.colors.primary};
            border: 1px solid transparent;
            &:hover:not(:disabled) {
                background: ${theme.colors.primary};
                color: ${theme.colors.text.inverse};
            }
        `}

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
`

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'default',
            size = 'md',
            loading = false,
            block = false,
            disabled,
            children,
            icon,
            ...rest
        },
        ref,
    ) => {
        return (
            <StyledButton
                ref={ref}
                $variant={variant}
                $size={size}
                $block={block}
                $loading={loading}
                disabled={disabled || loading}
                {...rest}
            >
                {icon && <span>{icon}</span>}
                {children}
            </StyledButton>
        )
    },
)

Button.displayName = 'Button'

export default Button
