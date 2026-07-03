import { Form, Formik, type FormikHelpers } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

import { SelectField, TextField } from '@/components/FormElements'
import TextareaField from '@/components/FormElements/TextareaFIeld'
import FormButton from '@/components/shared/FormButton'
import { apiCreateBooking } from '@/services/ecom/BookingService'
import { yupFields } from '@/utils/validation/yupValidation'

import type { AvailableSlot } from '@shared/dtos'

type Props = {
    selectedSlot: AvailableSlot
    initialName: string
    initialEmail: string
    selectedSlotLabel: string
    onSuccess: () => void
}

export type LessonType = 'private-60' | 'private-30' | 'first-visit'

export type BookingFormValues = {
    consultationType: LessonType
    guestName: string
    guestEmail: string
    guestPhone: string
    notes: string
}

const SelectedSlotBox = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.primaryLight};
    border-radius: ${({ theme }) => theme.radius.md};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ErrorBox = styled.div`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.status.errorBg};
    color: ${({ theme }) => theme.colors.status.error};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`

const SubmitBtn = styled(FormButton)`
    margin-top: ${({ theme }) => theme.spacing.sm};
`

const LESSON_OPTIONS = [
    { value: 'private-60', label: 'Private Lesson · 1 hr ($50)' },
    { value: 'private-30', label: 'Private Lesson · 30 min ($35)' },
    { value: 'first-visit', label: 'First Visit / Meet & Greet' },
]

const validationSchema = Yup.object().shape({
    consultationType: Yup.string()
        .oneOf(['private-60', 'private-30', 'first-visit'])
        .required('Select a lesson type'),
    guestName: Yup.string()
        .trim()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(80, 'Name must be 80 characters or less'),
    guestEmail: yupFields.email,
    guestPhone: yupFields.phone,
    notes: Yup.string()
        .trim()
        .max(2000, 'Notes must be 2000 characters or less')
        .default(''),
})

export default function BookingForm({
    selectedSlot,
    initialName,
    initialEmail,
    selectedSlotLabel,
    onSuccess,
}: Props) {
    const initial = useMemo<BookingFormValues>(
        () => ({
            consultationType: 'private-60',
            guestName: initialName,
            guestEmail: initialEmail,
            guestPhone: '',
            notes: '',
        }),
        [initialName, initialEmail],
    )

    const onSubmit = async (
        values: BookingFormValues,
        helpers: FormikHelpers<BookingFormValues>,
    ) => {
        helpers.setStatus(null)
        try {
            await apiCreateBooking({
                startDateTime: selectedSlot.startDateTime,
                endDateTime: selectedSlot.endDateTime,
                consultationType: values.consultationType,
                guestName: values.guestName.trim(),
                guestEmail: values.guestEmail.trim(),
                guestPhone: values.guestPhone.trim(),
                notes: values.notes.trim(),
            })
            onSuccess()
        } catch (err: any) {
            helpers.setStatus(err?.error || err?.message || 'Booking failed')
        } finally {
            helpers.setSubmitting(false)
        }
    }

    return (
        <Formik<BookingFormValues>
            enableReinitialize
            validateOnMount
            initialValues={initial}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, isValid, status }) => (
                <Form>
                    <SelectedSlotBox>{selectedSlotLabel}</SelectedSlotBox>

                    {status && <ErrorBox>{status}</ErrorBox>}

                    <SelectField
                        name="consultationType"
                        label="Lesson Type"
                        options={LESSON_OPTIONS}
                    />

                    <TextField
                        name="guestName"
                        label="Name *"
                        placeholder="Your full name"
                        autoComplete="name"
                    />

                    <TextField
                        name="guestEmail"
                        label="Email *"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                    />

                    <TextField
                        name="guestPhone"
                        label="Phone (optional)"
                        placeholder="(555) 555-1234"
                        autoComplete="tel"
                        inputMode="tel"
                    />

                    <TextareaField
                        name="notes"
                        label="Anything I should know? (optional)"
                        rows={4}
                        placeholder="Rider's age and experience, goals, or anything you'd like me to know…"
                    />

                    <SubmitBtn
                        $block
                        type="submit"
                        disabled={isSubmitting || !isValid}
                    >
                        {isSubmitting ? 'Booking…' : 'Confirm Booking'}
                    </SubmitBtn>
                </Form>
            )}
        </Formik>
    )
}
