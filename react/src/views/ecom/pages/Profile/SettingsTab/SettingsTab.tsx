import { ProfileValues } from '@shared/dtos'
import { Form, Formik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { HiOutlineUser } from 'react-icons/hi'
import styled from 'styled-components'
import * as Yup from 'yup'

import {
    FileUploadField,
    PasswordField,
    TextField,
} from '@kozydozy/forms'
import { Avatar, Card } from '@kozydozy/ui'
import Button from '@kozydozy/ui/Button'
import { FormContainer } from '@kozydozy/ui/Form'
import Notification from '@kozydozy/ui/Notification'
import toast from '@kozydozy/ui/toast'
import { apiUpdateMyPassword } from '@/services/shared/AccountService'
import { apiGetMemberAvatarUploadUrl } from '@/services/shared/S3Service'
import { setUser, useAppDispatch } from '@/store'
import { useMember } from '@/store/domainHooks'
import { trackEvent } from '@/utils/analytics/googleAnalytics'
import { getExtensionFromFile } from '@/utils/fileUpload'
import { yupFields } from '@/utils/validation/yupValidation'


type SettingsFormValues = {
    profile: ProfileValues
}

type PasswordFormModel = {
    password: string
    newPassword: string
    confirmNewPassword: string
}


const profileSchema: Yup.ObjectSchema<SettingsFormValues> = Yup.object({
    profile: Yup.object({
        firstName: yupFields.firstName,
        lastName: yupFields.lastName,
        email: yupFields.email,
        avatar: yupFields.avatar,
        avatarFile: yupFields.avatarFile,
    }).required(),
}).required()

const passwordSchema: Yup.ObjectSchema<PasswordFormModel> = Yup.object({
    password: yupFields.passwordRequired,
    newPassword: yupFields.newPasswordRequiredStrong,
    confirmNewPassword: yupFields.confirmNewPasswordMatches,
}).required()

function buildInitial(member?: any): SettingsFormValues {
    return {
        profile: {
            firstName: member?.firstName ?? '',
            lastName: member?.lastName ?? '',
            email: member?.email ?? '',
            avatar: member?.avatar ?? '',
            avatarFile: null,
        },
    }
}

/* ── Styled components ── */

const PageStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`

const LoadingText = styled.div`
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const ErrorBanner = styled.div`
    border-radius: ${({ theme }) => theme.radius.xl};
    border: 1px solid rgba(239, 68, 68, 0.3);
    background: rgba(254, 242, 242, 1);
    padding: 0.75rem;
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.status.error};
`

const StyledCard = styled(Card)`
    border-radius: ${({ theme }) => theme.radius.xl};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    background: ${({ theme }) => theme.colors.bg.card};
`

const CardSubtitle = styled.div`
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const FieldGrid = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    display: grid;
    gap: 0.75rem;

    @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
    }
`

const FullSpan = styled.div`
    @media (min-width: 640px) {
        grid-column: span 2;
    }
`

const AvatarPreview = styled.img`
    height: 4rem;
    width: 4rem;
    border-radius: ${({ theme }) => theme.radius.full};
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.bg.card};
    box-shadow: ${({ theme }) => theme.shadow.lg};
`

const StyledAvatar = styled(Avatar)`
    border: 2px solid ${({ theme }) => theme.colors.bg.card};
    box-shadow: ${({ theme }) => theme.shadow.lg};
`

const ActionRow = styled.div`
    margin-top: 1.25rem;
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`

export default function AccountSettingsPage() {
    const { member, loading, error, updateMember } = useMember()
    const [serverError, setServerError] = useState('')
    const dispatch = useAppDispatch()

    const initialValues = useMemo(() => buildInitial(member), [member])

    const toastSaved = useCallback(() => {
        toast.push(
            <Notification title="Saved" type="success" duration={2500}>
                Your settings were updated.
            </Notification>,
            { placement: 'top-center' },
        )
    }, [])

    const toastSaveFailed = useCallback((msg: string) => {
        toast.push(
            <Notification title="Save failed" type="danger" duration={3000}>
                {msg}
            </Notification>,
            { placement: 'top-center' },
        )
    }, [])

    const handleProfileSubmit = useCallback(
        async (
            values: SettingsFormValues,
            helpers: {
                setSubmitting: (b: boolean) => void
                resetForm: (a: any) => void
            },
        ) => {
            const { setSubmitting, resetForm } = helpers

            setSubmitting(true)
            setServerError('')
            trackEvent('account_settings_save_submit')

            try {
                let avatarUrl = member?.avatar ?? ''

                if (values.profile.avatarFile) {
                    const file = values.profile.avatarFile

                    if (!['image/jpeg', 'image/png'].includes(file.type)) {
                        toast.push(
                            <Notification
                                title="Invalid file type"
                                type="danger"
                                duration={3000}
                            >
                                Please upload a PNG or JPEG.
                            </Notification>,
                            { placement: 'top-center' },
                        )
                        return
                    }

                    const ext = getExtensionFromFile(file)
                    const desiredFileName = `${member?.id}-avatar.${ext}`

                    const presignRes = await apiGetMemberAvatarUploadUrl({
                        fileType: file.type,
                        desiredFileName,
                    })

                    const presign: any = (presignRes as any).data ?? presignRes

                    const putRes = await fetch(presign.uploadUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': file.type },
                        body: file,
                    })

                    if (!putRes.ok) {
                        const txt = await putRes.text()
                        console.error('S3 PUT failed:', putRes.status, txt)
                        throw new Error(`S3 upload failed (${putRes.status})`)
                    }

                    avatarUrl = presign.fileUrl
                }

                const updated = await updateMember({
                    firstName: values.profile.firstName.trim(),
                    lastName: values.profile.lastName.trim(),
                    avatar: avatarUrl,
                } as any)

                const updatedMember = (updated as any).member ?? updated
                dispatch(setUser(updatedMember))

                resetForm({ values: buildInitial(updatedMember) })
                toastSaved()
                trackEvent('account_settings_save_success')
            } catch (e: any) {
                const msg = e?.error || e?.message || 'Failed to save settings.'
                setServerError(msg)
                toastSaveFailed(msg)
                trackEvent('account_settings_save_failed', { reason: msg })
            } finally {
                setSubmitting(false)
            }
        },
        [updateMember, toastSaved, toastSaveFailed, dispatch, member],
    )

    const handlePasswordSubmit = useCallback(
        async (
            values: PasswordFormModel,
            helpers: {
                setSubmitting: (b: boolean) => void
                resetForm: () => void
            },
        ) => {
            const { setSubmitting, resetForm } = helpers

            setSubmitting(true)
            setServerError('')
            trackEvent('account_password_update_submit')

            try {
                await apiUpdateMyPassword({
                    password: values.password,
                    newPassword: values.newPassword,
                })

                toast.push(
                    <Notification
                        title="Password updated"
                        type="success"
                        duration={2500}
                    >
                        Your password was changed successfully.
                    </Notification>,
                    { placement: 'top-center' },
                )

                trackEvent('account_password_update_success')
                resetForm()
            } catch (e: any) {
                const msg =
                    e?.error || e?.message || 'Failed to update password.'
                setServerError(msg)

                toast.push(
                    <Notification
                        title="Update failed"
                        type="danger"
                        duration={3000}
                    >
                        {msg}
                    </Notification>,
                    { placement: 'top-center' },
                )

                trackEvent('account_password_update_failed', { reason: msg })
            } finally {
                setSubmitting(false)
            }
        },
        [],
    )

    // const onSignOutAllDevices = useCallback(() => {
    //     trackEvent('account_signout_all_devices_click')
    //     toast.push(
    //         <Notification title="Not wired yet" type="warning" duration={2500}>
    //             Hook this to your sign-out-all endpoint when you add it.
    //         </Notification>,
    //         { placement: 'top-center' },
    //     )
    // }, [])

    if (loading) return <LoadingText>Loading settings...</LoadingText>

    return (
        <PageStack>
            {error ? <ErrorBanner>{error}</ErrorBanner> : null}

            {serverError ? <ErrorBanner>{serverError}</ErrorBanner> : null}

            {/* Profile Form */}
            <Formik
                enableReinitialize
                validateOnBlur
                validateOnChange
                initialValues={initialValues}
                validationSchema={profileSchema}
                onSubmit={(values, { setSubmitting, resetForm }) =>
                    handleProfileSubmit(values, { setSubmitting, resetForm })
                }
            >
                {({ isSubmitting, resetForm }) => {
                    const onCancelProfile = () => {
                        trackEvent('account_settings_cancel')
                        resetForm()
                        setServerError('')
                    }

                    return (
                        <Form>
                            <FormContainer>
                                <StyledCard>
                                    <CardSubtitle>
                                        Update your account details.
                                    </CardSubtitle>

                                    <FieldGrid>
                                        <TextField
                                            name="profile.firstName"
                                            label="First name"
                                            placeholder="First name"
                                        />

                                        <TextField
                                            name="profile.lastName"
                                            label="Last name"
                                            placeholder="Last name"
                                        />

                                        <TextField
                                            disabled
                                            name="profile.email"
                                            label="Email"
                                            value={member?.email || ''}
                                            placeholder="Email"
                                        />

                                        <FullSpan>
                                            <FileUploadField
                                                name="profile.avatar"
                                                fileName="profile.avatarFile"
                                                label="Avatar"
                                                accept="image/png,image/jpeg"
                                                fallbackSrc={
                                                    member?.avatar ?? ''
                                                }
                                                renderPreview={(src) =>
                                                    src ? (
                                                        <AvatarPreview
                                                            src={src}
                                                            alt="avatar"
                                                        />
                                                    ) : (
                                                        <StyledAvatar
                                                            size={64}
                                                            shape="circle"
                                                            icon={
                                                                <HiOutlineUser />
                                                            }
                                                        />
                                                    )
                                                }
                                            />
                                        </FullSpan>
                                    </FieldGrid>

                                    <ActionRow>
                                        <Button
                                            variant="solid"
                                            color="zinc-900"
                                            loading={isSubmitting}
                                            type="submit"
                                        >
                                            Save changes
                                        </Button>

                                        <Button
                                            variant="twoTone"
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={onCancelProfile}
                                        >
                                            Cancel
                                        </Button>
                                    </ActionRow>
                                </StyledCard>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>

            {/* Password Form */}
            <Formik<PasswordFormModel>
                validateOnMount
                validateOnChange
                validateOnBlur
                initialValues={{
                    password: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={passwordSchema}
                onSubmit={(values, { setSubmitting, resetForm }) =>
                    handlePasswordSubmit(values, { setSubmitting, resetForm })
                }
            >
                {({ isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <StyledCard>
                                <CardSubtitle>
                                    Manage password and sessions.
                                </CardSubtitle>

                                <FieldGrid>
                                    <PasswordField
                                        name="password"
                                        label="Current password"
                                        placeholder="••••••••"
                                    />

                                    <PasswordField
                                        name="newPassword"
                                        label="New password"
                                        placeholder="••••••••"
                                    />

                                    <PasswordField
                                        name="confirmNewPassword"
                                        label="Confirm new password"
                                        placeholder="••••••••"
                                    />
                                </FieldGrid>

                                <ActionRow>
                                    <Button
                                        variant="solid"
                                        color="zinc-900"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Updating'
                                            : 'Update password'}
                                    </Button>

                                    {/* <Button
                                        variant="twoTone"
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={onSignOutAllDevices}
                                    >
                                        Sign out of all devices
                                    </Button> */}
                                </ActionRow>
                            </StyledCard>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </PageStack>
    )
}
