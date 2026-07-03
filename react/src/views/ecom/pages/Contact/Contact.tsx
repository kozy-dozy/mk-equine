import { useMemo } from 'react'
import styled from 'styled-components'

import { COMPANY_CONFIG } from '@/config/company.config'
import { SITE_IMAGES } from '@/config/site-images'
import { useMember } from '@/store/domainHooks'
import useAuth from '@/utils/hooks/useAuth'
import SEO from '@/views/ecom/components/SEO'
import {
    bp,
    Container,
    PageHero,
    Section,
} from '@/views/ecom/components/marketing/primitives'

import ContactForm from './components/ContactForm'

function formatFullName(first?: string, last?: string) {
    return [String(first ?? '').trim(), String(last ?? '').trim()]
        .filter(Boolean)
        .join(' ')
        .trim()
}

const Layout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: 1.5fr 1fr;
        gap: 64px;
        align-items: start;
    }
`

const Card = styled.div`
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: 0 12px 32px rgba(40, 28, 18, 0.06);

    @media (min-width: ${bp.tablet}) {
        padding: ${({ theme }) => theme.spacing['2xl']};
    }
`

const CardTitle = styled.h2`
    font-size: 1.65rem;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
`

const CardLead = styled.p`
    font-size: 0.98rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

/* ── Info panel ── */

const Panel = styled.aside`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`

const InfoItem = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: flex-start;
`

const InfoIcon = styled.span`
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.accentGold};

    svg {
        width: 22px;
        height: 22px;
    }
`

const InfoBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        font-size: 0.95rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.dark};
    }

    a,
    span {
        font-size: 0.95rem;
        color: ${({ theme }) => theme.colors.text.secondary};
        transition: color 0.2s ease;
    }

    a:hover {
        color: ${({ theme }) => theme.colors.accentGold};
    }
`

const PanelCard = styled.div`
    background: ${({ theme }) => theme.colors.bg.muted};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`

const SocialRow = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`

const SocialLink = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.primary};
    transition:
        background 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        transform 0.18s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.accentGold};
        border-color: ${({ theme }) => theme.colors.accentGold};
        color: ${({ theme }) => theme.colors.text.inverse};
        transform: translateY(-2px);
    }
`

const PanelNote = styled.p`
    font-size: 0.9rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

const mailIcon = (
    <svg viewBox="0 0 24 24" fill="none">
        <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M4 7l8 6 8-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const clockIcon = (
    <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path
            d="M12 7v5l3 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const calendarIcon = (
    <svg viewBox="0 0 24 24" fill="none">
        <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M3 9h18M8 3v4M16 3v4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
        />
    </svg>
)

export default function ContactPage() {
    const { isAuthenticated } = useAuth()
    const { member } = useMember()
    const isLoggedIn = Boolean(isAuthenticated && member)

    const derivedName = useMemo(
        () =>
            isLoggedIn
                ? formatFullName(member?.firstName, member?.lastName)
                : '',
        [isLoggedIn, member?.firstName, member?.lastName],
    )

    const derivedEmail = useMemo(
        () => (isLoggedIn ? String(member?.email ?? '').trim() : ''),
        [isLoggedIn, member?.email],
    )

    return (
        <>
            <SEO
                title="Contact"
                description={`Questions about lessons or want to book? Reach ${COMPANY_CONFIG.name} here.`}
                canonicalPath="/contact"
            />

            <PageHero
                eyebrow="Get In Touch"
                title="Let's Find Your Saddle Time"
                lead="Have a question or ready to book your first lesson? Send a message and I'll get back to you—usually within a day."
                image={SITE_IMAGES.gallery[3]}
            />

            <Section>
                <Container>
                    <Layout>
                        <Card>
                            <CardTitle>Send a Message</CardTitle>
                            <CardLead>
                                Tell me a little about you or your rider, and what
                                you're hoping to learn. Spots are limited, so don't
                                wait too long!
                            </CardLead>
                            <ContactForm
                                isLoggedIn={isLoggedIn}
                                derivedName={derivedName}
                                derivedEmail={derivedEmail}
                            />
                        </Card>

                        <Panel>
                            <InfoItem>
                                <InfoIcon aria-hidden="true">{mailIcon}</InfoIcon>
                                <InfoBody>
                                    <strong>Email</strong>
                                    <a href={`mailto:${COMPANY_CONFIG.contact.email}`}>
                                        {COMPANY_CONFIG.contact.email}
                                    </a>
                                </InfoBody>
                            </InfoItem>

                            <InfoItem>
                                <InfoIcon aria-hidden="true">{clockIcon}</InfoIcon>
                                <InfoBody>
                                    <strong>Response Time</strong>
                                    <span>Usually within 1 business day</span>
                                </InfoBody>
                            </InfoItem>

                            <InfoItem>
                                <InfoIcon aria-hidden="true">
                                    {calendarIcon}
                                </InfoIcon>
                                <InfoBody>
                                    <strong>Availability</strong>
                                    <span>By appointment · Limited spots</span>
                                </InfoBody>
                            </InfoItem>

                            <PanelCard>
                                <div>
                                    <strong
                                        style={{
                                            fontFamily: 'inherit',
                                            display: 'block',
                                            marginBottom: 6,
                                        }}
                                    >
                                        Follow along
                                    </strong>
                                    <PanelNote>
                                        See lessons, horses, and barn life in
                                        action.
                                    </PanelNote>
                                </div>
                                <SocialRow>
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
                                </SocialRow>
                            </PanelCard>
                        </Panel>
                    </Layout>
                </Container>
            </Section>
        </>
    )
}
