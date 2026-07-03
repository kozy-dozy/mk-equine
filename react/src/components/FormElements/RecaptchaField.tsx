import { forwardRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import styled from 'styled-components'

const RecaptchaFieldWrap = styled.div``

const ErrorText = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.status.error};
`

type Props = {
    siteKey: string
    onTokenChange: (token: string | null) => void
    onExpired?: () => void
    error?: string
    className?: string
}

const RecaptchaField = forwardRef<ReCAPTCHA, Props>(
    ({ siteKey, onTokenChange, onExpired, error, className }, ref) => {
        return (
            <RecaptchaFieldWrap className={className}>
                <ReCAPTCHA
                    ref={ref}
                    sitekey={siteKey}
                    onChange={onTokenChange}
                    onExpired={onExpired}
                />
                {error ? <ErrorText>{error}</ErrorText> : null}
            </RecaptchaFieldWrap>
        )
    },
)

RecaptchaField.displayName = 'RecaptchaField'

export default RecaptchaField
