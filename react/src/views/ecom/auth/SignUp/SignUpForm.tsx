import { Form, Formik } from 'formik'
import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import styled from 'styled-components'
import * as Yup from 'yup'

import {
    PasswordField,
    TextField,
    RecaptchaField,
} from '@kozydozy/forms'
import ActionLink from '@kozydozy/shared/ActionLink'
import FormButton from '@/components/shared/FormButton'
import Alert from '@kozydozy/ui/Alert'
import { FormContainer } from '@kozydozy/ui/Form'
import { INTEGRATIONS_CONFIG } from '@/config/integrations.config'
import useAuth from '@/utils/hooks/useAuth'
import { yupFields } from '@/utils/validation/yupValidation'

import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

const RECAPTCHA_SITE_KEY = INTEGRATIONS_CONFIG.google.recaptchaSiteKey

const validationSchema: Yup.ObjectSchema<SignUpFormSchema> = Yup.object({
    firstName: yupFields.firstName,
    lastName: yupFields.lastName,
    email: yupFields.email,
    password: yupFields.newPasswordRequiredStrong,
    confirmPassword: yupFields.confirmPasswordMatches,
}).required()

const Header = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Title = styled.h3`
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
`

const Subtitle = styled.p`
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const AlertWrapper = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const NameGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`

const RecaptchaWrapper = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: center;
`

const FooterRow = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    text-align: center;
`

const SignUpForm = (props: SignUpFormProps) => {
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
    const [recaptchaError, setRecaptchaError] = useState<string>('')
    const [alert, setAlert] = useState<{
        type: 'success' | 'danger'
        text: string
    } | null>(null)

    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const { className, signInUrl = '/sign-in' } = props
    const { signUp } = useAuth()

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (b: boolean) => void,
    ) => {
        if (!recaptchaToken) {
            setRecaptchaError('Please complete the reCAPTCHA.')
            return
        }

        setSubmitting(true)
        setAlert(null)

        const result = await signUp({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            recaptchaToken,
        })

        if (result?.status === 'failed') {
            setAlert({ type: 'danger', text: result.message })
            recaptchaRef.current?.reset()
            setRecaptchaToken(null)
        } else {
            setAlert({ type: 'success', text: result?.message || '' })
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            <Header>
                <Title>Create your account</Title>
                <Subtitle>
                    Book lessons faster and keep your details handy for next
                    time
                </Subtitle>
            </Header>

            {alert && (
                <AlertWrapper>
                    <Alert
                        showIcon
                        closable
                        type={alert.type}
                        duration={0}
                        onClose={() => setAlert(null)}
                    >
                        {alert.text}
                    </Alert>
                </AlertWrapper>
            )}

            <Formik
                validateOnMount
                validateOnChange
                validateOnBlur
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    onSignUp(values, setSubmitting).then(() => {
                        resetForm()
                    })
                }}
            >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form>
                        <FormContainer>
                            <NameGrid>
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
                            </NameGrid>

                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Email"
                            />

                            <PasswordField
                                name="password"
                                label="Password"
                                placeholder="Password"
                            />

                            <PasswordField
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                            />

                            <RecaptchaWrapper>
                                <RecaptchaField
                                    ref={recaptchaRef}
                                    siteKey={RECAPTCHA_SITE_KEY}
                                    error={recaptchaError}
                                    onTokenChange={(token: string | null) => {
                                        setRecaptchaToken(token)
                                        setRecaptchaError('')
                                    }}
                                    onExpired={() => {
                                        setRecaptchaToken(null)
                                        setRecaptchaError(
                                            'reCAPTCHA expired. Please verify again.',
                                        )
                                    }}
                                />
                            </RecaptchaWrapper>

                            <FormButton
                                $block
                                type="submit"
                                disabled={
                                    !dirty ||
                                    !isValid ||
                                    isSubmitting ||
                                    !recaptchaToken
                                }
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Sign Up'}
                            </FormButton>

                            <FooterRow>
                                <span>Already have an account? </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </FooterRow>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
