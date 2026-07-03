import { Field, getIn, useFormikContext } from 'formik'
import styled from 'styled-components'

import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

type Props = {
    name: string
    label: string
    placeholder?: string
    type?: string
    autoComplete?: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
    disabled?: boolean
    className?: string
    helperText?: string
    value?: string | number
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const HelperText = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`

export default function TextField({
    name,
    label,
    placeholder,
    type = 'text',
    autoComplete,
    inputMode,
    disabled,
    className,
    helperText,
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
                    <Input
                        {...field}
                        type={type}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value ?? field.value ?? ''}
                        onChange={
                            onChange ??
                            ((e: React.ChangeEvent<HTMLInputElement>) => {
                                form.setFieldValue(name, e.target.value)
                            })
                        }
                    />
                )}
            </Field>
            {helperText && <HelperText>{helperText}</HelperText>}
        </FormItem>
    )
}
