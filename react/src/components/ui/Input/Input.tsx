import { forwardRef } from 'react'
import styled, { css } from 'styled-components'

import type { InputHTMLAttributes, ElementType, ReactNode, HTMLInputTypeAttribute } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    asElement?: ElementType
    disabled?: boolean
    invalid?: boolean
    prefix?: string | ReactNode
    rows?: number
    size?: 'sm' | 'md' | 'lg'
    suffix?: string | ReactNode
    textArea?: boolean
    type?: HTMLInputTypeAttribute
    field?: any
    form?: any
    className?: string
    style?: React.CSSProperties
    unstyle?: boolean
}

const inputBase = css<{ $invalid?: boolean; $disabled?: boolean }>`
    display: block;
    width: 100%;
    background: ${({ theme }) => theme.colors.bg.input};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme, $invalid }) =>
        $invalid ? theme.colors.status.error : theme.colors.border.strong};
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: ${({ theme }) => theme.fontSize.base};
    transition: border-color ${({ theme }) => theme.transition.fast};

    &::placeholder {
        color: ${({ theme }) => theme.colors.text.disabled};
    }

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
        background: ${({ theme }) => theme.colors.bg.hover};
        color: ${({ theme }) => theme.colors.text.disabled};
        border-color: ${({ theme }) => theme.colors.border.default};
        cursor: not-allowed;
    }
`

const StyledInput = styled.input<{ $invalid?: boolean; $disabled?: boolean; $size?: string }>`
    ${inputBase}
    padding: ${({ $size }) =>
        $size === 'sm' ? '5px 10px' : $size === 'lg' ? '10px 14px' : '7px 12px'};
    height: ${({ $size }) =>
        $size === 'sm' ? '30px' : $size === 'lg' ? '42px' : '36px'};
`

const StyledTextArea = styled.textarea<{ $invalid?: boolean; $disabled?: boolean }>`
    ${inputBase}
    padding: ${({ theme }) => theme.spacing.sm} 12px;
    height: auto;
    resize: vertical;
    min-height: 80px;
`

const InputWrapper = styled.span`
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
`

const Affix = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    padding: 0 10px;
    color: ${({ theme }) => theme.colors.text.secondary};
    pointer-events: none;
    height: 100%;
`

const PrefixAffix = styled(Affix)`
    left: 0;
`

const SuffixAffix = styled(Affix)`
    right: 0;
`

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    (props, ref) => {
        const {
            asElement: Component,
            className,
            disabled,
            invalid,
            prefix,
            size = 'md',
            suffix,
            textArea,
            type = 'text',
            rows,
            style,
            unstyle = false,
            field,
            form,
            ...rest
        } = props

        if (textArea) {
            return (
                <StyledTextArea
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                    className={className}
                    disabled={disabled}
                    $invalid={invalid}
                    rows={rows}
                    style={style}
                    {...field}
                    {...rest}
                />
            )
        }

        if (prefix || suffix) {
            return (
                <InputWrapper className={className} style={style}>
                    {prefix && <PrefixAffix>{prefix}</PrefixAffix>}
                    <StyledInput
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={type}
                        disabled={disabled}
                        $invalid={invalid}
                        $size={size}
                        style={{
                            paddingLeft: prefix ? '36px' : undefined,
                            paddingRight: suffix ? '36px' : undefined,
                        }}
                        {...field}
                        {...rest}
                    />
                    {suffix && <SuffixAffix>{suffix}</SuffixAffix>}
                </InputWrapper>
            )
        }

        return (
            <StyledInput
                ref={ref as React.Ref<HTMLInputElement>}
                className={className}
                type={type}
                disabled={disabled}
                $invalid={invalid}
                $size={size}
                style={style}
                {...field}
                {...rest}
            />
        )
    },
)

Input.displayName = 'Input'

export default Input
