import styled from 'styled-components'

import appConfig from '@kozydozy/foundation/config/app.config'
import SignInForm from '@/views/ecom/auth/SignIn/SignInForm'

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

const SignIn = () => {
    return (
        <>
            <Header>
                <Title>Welcome back</Title>
                <Subtitle>
                    Sign in to book lessons and manage your account
                </Subtitle>
            </Header>
            <SignInForm
                signUpUrl={`${signupUrl}`}
                forgotPasswordUrl={`${forgotPasswordUrl}`}
            />
        </>
    )
}

export default SignIn
