import { Field, getIn, useFormikContext } from 'formik'
import React from 'react'
import styled from 'styled-components'

import { FormItem } from '@/components/ui/Form'

type Props = {
    name: string
    label: string
    placeholder?: string
    disabled?: boolean
    className?: string
    helperText?: string
    rows?: number
    minHeight?: number  // height in px — SC equivalent of mk-equine's minHeightClassName
    value?: string
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

const TextareaWrap = styled.div<{ $invalid?: boolean }>`
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid
        ${({ theme, $invalid }) =>
            $invalid ? theme.colors.status.error : theme.colors.border.default};
    background: ${({ theme }) => theme.colors.bg.input};
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
    transition:
        border-color ${({ theme }) => theme.transition.fast},
        box-shadow ${({ theme }) => theme.transition.fast};

    &:focus-within {
        border-color: ${({ theme, $invalid }) =>
            $invalid ? theme.colors.status.error : theme.colors.primary};
        box-shadow: 0 0 0 3px
            ${({ theme, $invalid }) =>
                $invalid
                    ? `${theme.colors.status.error}20`
                    : `${theme.colors.primary}20`};
    }
`

const StyledTextarea = styled.textarea<{ $minHeight?: number; $disabled?: boolean }>`
    width: 100%;
    resize: vertical;
    background: transparent;
    border: none;
    outline: none;
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: inherit;
    min-height: ${({ $minHeight }) => ($minHeight ?? 120)}px;
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

    &::placeholder {
        color: ${({ theme }) => theme.colors.text.disabled};
    }
`

const HelperText = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`

export default function TextareaField({
    name,
    label,
    placeholder,
    disabled,
    className,
    helperText,
    rows,
    minHeight,
    value,
    onChange,
}: Props) {
    const { touched, errors } = useFormikContext<any>()
    const isTouched = Boolean(getIn(touched, name))
    const errorMsg = getIn(errors, name) as string | undefined
    const invalid = Boolean(isTouched && errorMsg)

    return (
        <FormItem
            className={className}
            label={label}
            invalid={invalid}
            errorMessage={invalid ? errorMsg : undefined}
        >
            <Field name={name}>
                {({ field, form }: any) => (
                    <TextareaWrap $invalid={invalid}>
                        <StyledTextarea
                            {...field}
                            rows={rows}
                            disabled={disabled}
                            placeholder={placeholder}
                            $minHeight={minHeight}
                            $disabled={disabled}
                            value={value ?? field.value ?? ''}
                            onChange={
                                onChange ??
                                ((e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    form.setFieldValue(name, e.target.value)
                                })
                            }
                        />
                    </TextareaWrap>
                )}
            </Field>
            {helperText && <HelperText>{helperText}</HelperText>}
        </FormItem>
    )
}
