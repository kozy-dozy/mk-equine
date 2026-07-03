import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { COMPANY_CONFIG } from '@/config/company.config'
import { getLogoDarkUrl, getLogoLightUrl } from '@/config/integrations.config'

import { bp } from './primitives'

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Lessons', to: '/lessons' },
    { label: 'Training & Sales', to: '/horses' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
]

export const NAV_HEIGHT = 76

/* --------------------------------------------------------------- styles */

const Bar = styled.header<{ $solid: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: ${NAV_HEIGHT}px;
    display: flex;
    align-items: center;
    transition:
        background-color 0.3s ease,
        box-shadow 0.3s ease,
        border-color 0.3s ease;

    border-bottom: 1px solid
        ${({ theme, $solid }) =>
            $solid ? theme.colors.border.default : 'transparent'};
    background: ${({ theme, $solid }) =>
        $solid ? theme.colors.bg.page : 'transparent'};
    box-shadow: ${({ $solid }) =>
        $solid ? '0 6px 24px rgba(40, 28, 18, 0.06)' : 'none'};
`

const Inner = styled.div`
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.lg};

    @media (min-width: ${bp.tablet}) {
        padding: 0 ${({ theme }) => theme.spacing.xl};
    }
`

const Brand = styled(Link)<{ $solid: boolean }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme, $solid }) =>
        $solid ? theme.colors.text.dark : theme.colors.text.inverse};

    svg {
        color: ${({ theme }) => theme.colors.accentGold};
        flex-shrink: 0;
    }
`

const LogoImg = styled.img`
    height: 56px;
    width: auto;
    display: block;
    flex-shrink: 0;

    @media (min-width: ${bp.tablet}) {
        height: 65px;
    }
`

/* Wordmark version — kept in case we revert from the image logo:
const BrandText = styled.span`
    display: flex;
    flex-direction: column;
    line-height: 1;

    strong {
        font-family: ${({ theme }) => theme.typography.fontPrimary};
        font-size: 1.3rem;
        font-weight: 600;
        letter-spacing: 0.01em;
    }

    small {
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        font-size: 0.6rem;
        font-weight: 600;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        margin-top: 4px;
        opacity: 0.85;
    }
`
*/

const linkColor = css<{ $solid: boolean }>`
    color: ${({ theme, $solid }) =>
        $solid ? theme.colors.text.primary : theme.colors.text.inverse};
`

const DesktopLinks = styled.nav`
    display: none;

    @media (min-width: ${bp.desktop}) {
        display: flex;
        align-items: center;
        gap: ${({ theme }) => theme.spacing.lg};
    }

    @media (min-width: ${bp.large}) {
        gap: ${({ theme }) => theme.spacing.xl};
    }
`

const NavItem = styled(NavLink)<{ $solid: boolean }>`
    ${linkColor};
    position: relative;
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.95rem;
    font-weight: 500;
    padding: 6px 0;
    transition: color 0.2s ease;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 2px;
        width: 0;
        background: ${({ theme }) => theme.colors.accentGold};
        transition: width 0.25s ease;
    }

    &:hover::after,
    &.active::after {
        width: 100%;
    }

    &.active {
        color: ${({ theme }) => theme.colors.accentGold};
    }
`

const End = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`

const CTA = styled(Link)`
    display: none;

    @media (min-width: ${bp.tablet}) {
        display: inline-flex;
        align-items: center;
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        font-size: 0.9rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.inverse};
        background: ${({ theme }) => theme.colors.accentGold};
        padding: 11px 24px;
        border-radius: ${({ theme }) => theme.radius.full};
        box-shadow: 0 8px 20px rgba(165, 91, 58, 0.28);
        transition:
            background-color 0.2s ease,
            transform 0.18s ease;

        &:hover {
            background: ${({ theme }) => theme.colors.primaryHover};
            transform: translateY(-2px);
        }
    }
`

const Burger = styled.button<{ $solid: boolean }>`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    span {
        display: block;
        width: 24px;
        height: 2px;
        border-radius: 2px;
        background: ${({ theme, $solid }) =>
            $solid ? theme.colors.text.dark : theme.colors.text.inverse};
        transition: background 0.3s ease;
    }

    @media (min-width: ${bp.desktop}) {
        display: none;
    }
`

/* ------------------------------------------------------------ mobile menu */

const MobilePanel = styled.div<{ $open: boolean }>`
    position: fixed;
    inset: ${NAV_HEIGHT}px 0 0 0;
    z-index: 99;
    background: ${({ theme }) => theme.colors.bg.page};
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transition:
        transform 0.3s ease,
        opacity 0.3s ease,
        visibility 0.3s ease;

    @media (min-width: ${bp.desktop}) {
        display: none;
    }
`

const MobileLink = styled(NavLink)`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text.dark};
    padding: ${({ theme }) => theme.spacing.md} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

    &.active {
        color: ${({ theme }) => theme.colors.accentGold};
    }
`

const MobileCta = styled(Link)`
    margin-top: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ theme }) => theme.colors.accentGold};
    padding: 16px;
    border-radius: ${({ theme }) => theme.radius.full};
`

/* Wordmark version — kept in case we revert from the image logo:
function HorseshoeMark() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M7 3.2C4.4 4.9 2.7 7.8 2.7 11.1c0 3.8 2.8 6.9 6.4 7.3V15a2.9 2.9 0 1 1 5.8 0v3.4c3.6-.4 6.4-3.5 6.4-7.3 0-3.3-1.7-6.2-4.3-7.9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
            <circle cx="7" cy="3.2" r="1.2" fill="currentColor" />
            <circle cx="17" cy="3.2" r="1.2" fill="currentColor" />
        </svg>
    )
}
*/

/* ---------------------------------------------------------------- export */

export default function MarketingNav({ forceSolid = false }: { forceSolid?: boolean }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const solid = forceSolid || scrolled || menuOpen

    return (
        <>
            <Bar $solid={solid}>
                <Inner>
                    <Brand to="/" $solid={solid} aria-label={`${COMPANY_CONFIG.name} home`}>
                        {/* Wordmark version — kept in case we revert from the image logo:
                        <HorseshoeMark />
                        <BrandText>
                            <strong>{COMPANY_CONFIG.name}</strong>
                            <small>Riding Lessons</small>
                        </BrandText>
                        */}
                        <LogoImg
                            src={solid ? getLogoDarkUrl() : getLogoLightUrl()}
                            alt={COMPANY_CONFIG.name}
                        />
                    </Brand>

                    <DesktopLinks aria-label="Primary">
                        {NAV_LINKS.map((l) => (
                            <NavItem key={l.label} to={l.to} end={l.to === '/'} $solid={solid}>
                                {l.label}
                            </NavItem>
                        ))}
                    </DesktopLinks>

                    <End>
                        <CTA to="/book-lesson">Book now!</CTA>
                        <Burger
                            $solid={solid}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((o) => !o)}
                        >
                            <span />
                            <span />
                            <span />
                        </Burger>
                    </End>
                </Inner>
            </Bar>

            <MobilePanel $open={menuOpen} role="dialog" aria-label="Mobile menu">
                {NAV_LINKS.map((l) => (
                    <MobileLink
                        key={l.label}
                        to={l.to}
                        end={l.to === '/'}
                        onClick={() => setMenuOpen(false)}
                    >
                        {l.label}
                    </MobileLink>
                ))}
                <MobileCta to="/book-lesson" onClick={() => setMenuOpen(false)}>
                    Book now!
                </MobileCta>
            </MobilePanel>
        </>
    )
}
