import { Field, useFormikContext } from 'formik'

import { FormItem } from '@/components/ui/Form'

import PasswordInput from './PasswordInput'

type Props = {
    name: string
    label: string
    placeholder?: string
    autoComplete?: string
    className?: string
}

export default function PasswordField({
    name,
    label,
    placeholder,
    autoComplete,
    className,
}: Props) {
    const { touched, errors } = useFormikContext<any>()

    const isTouched = Boolean(touched?.[name])
    const errorMsg = errors?.[name] as string | undefined
    const invalid = Boolean(isTouched && errorMsg)

    return (
        <FormItem
            className={className}
            htmlFor={name}
            label={label}
            invalid={invalid}
            errorMessage={invalid ? errorMsg : undefined}
        >
            <Field
                id={name}
                name={name}
                autoComplete={autoComplete}
                placeholder={placeholder}
                component={PasswordInput}
            />
        </FormItem>
    )
}
