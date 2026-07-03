import { Field } from 'formik'
import React from 'react'

import { FormItem } from '@/components/ui/Form'

type Props = {
    name: string
    label: string
    editor: React.ComponentType<{
        value: string
        onChange: (val: string) => void
    }>
    className?: string
    touched?: any
    errors?: any
}

export default function RichTextField({
    name,
    label,
    editor: Editor,
    className,
    touched,
    errors,
}: Props) {
    // This one is used in pages that already pass touched/errors down,
    // so we support both patterns.
    const isTouched = Boolean(touched?.[name])
    const errorMsg = errors?.[name] as string | undefined
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
                    <Editor
                        value={field.value}
                        onChange={(val: string) =>
                            form.setFieldValue(field.name, val)
                        }
                    />
                )}
            </Field>
        </FormItem>
    )
}
