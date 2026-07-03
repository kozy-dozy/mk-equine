import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'
import { apiListHorses } from '@/services/shared/HorseService'
import SEO from '@/views/ecom/components/SEO'

import type { HorseDto } from '@shared/dtos'
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

/* ----------------------------------------------------------- Training ── */

type Service = { title: string; detail: string; icon: ReactNode }

const SERVICES: Service[] = [
    {
        title: 'Starting Under Saddle',
        detail: 'Patient, thoughtful starts for young or green horses—building a calm, willing foundation that lasts.',
        icon: (
            <path
                d="M7 3.2C4.6 4.8 3 7.6 3 10.8c0 3.6 2.7 6.6 6.2 7V14a2.8 2.8 0 1 1 5.6 0v3.8c3.5-.4 6.2-3.4 6.2-7 0-3.2-1.6-6-4-7.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
    },
    {
        title: 'Tune-Ups & Refreshers',
        detail: 'Bring an experienced horse back on track or sharpen specific skills with focused, consistent work.',
        icon: (
            <path
                d="M14.5 3.5l6 6-3 3-6-6 3-3zM11 6.5l-7 7V18h4.5l7-7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
    },
    {
        title: 'Groundwork & Confidence',
        detail: 'Solving handling, respect, and confidence issues from the ground up—for safer, happier horses.',
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
        title: 'Speed Event Training',
        detail: 'Barrel and pole conditioning for horses ready to learn the patterns and run with confidence.',
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

const Intro = styled.div`
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`

const IntroText = styled.p`
    font-size: 1.1rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

const ServiceGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing['2xl']};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(2, 1fr);
        gap: ${({ theme }) => theme.spacing.xl};
    }

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: repeat(4, 1fr);
    }
`

const ServiceCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 36px rgba(40, 28, 18, 0.1);
    }
`

const ServiceIcon = styled.span`
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

const ServiceTitle = styled.h3`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const ServiceText = styled.p`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

const TrainingActions = styled.div`
    display: flex;
    justify-content: center;
    margin-top: ${({ theme }) => theme.spacing['2xl']};
`

/* -------------------------------------------------------------- Sales ── */

function specsLine(h: HorseDto) {
    return [h.breed, h.sex, h.age ? `${h.age} yrs` : '']
        .filter(Boolean)
        .join(' · ')
}

function priceLabel(h: HorseDto) {
    return h.price > 0 ? `$${h.price.toLocaleString()}` : 'Inquire'
}

const HorseGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: ${bp.large}) {
        grid-template-columns: repeat(4, 1fr);
        gap: ${({ theme }) => theme.spacing.lg};
    }
`

const HorseCard = styled.article`
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 22px 40px rgba(40, 28, 18, 0.14);
    }
`

const HorseImageWrap = styled.div`
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
`

const HorseImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;

    ${HorseCard}:hover & {
        transform: scale(1.06);
    }
`

const StatusTag = styled.span<{ $pending?: boolean }>`
    position: absolute;
    top: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: ${({ theme }) => theme.radius.full};
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ theme, $pending }) =>
        $pending ? theme.colors.text.muted : theme.colors.secondary};
`

const HorseBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.lg};
    flex: 1;
`

const Discipline = styled.span`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentGold};
`

const HorseName = styled.h3`
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const Specs = styled.span`
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.text.muted};
`

const Blurb = styled.p`
    font-size: 0.92rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
`

const HorseFoot = styled.div`
    margin-top: auto;
    padding-top: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.sm};
`

const Price = styled.span`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 1.3rem;
    color: ${({ theme }) => theme.colors.primary};
`

const InquireLink = styled(Link)`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.accentGold};

    &:hover {
        text-decoration: underline;
    }
`

const SalesNote = styled.p`
    text-align: center;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.muted};
    margin: ${({ theme }) => theme.spacing['2xl']} auto 0;
    max-width: 560px;
`

const EmptyState = styled.div`
    text-align: center;
    max-width: 520px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing['2xl']};
    border: 1px dashed ${({ theme }) => theme.colors.border.strong};
    border-radius: ${({ theme }) => theme.radius.lg};
    background: ${({ theme }) => theme.colors.bg.card};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1.02rem;
    line-height: 1.6;
`

