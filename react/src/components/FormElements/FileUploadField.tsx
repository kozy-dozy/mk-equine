import { Field, FieldProps, getIn, useFormikContext } from 'formik'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import Upload from '@/components/ui/Upload'

const StyledUpload = styled(Upload)`
    cursor: pointer;
`

const StyledPreviewImg = styled.img`
    width: 60px;
    height: 60px;
    border-radius: ${({ theme }) => theme.radius.full};
    border: 2px solid ${({ theme }) => theme.colors.bg.card};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    background: ${({ theme }) => theme.colors.bg.card};
    /* Add dark mode support if needed */
`
const StyledAvatar = styled(Avatar)`
    border: 2px solid ${({ theme }) => theme.colors.bg.card};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    /* Add dark mode support if needed */
`

type Props = {
    /** name for preview value (string URL) */
    name: string
    /** name for the File object */
    fileName: string
    label: string
    uploadLimit?: number
    accept?: string
    className?: string
    fallbackSrc?: string
    renderPreview?: (src: string) => React.ReactNode
}

export default function FileUploadField({
    name,
    fileName,
    label,
    uploadLimit = 1,
    accept,
    className,
    fallbackSrc = '',
    renderPreview,
}: Props) {
    const { touched, errors, setFieldValue, setFieldTouched } =
        useFormikContext<any>()

    const lastObjectUrlRef = useRef<string | null>(null)

    useEffect(() => {
        return () => {
            if (lastObjectUrlRef.current) {
                URL.revokeObjectURL(lastObjectUrlRef.current)
                lastObjectUrlRef.current = null
            }
        }
    }, [])

    const isTouched = Boolean(getIn(touched, fileName) || getIn(touched, name))
    const errorMsg =
        (getIn(errors, fileName) as string | undefined) ||
        (getIn(errors, name) as string | undefined)

    const invalid = Boolean(isTouched && errorMsg)

    const setFile = (file: File | null) => {
        // touch BOTH so Yup errors show consistently
        setFieldTouched(fileName, true, true)
        setFieldTouched(name, true, true)

        // clear previous object URL if any
        if (lastObjectUrlRef.current) {
            URL.revokeObjectURL(lastObjectUrlRef.current)
            lastObjectUrlRef.current = null
        }

        setFieldValue(fileName, file, true)

        if (file) {
            const objectUrl = URL.createObjectURL(file)
            lastObjectUrlRef.current = objectUrl
            setFieldValue(name, objectUrl, true) // preview URL
        } else {
            setFieldValue(name, fallbackSrc, true) // revert to persisted
        }
    }

    return (
        <FormItem
            className={className}
            label={label}
            invalid={invalid}
            errorMessage={invalid ? errorMsg : undefined}
        >
            <Field name={name}>
                {({ field }: FieldProps) => {
                    const src = String(field.value || fallbackSrc || '')

                    return (
                        <StyledUpload
                            showList={false}
                            uploadLimit={uploadLimit}
                            accept={accept}
                            onChange={(files) => setFile(files?.[0] ?? null)}
                            onFileRemove={() => setFile(null)}
                        >
                            {renderPreview ? (
                                renderPreview(src)
                            ) : src ? (
                                <StyledPreviewImg src={src} alt="upload" />
                            ) : (
                                <StyledAvatar size={60} shape="circle" />
                            )}
                        </StyledUpload>
                    )
                }}
            </Field>
        </FormItem>
    )
}
