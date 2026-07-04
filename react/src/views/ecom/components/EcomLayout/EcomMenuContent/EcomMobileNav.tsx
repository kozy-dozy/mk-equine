import { useState, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import NavToggle from '@/components/shared/NavToggle'
import Drawer from '@/components/ui/Drawer'
import { DIR_RTL } from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import useResponsive from '@/utils/hooks/useResponsive'

const EcomMenuContent = lazy(() => import('./EcomMenuContent'))

type MobileNavToggleProps = { toggled?: boolean }

const MobileNavToggle = withHeaderItem<MobileNavToggleProps & WithHeaderItemProps>(NavToggle)

const ToggleWrap = styled.div`
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text.inverse};
`

const DrawerDivider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
    margin: ${({ theme }) => `${theme.spacing.md} 0`};
`

const ProfileSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xxs};
`

const ProfileHeading = styled.div`
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.text.secondary};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`

const DrawerNavLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSize.md};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.radius.md};
    transition: background 0.15s, color 0.15s;

    &:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
        color: ${({ theme }) => theme.colors.primary};
    }
`

export default function EcomMobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    const navMode = useAppSelector((state) => state.theme.navMode)
    const direction = useAppSelector((state) => state.theme.direction)
    const userAuthority = useAppSelector((state) => state.auth.user.authority) ?? []
    const { isAuthenticated } = useAuth()

    const { smaller } = useResponsive()
    const close = () => setIsOpen(false)

    if (!smaller.md) return null

    return (
        <>
            <ToggleWrap onClick={() => setIsOpen(true)}>
                <MobileNavToggle toggled={isOpen} />
            </ToggleWrap>

            <Drawer
                title="Menu"
                isOpen={isOpen}
                width={330}
                placement={direction === DIR_RTL ? 'right' : 'left'}
                onClose={close}
                onRequestClose={close}
            >
                <Suspense fallback={null}>
                    {isOpen && (
                        <>
                            <EcomMenuContent
                                manuVariant={navMode}
                                userAuthority={userAuthority as string[]}
                                layout="stack"
                                onMenuItemClick={close}
                            />

                            <DrawerDivider />

                            <ProfileSection>
                                <ProfileHeading>Account</ProfileHeading>
                                {isAuthenticated ? (
                                    <DrawerNavLink to="/profile" onClick={close}>
                                        My Profile
                                    </DrawerNavLink>
                                ) : (
                                    <>
                                        <DrawerNavLink to="/sign-in" onClick={close}>
                                            Sign In
                                        </DrawerNavLink>
                                        <DrawerNavLink to="/sign-up" onClick={close}>
                                            Sign Up
                                        </DrawerNavLink>
                                    </>
                                )}
                            </ProfileSection>
                        </>
                    )}
                </Suspense>
            </Drawer>
        </>
    )
}