const FALLBACK_IMAGES = SITE_IMAGES.horsesForSale

/* ── Closing ── */

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

export default function HorsesPage() {
    const [horses, setHorses] = useState<HorseDto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const res = await apiListHorses()
                if (mounted) setHorses(res.horses)
            } catch {
                if (mounted) setHorses([])
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => {
            mounted = false
        }
    }, [])

    return (
        <>
            <SEO
                title="Horse Training & Sales"
                description="Professional horse training—starting, tune-ups, groundwork, and speed events—plus quality horses for sale for riders of every level."
                canonicalPath="/horses"
            />

            <PageHero
                eyebrow="Training & Sales"
                title="Training & Horses For Sale"
                lead="Thoughtful, foundation-first training—and well-started horses looking for their next person."
                image={SITE_IMAGES.training.hero}
            />

            {/* Training */}
            <Section id="training">
                <Container>
                    <Intro>
                        <Eyebrow>Horse Training</Eyebrow>
                        <SectionHeader
                            center
                            title="A Patient, Foundation-First Approach"
                        />
                        <IntroText>
                            With 10+ years training my own horses, I focus on calm,
                            consistent work that builds trust and a willing
                            partner. Whether your horse is just starting out or
                            needs a tune-up, every horse is met where they are.
                        </IntroText>
                        <Divider center />
                    </Intro>

                    <ServiceGrid>
                        {SERVICES.map((s) => (
                            <ServiceCard key={s.title}>
                                <ServiceIcon aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        {s.icon}
                                    </svg>
                                </ServiceIcon>
                                <ServiceTitle>{s.title}</ServiceTitle>
                                <ServiceText>{s.detail}</ServiceText>
                            </ServiceCard>
                        ))}
                    </ServiceGrid>

                    <TrainingActions>
                        <Button to="/contact">Inquire About Training</Button>
                    </TrainingActions>
                </Container>
            </Section>

            {/* Sales */}
            <Section id="for-sale" $alt>
                <Container>
                    <SectionHeader
                        center
                        eyebrow="Horses For Sale"
                        title="Find Your Next Partner"
                        lead="A rotating selection of horses I've personally worked with. Each is started right and matched thoughtfully to the right rider."
                    />

                    {!loading && horses.length === 0 ? (
                        <EmptyState>
                            New horses are coming soon. Reach out and I'll let you
                            know as soon as one becomes available.
                        </EmptyState>
                    ) : (
                        <HorseGrid>
                            {horses.map((h, i) => (
                                <HorseCard key={h.id}>
                                    <HorseImageWrap>
                                        <HorseImage
                                            src={
                                                h.imageUrl ||
                                                FALLBACK_IMAGES[
                                                    i % FALLBACK_IMAGES.length
                                                ]
                                            }
                                            alt={h.name}
                                            loading="lazy"
                                        />
                                        <StatusTag
                                            $pending={h.status === 'pending'}
                                        >
                                            {h.status}
                                        </StatusTag>
                                    </HorseImageWrap>
                                    <HorseBody>
                                        <Discipline>{h.discipline}</Discipline>
                                        <HorseName>{h.name}</HorseName>
                                        <Specs>{specsLine(h)}</Specs>
                                        {h.description && (
                                            <Blurb>{h.description}</Blurb>
                                        )}
                                        <HorseFoot>
                                            <Price>{priceLabel(h)}</Price>
                                            <InquireLink to="/contact">
                                                Inquire →
                                            </InquireLink>
                                        </HorseFoot>
                                    </HorseBody>
                                </HorseCard>
                            ))}
                        </HorseGrid>
                    )}

                    <SalesNote>
                        Availability changes often. Reach out for current horses,
                        full details, video, or to arrange a visit.
                    </SalesNote>
                </Container>
            </Section>

            <Section>
                <Container>
                    <Closing>
                        <Eyebrow>Let's Talk Horses</Eyebrow>
                        <ClosingTitle>
                            Looking for training or your next horse? I'd love to
                            help.
                        </ClosingTitle>
                        <Button to="/contact">Get In Touch</Button>
                    </Closing>
                </Container>
            </Section>
        </>
    )
}
