import { Field, FieldProps, getIn, useFormikContext } from 'formik'

import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'

export type Option = { label: string; value: string }

type Props = {
    name: string
    label: string
    options: Option[]
    placeholder?: string
    className?: string
    isClearable?: boolean
    valueMode?: 'value' | 'option' // you store a string value today -> 'value'
    disabled?: boolean
}

export default function SelectField({
    name,
    label,
    options,
    placeholder,
    className,
    isClearable = true,
    valueMode = 'value',
    disabled,
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
                {({ field, form }: FieldProps) => {
                    const currentValue =
                        valueMode === 'option'
                            ? field.value
                            : String(field.value ?? '')

                    const selected =
                        valueMode === 'option'
                            ? (field.value ?? null)
                            : (options.find((o) => o.value === currentValue) ??
                              null)

                    return (
                        <Select
                            field={field}
                            form={form}
                            options={options}
                            placeholder={placeholder}
                            isClearable={isClearable}
                            value={selected}
                            isDisabled={disabled}
                            onChange={(opt: any) => {
                                if (disabled) return

                                if (valueMode === 'option') {
                                    form.setFieldValue(name, opt ?? null)
                                } else {
                                    form.setFieldValue(name, opt?.value ?? '')
                                }
                            }}
                        />
                    )
                }}
            </Field>
        </FormItem>
    )
}
