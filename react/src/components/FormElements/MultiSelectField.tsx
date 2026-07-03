import { Field, FieldProps, getIn, useFormikContext } from 'formik'
import CreatableSelect from 'react-select/creatable'

import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'

import type { Option } from './SelectField'

type Props = {
    name: string
    label: string
    options: Option[]
    value?: Option[] // allow caller to pass normalized value (your normalizeTags)
    className?: string
    placeholder?: string
}

export default function MultiSelectField({
    name,
    label,
    options,
    value,
    className,
    placeholder,
}: Props) {
    const { touched, errors } = useFormikContext<any>()
    const isTouched = Boolean(getIn(touched, name))
    const errorMsg = getIn(errors, name) as any
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
                    <Select
                        isMulti
                        componentAs={CreatableSelect}
                        field={field}
                        form={form}
                        options={options}
                        placeholder={placeholder}
                        value={value ?? field.value ?? []}
                        onChange={(opt: any) =>
                            form.setFieldValue(name, opt ?? [])
                        }
                    />
                )}
            </Field>
        </FormItem>
    )
}
