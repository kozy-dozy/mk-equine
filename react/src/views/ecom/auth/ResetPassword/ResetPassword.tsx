import appConfig from '@/configs/app.config'
import ResetPasswordForm from '@/views/ecom/auth/ResetPassword/ResetPasswordForm'

const { unAuthenticatedEntryPath } = appConfig

const ResetPassword = () => {
    return <ResetPasswordForm signInUrl={`${unAuthenticatedEntryPath}`} />
}

export default ResetPassword
