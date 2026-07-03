import { ProfileValues } from '@shared/dtos'
import { Form, Formik } from 'formik'
import { HiOutlineUser } from 'react-icons/hi'
import styled from 'styled-components'
import * as Yup from 'yup'

import { FileUploadField, TextField } from '@/components/FormElements'
import { Input } from '@/components/ui'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { apiUpdateMe } from '@/services/shared/AccountService'
import { apiGetMemberAvatarUploadUrl } from '@/services/shared/S3Service'
import { setUser, useAppDispatch } from '@/store'
import { useMember } from '@/store/domainHooks'
import { getExtensionFromFile } from '@/utils/fileUpload'
import { yupFields } from '@/utils/validation/yupValidation'

import FormDescription from './FormDescription'

const ProfileGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: 40px;
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`

const MarginTop = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
`

const ProfileAvatar = styled.img`
    height: 64px;
    width: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const ButtonRow = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const profileSchema: Yup.ObjectSchema<ProfileValues> = Yup.object({
    firstName: yupFields.firstName,
    lastName: yupFields.lastName,
    email: yupFields.email,
    avatar: yupFields.avatar,
    avatarFile: yupFields.avatarFile,
})

const Profile = () => {
    const { member } = useMember()
    const dispatch = useAppDispatch()

    if (!member) return null

    const initialValues: ProfileValues = {
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        avatar: member.avatar || '',
        avatarFile: null,
    }

    const onFormSubmit = async (
        values: ProfileValues,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: (nextState?: { values: ProfileValues }) => void,
    ) => {
        try {
            let avatarUrl = member.avatar || ''

            if (values.avatarFile) {
                const file = values.avatarFile

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
                    setSubmitting(false)
                    return
                }

                const ext = getExtensionFromFile(file)
                const desiredFileName = `${member.id}-avatar.${ext}`

                const presignRes = await apiGetMemberAvatarUploadUrl({
                    fileType: file.type,
                    desiredFileName,
                })

                const presign = ((presignRes as unknown as { data: unknown })
                    .data ?? presignRes) as {
                    uploadUrl: string
                    fileUrl: string
                }

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

            const updatedRes = await apiUpdateMe({
                firstName: values.firstName,
                lastName: values.lastName,
                avatar: avatarUrl,
            })

            const updated = ((updatedRes as unknown as { data: unknown })
                .data ?? updatedRes) as {
                member?: typeof member
            }
            const updatedMember = updated.member ?? updated

            dispatch(setUser(updatedMember as typeof member))

            toast.push(
                <Notification title="Profile updated" type="success" />,
                { placement: 'top-center' },
            )

            resetForm({
                values: {
                    ...values,
                    avatar: avatarUrl,
                    avatarFile: null,
                },
            })
        } catch (e: unknown) {
            console.error('[Profile] update failed:', e)
            toast.push(<Notification title="Update failed" type="danger" />, {
                placement: 'top-center',
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik<ProfileValues>
            enableReinitialize
            validateOnMount
            validateOnChange
            validateOnBlur
            initialValues={initialValues}
            validationSchema={profileSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true)
                onFormSubmit(values, setSubmitting, resetForm)
            }}
        >
            {({ isSubmitting, isValid, dirty, resetForm }) => (
                <Form>
                    <FormContainer>
                        <FormDescription
                            title="General"
                            desc="Basic info, like your name and address that will displayed in public"
                        />

                        <ProfileGrid>
                            <TextField
                                name="firstName"
                                label="First Name"
                                placeholder="First Name"
                            />
                            <TextField
                                name="lastName"
                                label="Last Name"
                                placeholder="Last Name"
                            />
                        </ProfileGrid>

                        <MarginTop>
                            <FormItem label="Email">
                                <Input
                                    disabled
                                    name="profile.email"
                                    value={member?.email || ''}
                                    placeholder="Email"
                                />
                            </FormItem>
                        </MarginTop>

                        <MarginTop>
                            <FileUploadField
                                name="avatar"
                                fileName="avatarFile"
                                label="Avatar"
                                accept="image/png,image/jpeg"
                                fallbackSrc={member.avatar || ''}
                                renderPreview={(src) =>
                                    src ? (
                                        <ProfileAvatar src={src} alt="avatar" />
                                    ) : (
                                        <Avatar
                                            style={{
                                                border: '2px solid #fff',
                                                boxShadow:
                                                    '0 2px 8px rgba(0,0,0,0.08)',
                                            }}
                                            size={64}
                                            shape="circle"
                                            icon={<HiOutlineUser />}
                                        />
                                    )
                                }
                            />
                        </MarginTop>

                        <ButtonRow>
                            <Button
                                style={{ marginRight: 8 }}
                                type="button"
                                onClick={() => resetForm()}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="solid"
                                loading={isSubmitting}
                                type="submit"
                                disabled={!isValid || !dirty || isSubmitting}
                            >
                                {isSubmitting ? 'Updating' : 'Update'}
                            </Button>
                        </ButtonRow>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default Profile
