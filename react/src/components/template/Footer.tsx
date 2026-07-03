import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { COMPANY_CONFIG } from '@/config/company.config'
import { CONTENT_CONFIG } from '@/config/content.config'
import { getLogoUrl } from '@/config/integrations.config'
import navigationConfig from '@/configs/navigation/ecom'

const FooterEl = styled.footer`
    background: #000;
    padding: ${({ theme }) => `${theme.spacing['2xl']} 0 0`};
    color: ${({ theme }) => theme.colors.text.inverse};
`

const Inner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    @media (min-width: 640px) {
        padding: 0 ${({ theme }) => theme.spacing.lg};
    }
`

const Menus = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (max-width: 768px) {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.lg};
    }
`

const Menu = styled.div`
    flex: 1;
`

const LogoImg = styled.img`
    max-width: 100px;
    height: auto;
    display: block;
`

const LogoLink = styled(Link)`
    display: inline-flex;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`
const SocialWrap = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
`

const SocialLabel = styled.span`
    color: ${({ theme }) => theme.colors.primary};
    display: block;
    font-size: ${({ theme }) => theme.fontSize.md};
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const SocialIcons = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`

const SocialLink = styled.a`
    color: ${({ theme }) => theme.colors.text.inverse};
    font-size: ${({ theme }) => theme.fontSize.lg};
    display: inline-flex;
    align-items: center;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`

const ColHeading = styled.h3`
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSize.lg};
    margin: 0 0 ${({ theme }) => theme.spacing.lg};
`

const ColList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`

const ColItem = styled.li`
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ColLink = styled(Link)`
    color: ${({ theme }) => theme.colors.text.inverse};
    text-transform: capitalize;
    font-size: ${({ theme }) => theme.fontSize.base};
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`

const ContactText = styled.p`
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: ${({ theme }) => theme.fontSize.base};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
`

const ContactLink = styled.a`
    color: ${({ theme }) => theme.colors.text.muted};
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.text.inverse};
    }
`

const BottomStrip = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xl};
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: ${({ theme }) => `${theme.spacing.lg} 0`};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.text.inverseMuted};

    @media (min-width: 640px) {
        flex-direction: row;
        justify-content: space-between;
    }
`

const LegalLinks = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
`

const LegalLink = styled(Link)`
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    font-size: 0.8125rem;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.text.inverse};
    }
`

const footerCols = CONTENT_CONFIG.footer.columns

export default function Footer() {
    return (
        <FooterEl>
            <Inner>
                <Menus>
                    {/* Logo + Social */}
                    <Menu>
                        <LogoLink to="/">
                            <LogoImg
                                src={getLogoUrl()}
                                alt={COMPANY_CONFIG.name}
                            />
                        </LogoLink>
                        <SocialWrap>
                            <SocialLabel>Follow us</SocialLabel>
                            <SocialIcons>
                                {COMPANY_CONFIG.social.map(
                                    ({ key, icon: Icon, label, url }) => (
                                        <SocialLink
                                            key={key}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                        >
                                            <Icon />
                                        </SocialLink>
                                    ),
                                )}
                            </SocialIcons>
                        </SocialWrap>
                    </Menu>

                    {/* Nav Links */}
                    <Menu>
                        <ColHeading>Links</ColHeading>
                        <ColList>
                            {navigationConfig.map((nav) => (
                                <ColItem key={nav.key}>
                                    <ColLink to={nav.path}>{nav.title}</ColLink>
                                </ColItem>
                            ))}
                        </ColList>
                    </Menu>

                    {/* Browse + Sports columns */}
                    {footerCols.slice(0, 2).map((col) => (
                        <Menu key={col.title}>
                            <ColHeading>{col.title}</ColHeading>
                            <ColList>
                                {col.links.map((link) => (
                                    <ColItem key={link.label}>
                                        <ColLink to={link.href}>
                                            {link.label}
                                        </ColLink>
                                    </ColItem>
                                ))}
                            </ColList>
                        </Menu>
                    ))}

                    {/* Contact */}
                    <Menu>
                        <ColHeading>Contacts</ColHeading>
                        {COMPANY_CONFIG.contact.email && (
                            <ContactText>
                                <span>✉</span>
                                <ContactLink href={`mailto:${COMPANY_CONFIG.contact.email}`}>
                                    {COMPANY_CONFIG.contact.email}
                                </ContactLink>
                            </ContactText>
                        )}
                        {COMPANY_CONFIG.contact.phone && (
                            <ContactText>
                                <span>☎</span>
                                {COMPANY_CONFIG.contact.phone}
                            </ContactText>
                        )}
                        <ColList style={{ marginTop: 16 }}>
                            {footerCols[2]?.links.map((link) => (
                                <ColItem key={link.label}>
                                    <ColLink to={link.href}>
                                        {link.label}
                                    </ColLink>
                                </ColItem>
                            ))}
                        </ColList>
                    </Menu>
                </Menus>

                <BottomStrip>
                    <span>
                        © {new Date().getFullYear()} {COMPANY_CONFIG.name}. All
                        rights reserved.
                    </span>
                    <LegalLinks>
                        <LegalLink to="/privacy">Privacy Policy</LegalLink>
                        <LegalLink to="/terms">Terms of Service</LegalLink>
                    </LegalLinks>
                </BottomStrip>
            </Inner>
        </FooterEl>
    )
}
