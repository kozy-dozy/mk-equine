import { Field } from 'formik'

import Checkbox from '@/components/ui/Checkbox'
import { FormItem } from '@/components/ui/Form'

type ValueMode = 'boolean' | 'number'

type Props = {
    name: string
    label?: string
    children?: React.ReactNode

    /**
     * If you store the checkbox as `true/false`, use "boolean" (default)
     * If you store the checkbox as `1/0`, use "number"
     */
    valueMode?: ValueMode

    /** Only used when valueMode="number" */
    trueValue?: number
    falseValue?: number

    /** Optional FormItem wrapper (some checkboxes don't want a label row) */
    formItem?: boolean
    formItemClassName?: string
}

export default function CheckboxField({
    name,
    label,
    children,
    valueMode = 'boolean',
    trueValue = 1,
    falseValue = 0,
    formItem = false,
    formItemClassName,
}: Props) {
    const content = (
        <Field name={name}>
            {({ field, form }: any) => {
                const checked =
                    valueMode === 'number'
                        ? Number(field.value) === trueValue
                        : Boolean(field.value)

                const handleChange = (nextChecked: boolean) => {
                    const nextValue =
                        valueMode === 'number'
                            ? nextChecked
                                ? trueValue
                                : falseValue
                            : nextChecked

                    form.setFieldValue(name, nextValue)
                }

                return (
                    <Checkbox checked={checked} onChange={handleChange}>
                        {children ?? label}
                    </Checkbox>
                )
            }}
        </Field>
    )

    if (!formItem) return content

    return <FormItem className={formItemClassName}>{content}</FormItem>
}
