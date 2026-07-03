import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { COMPANY_CONFIG } from '@/config/company.config'
import { CONTENT_CONFIG } from '@/config/content.config'
import { getLogoLightUrl } from '@/config/integrations.config'

import { bp } from './primitives'

const Wrap = styled.footer`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
`

const Inner = styled.div`
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing.lg}`};

    @media (min-width: ${bp.tablet}) {
        padding: 72px ${({ theme }) => theme.spacing.xl} 40px;
    }
`

const Top = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: 1.6fr 1fr 1fr 1fr;
        gap: ${({ theme }) => theme.spacing.xl};
    }
`

const Brand = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    max-width: 320px;
`

const BrandRow = styled(Link)`
    display: inline-flex;
    align-items: center;
`

const FooterLogo = styled.img`
    height: 72px;
    width: auto;
    display: block;
`

const Tagline = styled.p`
    font-size: 0.95rem;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    margin: 0;
`

const Social = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.xs};
`

const SocialLink = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: ${({ theme }) => theme.colors.text.inverse};
    font-size: 1.05rem;
    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.18s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.accentGold};
        border-color: ${({ theme }) => theme.colors.accentGold};
        transform: translateY(-2px);
    }
`

const Col = styled.nav`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`

const ColTitle = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentGold};
    margin: 0;
`

const FooterLink = styled(Link)`
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text.inverse};
    }
`

const ContactLine = styled.a`
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text.inverse};
    }
`

const Bottom = styled.div`
    margin-top: ${({ theme }) => theme.spacing['2xl']};
    padding-top: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
    text-align: center;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.text.inverseMuted};

    @media (min-width: ${bp.tablet}) {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
    }
`

export default function MarketingFooter() {
    const year = new Date().getFullYear()

    return (
        <Wrap>
            <Inner>
                <Top>
                    <Brand>
                        <BrandRow to="/" aria-label={`${COMPANY_CONFIG.name} home`}>
                            <FooterLogo
                                src={getLogoLightUrl()}
                                alt={COMPANY_CONFIG.name}
                            />
                        </BrandRow>
                        <Tagline>{COMPANY_CONFIG.tagline}</Tagline>
                        <Social>
                            {COMPANY_CONFIG.social.map((s) => {
                                const Icon = s.icon
                                return (
                                    <SocialLink
                                        key={s.key}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                    >
                                        <Icon />
                                    </SocialLink>
                                )
                            })}
                        </Social>
                    </Brand>

                    {CONTENT_CONFIG.footer.columns.map((col) => (
                        <Col key={col.title} aria-label={col.title}>
                            <ColTitle>{col.title}</ColTitle>
                            {col.links.map((link) => (
                                <FooterLink key={link.label} to={link.href}>
                                    {link.label}
                                </FooterLink>
                            ))}
                        </Col>
                    ))}

                    <Col aria-label="Contact">
                        <ColTitle>Get In Touch</ColTitle>
                        <ContactLine href={`mailto:${COMPANY_CONFIG.contact.email}`}>
                            {COMPANY_CONFIG.contact.email}
                        </ContactLine>
                        <FooterLink to="/book-lesson">Book a Lesson</FooterLink>
                        <Tagline as="span" style={{ fontSize: '0.85rem' }}>
                            By appointment · Limited spots
                        </Tagline>
                    </Col>
                </Top>

                <Bottom>
                    <span>
                        © {year} {COMPANY_CONFIG.name}. All rights reserved.
                    </span>
                    <span>Built with care for riders of every age.</span>
                </Bottom>
            </Inner>
        </Wrap>
    )
}
