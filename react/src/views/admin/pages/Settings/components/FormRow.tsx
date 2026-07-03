import styled from 'styled-components'
import { FormItem } from '@/components/ui/Form'

import type { FormikTouched, FormikErrors } from 'formik'
import type { PropsWithChildren } from 'react'

type FormRow<T> = PropsWithChildren<{
    label: string
    errors: FormikErrors<T>
    touched: FormikTouched<T>
    name: keyof T
    border?: boolean
    alignCenter?: boolean
}>

const FormRowContainer = styled.div<{
    border: boolean
    alignCenter: boolean
}>`
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => `${theme.spacing.xl} 0`};
    border-bottom: ${({ border, theme }) =>
        border ? `1px solid ${theme.colors.border.default}` : 'none'};
    align-items: ${({ alignCenter }) => (alignCenter ? 'center' : 'start')};
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`

const Label = styled.div`
    font-weight: 600;
`

const Content = styled.div`
    grid-column: span 2;
`

const FormRow = <T extends Record<string, unknown>>(props: FormRow<T>) => {
    const {
        label,
        children,
        errors,
        touched,
        name,
        border = true,
        alignCenter = true,
    } = props

    return (
        <FormRowContainer border={border} alignCenter={alignCenter}>
            <Label>{label}</Label>
            <Content>
                <FormItem
                    invalid={(errors[name] && touched[name]) as boolean}
                    errorMessage={errors[name] as string}
                >
                    {children}
                </FormItem>
            </Content>
        </FormRowContainer>
    )
}

export default FormRow
