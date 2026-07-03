import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

import Footer from '@/components/template/Footer'
import Header from '@/components/template/Header'
import HeaderLogo from '@/components/template/HeaderLogo'
import ModeSwitcher from '@/components/template/ThemeConfigurator/ModeSwitcher'
import UserDropdown from '@/components/template/UserDropdown'
import Dialog from '@/components/ui/Dialog'
import { useFeatureFlags } from '@/store/domainHooks'
import { trackEvent } from '@/utils/analytics/googleAnalytics'
import useAuth from '@/utils/hooks/useAuth'
import SignIn from '@/views/ecom/auth/SignIn'
import AnnouncementBar from '@/views/ecom/components/AnnouncementBar'
import EcomMobileNav from '@/views/ecom/components/EcomLayout/EcomMenuContent/EcomMobileNav'
import HorizontalNav from '@/views/ecom/components/EcomLayout/EcomMenuContent/HorizontalNav'

const AppShell = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`

const HeaderStart = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};

    @media (min-width: 1024px) {
        gap: ${({ theme }) => theme.spacing.xl};
    }
`

const DesktopNav = styled.nav`
    display: none;

    @media (min-width: 768px) {
        display: flex;
        align-items: center;
        gap: ${({ theme }) => theme.spacing.xs};
    }
`

const LogoWrap = styled.div`
    @media (max-width: 767px) {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
`

const HeaderEnd = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${({ theme }) => theme.colors.text.inverse};
`

const DarkModeWrap = styled.div`
    display: none;

    @media (min-width: 768px) {
        display: flex;
    }
`

const DesktopUserDropdown = styled.div`
    display: none;

    @media (min-width: 768px) {
        display: flex;
        align-items: center;
    }
`

const NavSignInButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.text.inverse};
    padding: 10px 14px;
    transition: color 0.3s;
    white-space: nowrap;
    display: none;

    @media (min-width: 768px) {
        display: inline-block;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.accentGold};
    }
`

const NavSignUpLink = styled.a`
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.text.inverse};
    padding: 10px 14px;
    transition: color 0.3s;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    display: none;

    @media (min-width: 768px) {
        display: inline-block;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.accentGold};
    }
`

const Main = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 90px;
`

const DialogPad = styled.div`
    padding: ${({ theme }) => theme.spacing.sm};
`

const HeaderActionsStart = () => (
    <HeaderStart>
        <EcomMobileNav />
        <LogoWrap>
            <HeaderLogo />
        </LogoWrap>
        <DesktopNav>
            <HorizontalNav />
        </DesktopNav>
    </HeaderStart>
)

const HeaderActionsEnd = () => {
    const [loginOpen, setLoginOpen] = useState(false)
    const { isAuthenticated } = useAuth()
    const { flags } = useFeatureFlags()

    return (
        <HeaderEnd>
            {isAuthenticated ? (
                <DesktopUserDropdown>
                    <UserDropdown hoverable={false} />
                </DesktopUserDropdown>
            ) : (
                <>
                    <NavSignInButton
                        onClick={() => {
                            trackEvent('login_open', { source: 'header' })
                            setLoginOpen(true)
                        }}
                    >
                        Login
                    </NavSignInButton>

                    <NavSignUpLink href="/sign-up">Sign Up</NavSignUpLink>

                    <Dialog
                        isOpen={loginOpen}
                        width={520}
                        onClose={() => {
                            trackEvent('login_close', { source: 'header' })
                            setLoginOpen(false)
                        }}
                        onRequestClose={() => {
                            trackEvent('login_close', { source: 'header' })
                            setLoginOpen(false)
                        }}
                    >
                        <DialogPad>
                            <SignIn />
                        </DialogPad>
                    </Dialog>
                </>
            )}

            {flags.darkModeEnabled && (
                <DarkModeWrap>
                    <ModeSwitcher />
                </DarkModeWrap>
            )}
        </HeaderEnd>
    )
}

export default function EcomLayout() {
    return (
        <AppShell>
            <AnnouncementBar />
            <Header
                headerStart={<HeaderActionsStart />}
                headerMiddle={null}
                headerEnd={<HeaderActionsEnd />}
            />
            <Main>
                <Outlet />
            </Main>
            <Footer />
        </AppShell>
    )
}
