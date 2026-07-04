import styled from 'styled-components'

import { COMPANY_CONFIG } from '@/config/company.config'
import { SITE_IMAGES } from '@/config/site-images'
import {
    bp,
    Button,
    Container,
    Divider,
    Eyebrow,
    PageHero,
    Section,
    SectionHeader,
} from '@/views/ecom/components/marketing/primitives'
import SEO from '@/views/ecom/components/SEO'

/* ── Story ── */

const StoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
    align-items: center;

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: 0.9fr 1fr;
        gap: 72px;
    }
`

const Figure = styled.div`
    position: relative;
    margin: 0;

    &::before {
        content: '';
        position: absolute;
        inset: 20px -20px -20px 20px;
        border: 2px solid ${({ theme }) => theme.colors.accentGold};
        border-radius: ${({ theme }) => theme.radius.lg};
        z-index: 0;
    }
`

const Portrait = styled.img`
    position: relative;
    z-index: 1;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: 0 24px 48px rgba(40, 28, 18, 0.18);
    display: block;
`

const StoryBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`

const StoryTitle = styled.h2`
    font-size: clamp(1.9rem, 1.2rem + 2.6vw, 2.9rem);
    line-height: 1.12;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const Para = styled.p`
    font-size: 1.05rem;
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

const Signature = styled.p`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 1.5rem;
    font-style: italic;
    color: ${({ theme }) => theme.colors.primary};
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
`

/* ── Stat strip ── */

const Stats = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: repeat(4, 1fr);
    }
`

const Stat = styled.div`
    text-align: center;

    strong {
        display: block;
        font-family: ${({ theme }) => theme.typography.fontPrimary};
        font-size: clamp(2.2rem, 1.6rem + 2vw, 3rem);
        line-height: 1;
        color: ${({ theme }) => theme.colors.accentGold};
    }

    span {
        display: block;
        margin-top: ${({ theme }) => theme.spacing.sm};
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.text.inverseMuted};
    }
`

const StatBand = styled(Section)`
    background: ${({ theme }) => theme.colors.primary};
`

/* ── Values ── */

const ValueGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(3, 1fr);
    }
`

const ValueCard = styled.div`
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 36px rgba(40, 28, 18, 0.1);
    }
`

const ValueIcon = styled.span`
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.accentGold};

    svg {
        width: 26px;
        height: 26px;
    }
`

const ValueTitle = styled.h3`
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const ValueText = styled.p`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

/* ── Closing CTA ── */

const Closing = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
`

const ClosingTitle = styled.h2`
    font-size: clamp(1.8rem, 1.2rem + 2.4vw, 2.6rem);
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
    max-width: 620px;
`

const VALUES = [
    {
        title: 'Safety First',
        text: 'Every lesson starts on the ground. Confidence around horses begins with knowing how to stay safe and read what a horse is telling you.',
        icon: (
            <path
                d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3zM9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
    },
    {
        title: 'Confidence Over Everything',
        text: 'Riders grow at their own pace. We celebrate the small wins—the first catch, the first canter—because that’s where real confidence is built.',
        icon: (
            <path
                d="M12 20s-7-4.3-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.7 12 20 12 20z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
    },
    {
        title: 'Real Horsemanship',
        text: 'Riding is only part of it. Students learn to catch, groom, saddle, and truly partner with a horse—skills that last a lifetime.',
        icon: (
            <path
                d="M5 21c0-4 1.5-6.5 4-8L7.5 9 6 9.5 4.5 7l4-1.5L11 3l1.5 2.5c4 .8 6.5 4 6.5 8.5v7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
    },
]

export default function AboutPage() {
    return (
        <>
            <SEO
                title={`About ${COMPANY_CONFIG.name}`}
                description={COMPANY_CONFIG.tagline}
                canonicalPath="/about"
            />

            <PageHero
                eyebrow="Our Story"
                title="Meet Your Instructor"
                lead="Helping riders of every age build confidence, learn horsemanship, and fall in love with horses."
                image={SITE_IMAGES.about.secondary}
            />

            <Section>
                <Container>
                    <StoryGrid>
                        <Figure>
                            <Portrait
                                src={SITE_IMAGES.about.portrait}
                                alt="Your riding instructor with a horse"
                                loading="lazy"
                            />
                        </Figure>
                        <StoryBody>
                            <Eyebrow>A Lifelong Horsewoman</Eyebrow>
                            <StoryTitle>
                                25 Years In The Saddle—And Still Learning
                            </StoryTitle>
                            <Divider />
                            <Para>
                                I’ve been riding horses for 25 years, training my
                                own for over a decade, and teaching lessons for
                                the past five. What started as a childhood love
                                has become a true passion—helping people find the
                                same joy and confidence that horses have given me.
                            </Para>
                            <Para>
                                My lessons focus on much more than riding.
                                Students learn horse safety, catching and
                                handling, grooming and saddling, and the kind of
                                ground-up horsemanship that builds a strong
                                foundation. From a first hello with a horse to
                                barrel racing and pole bending, I teach all ages
                                and experience levels.
                            </Para>
                            <Signature>— Megan</Signature>
                        </StoryBody>
                    </StoryGrid>
                </Container>
            </Section>

            <StatBand>
                <Container>
                    <Stats>
                        <Stat>
                            <strong>25</strong>
                            <span>Years Riding</span>
                        </Stat>
                        <Stat>
                            <strong>10+</strong>
                            <span>Years Training</span>
                        </Stat>
                        <Stat>
                            <strong>5</strong>
                            <span>Years Teaching</span>
                        </Stat>
                        <Stat>
                            <strong>All</strong>
                            <span>Ages &amp; Levels</span>
                        </Stat>
                    </Stats>
                </Container>
            </StatBand>

            <Section $alt>
                <Container>
                    <SectionHeader
                        center
                        eyebrow="What I Believe"
                        title="My Approach To Teaching"
                        lead="A few things every student can count on, no matter their age or experience."
                    />
                    <ValueGrid>
                        {VALUES.map((v) => (
                            <ValueCard key={v.title}>
                                <ValueIcon aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        {v.icon}
                                    </svg>
                                </ValueIcon>
                                <ValueTitle>{v.title}</ValueTitle>
                                <ValueText>{v.text}</ValueText>
                            </ValueCard>
                        ))}
                    </ValueGrid>
                </Container>
            </Section>

            <Section>
                <Container>
                    <Closing>
                        <Eyebrow>Spots Are Limited</Eyebrow>
                        <ClosingTitle>
                            Let’s see if my program is the right fit for you.
                        </ClosingTitle>
                        <Button to="/book-lesson">Book a Lesson</Button>
                    </Closing>
                </Container>
            </Section>
        </>
    )
}
