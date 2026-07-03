import styled, { css } from 'styled-components'
import { forwardRef } from 'react'
import { useConfig } from '../ConfigProvider'
import { useForm } from '../Form/context'
import { useInputGroup } from '../InputGroup/context'
import type { CommonProps, TypeAttributes } from '../@types/common'

export interface AddonProps extends CommonProps {
    size?: TypeAttributes.ControlSize
}

const sizeStyles = {
    sm: css`
        font-size: ${({ theme }) => theme.fontSize.base};
        height: 2rem;
        padding: 0 ${({ theme }) => theme.spacing.sm};
    `,
    md: css`
        font-size: ${({ theme }) => theme.fontSize.md};
        height: 2.5rem;
        padding: 0 ${({ theme }) => theme.spacing.md};
    `,
    lg: css`
        font-size: ${({ theme }) => theme.fontSize.lg};
        height: 3rem;
        padding: 0 ${({ theme }) => theme.spacing.lg};
    `,
}

const StyledAddon = styled.div<{ $size: string }>`
    display: inline-flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.bg.hover};
    color: ${({ theme }) => theme.colors.text.secondary};
    border-radius: ${({ theme }) => theme.radius.md};
    ${({ $size }) =>
        sizeStyles[$size as keyof typeof sizeStyles] || sizeStyles.md}
`

const Addon = forwardRef<HTMLDivElement, AddonProps>((props, ref) => {
    const { size, children } = props
    const { controlSize } = useConfig()
    const formControlSize = useForm()?.size
    const inputGroupSize = useInputGroup()?.size
    const inputAddonSize =
        size || inputGroupSize || formControlSize || controlSize || 'md'
    return (
        <StyledAddon ref={ref} $size={inputAddonSize}>
            {children}
        </StyledAddon>
    )
})

Addon.displayName = 'Addon'

export default Addon
