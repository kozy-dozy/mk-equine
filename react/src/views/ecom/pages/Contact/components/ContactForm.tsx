import { Form, Formik, type FormikHelpers } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

import { TextField } from '@kozydozy/forms'
import TextareaField from '@kozydozy/forms/TextareaFIeld'
import FormButton from '@/components/shared/FormButton'
import { apiSubmitContact } from '@/services/shared/ContactService'
import { trackEvent } from '@/utils/analytics/googleAnalytics'
import { yupFields } from '@/utils/validation/yupValidation'

export type ContactFormValues = {
    name: string
    email: string
    message: string
}

type ContactFormProps = {
    isLoggedIn: boolean
    derivedName: string
    derivedEmail: string
}

/* ── Form grid ── */

const FormGrid = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};

    @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
    }
`

const FullSpan = styled.div`
    @media (min-width: 640px) {
        grid-column: span 2;
    }
`

/* ── Status banners ── */

const ErrorBanner = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.status.errorBg};
    background: ${({ theme }) => theme.colors.status.errorBg};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.status.error};
`

const SuccessBanner = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.status.successBg};
    background: ${({ theme }) => theme.colors.status.successBg};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.status.success};
`

/* ── Footer row ── */

const FooterRow = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};

    @media (min-width: 640px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`

const FooterNote = styled.div`
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
`

export default function ContactForm({
    isLoggedIn,
    derivedName,
    derivedEmail,
}: ContactFormProps) {
    const [status, setStatus] = useState<{
        kind: 'idle' | 'ok' | 'err'
        msg?: string
    }>({ kind: 'idle' })

    const initialValues = useMemo<ContactFormValues>(
        () => ({
            name: isLoggedIn ? derivedName : '',
            email: isLoggedIn ? derivedEmail : '',
            message: '',
        }),
        [isLoggedIn, derivedName, derivedEmail],
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                name: Yup.string()
                    .trim()
                    .required('Name is required')
                    .min(2, 'Name must be at least 2 characters'),
                email: yupFields.email,
                message: yupFields.message,
            }),
        [],
    )

    const submitContact = useCallback(
        async (
            values: ContactFormValues,
            helpers: FormikHelpers<ContactFormValues>,
        ) => {
            setStatus({ kind: 'idle' })

            const payload = {
                name: values.name.trim(),
                email: values.email.trim(),
                message: values.message.trim(),
            }

            trackEvent('contact_submit', {
                loggedIn: isLoggedIn,
                messageLength: payload.message.length,
            })

            try {
                await apiSubmitContact(payload)

                trackEvent('contact_submit_success', { loggedIn: isLoggedIn })

                setStatus({
                    kind: 'ok',
                    msg: "Message sent! We'll reply within 1 business day.",
                })

                helpers.setFieldValue('message', '', false)

                if (!isLoggedIn) {
                    helpers.setFieldValue('name', '', false)
                    helpers.setFieldValue('email', '', false)
                }
            } catch (e: any) {
                trackEvent('contact_submit_failed', {
                    loggedIn: isLoggedIn,
                    reason: e?.response?.data?.error || e?.message || 'unknown',
                })

                setStatus({
                    kind: 'err',
                    msg:
                        e?.response?.data?.error ??
                        'Failed to send. Please try again.',
                })
            } finally {
                helpers.setSubmitting(false)
            }
        },
        [isLoggedIn],
    )

    return (
        <Formik<ContactFormValues>
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitContact}
        >
            {({ isSubmitting }) => (
                <Form>
                    <FormGrid>
                        <TextField
                            name="name"
                            label="Name"
                            placeholder="Your name"
                            disabled={isLoggedIn}
                            value={isLoggedIn ? derivedName : undefined}
                        />

                        <TextField
                            name="email"
                            label="Email"
                            placeholder="you@example.com"
                            disabled={isLoggedIn}
                            value={isLoggedIn ? derivedEmail : undefined}
                        />

                        <FullSpan>
                            <TextareaField
                                name="message"
                                label="Message"
                                placeholder="How can we help?"
                                rows={6}
                            />
                        </FullSpan>
                    </FormGrid>

                    {status.kind === 'err' ? (
                        <ErrorBanner>{status.msg}</ErrorBanner>
                    ) : null}

                    {status.kind === 'ok' ? (
                        <SuccessBanner>{status.msg}</SuccessBanner>
                    ) : null}

                    <FooterRow>
                        <FooterNote>
                            We&apos;ll respond within 1 business day.
                        </FooterNote>

                        <FormButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending…' : 'Send Message'}
                        </FormButton>
                    </FooterRow>
                </Form>
            )}
        </Formik>
    )
}
