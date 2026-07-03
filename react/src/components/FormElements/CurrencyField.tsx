import {
    Field,
    FieldInputProps,
    FieldProps,
    getIn,
    useFormikContext,
} from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

import type { InputProps } from '@/components/ui/Input'
import type { ComponentType } from 'react'

const PriceInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} prefix="$" />
}

const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    form: any
    field: FieldInputProps<unknown>
}) => {
    return (
        <NumericFormat
            customInput={Input as ComponentType}
            type="text"
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

type Props = {
    name: string
    label: string
    placeholder?: string
    className?: string
}

export default function CurrencyField({
    name,
    label,
    placeholder,
    className,
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
                {({ field, form }: FieldProps) => (
                    <NumericFormatInput
                        form={form}
                        field={field}
                        placeholder={placeholder}
                        customInput={PriceInput as any}
                        onValueChange={(e) =>
                            form.setFieldValue(field.name, e.value)
                        }
                    />
                )}
            </Field>
        </FormItem>
    )
}
