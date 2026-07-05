import styled from 'styled-components'

import appConfig from '@kozydozy/foundation/config/app.config'

import SignInForm from '../SignIn/SignInForm'

const { signupUrl, forgotPasswordUrl } = appConfig

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

const EmailConfirmed = () => {
    return (
        <>
            <Header>
                <Title>Email Confirmed!</Title>
                <Subtitle>Your account is verified. Sign in below.</Subtitle>
            </Header>
            <SignInForm
                signUpUrl={`${signupUrl}`}
                forgotPasswordUrl={`${forgotPasswordUrl}`}
            />
        </>
    )
}

export default EmailConfirmed
