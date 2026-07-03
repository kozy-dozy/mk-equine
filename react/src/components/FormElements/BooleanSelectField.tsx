import { Field, FieldProps } from 'formik'
import styled from 'styled-components'

import { FormItem } from '@/components/ui/Form'

const StyledSelect = styled.select<{ $invalid?: boolean; $disabled?: boolean }>`
    display: block;
    width: 100%;
    background: ${({ theme }) => theme.colors.bg.input};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme, $invalid }) =>
        $invalid ? theme.colors.status.error : theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.fontSize.base};
    padding: 7px 36px 7px 12px;
    height: 36px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
    transition: border-color ${({ theme }) => theme.transition.fast},
                box-shadow ${({ theme }) => theme.transition.fast};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
    }

    option {
        background: ${({ theme }) => theme.colors.bg.card};
        color: ${({ theme }) => theme.colors.text.primary};
    }
`

type Props = {
    name: string
    label: string
    trueLabel?: string
    falseLabel?: string
    disabled?: boolean
    className?: string
}

export default function BooleanSelectField({
    name,
    label,
    trueLabel = 'Yes',
    falseLabel = 'No',
    disabled,
    className,
}: Props) {
    return (
        <FormItem className={className} label={label}>
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <StyledSelect
                        value={field.value ? 'yes' : 'no'}
                        disabled={disabled}
                        $disabled={disabled}
                        onChange={(e) =>
                            form.setFieldValue(name, e.target.value === 'yes')
                        }
                    >
                        <option value="no">{falseLabel}</option>
                        <option value="yes">{trueLabel}</option>
                    </StyledSelect>
                )}
            </Field>
        </FormItem>
    )
}
