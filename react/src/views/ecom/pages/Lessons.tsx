import type { ReactNode } from 'react'
import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'
import { trackEvent } from '@/utils/analytics/googleAnalytics'
import SEO from '@/views/ecom/components/SEO'
import {
    bp,
    Button,
    Container,
    Divider,
    Eyebrow,
    PageHero,
    Section,
} from '@/views/ecom/components/marketing/primitives'

type Lesson = {
    title: string
    meta: string
    image: string
    body: ReactNode
    points: string[]
}

const LESSONS: Lesson[] = [
    {
        title: 'Private Lessons',
        meta: '$50 / hour · $35 / 30 min',
        image: SITE_IMAGES.lessons.privateLessons,
        body: 'One-on-one instruction tailored entirely to you. Whether it’s your very first time meeting a horse or you’re polishing an already-confident seat, private lessons move at your pace and focus on what you want to achieve.',
        points: [
            'Fully individualized to your age and skill',
            'Ground work and mounted riding',
            'Flexible 30 or 60-minute sessions',
        ],
    },
    {
        title: 'Work For Lessons',
        meta: 'Limited spots available',
        image: SITE_IMAGES.lessons.workForLessons,
        body: 'A hands-on way for kids to earn saddle time. Students help around the barn—grooming, feeding, and daily care—in exchange for free riding lessons. It’s a wonderful way to learn responsibility while falling in love with horses.',
        points: [
            'Free riding time in exchange for barn help',
            'Builds responsibility and real horsemanship',
            'Great for dedicated young riders',
        ],
    },
    {
        title: 'Barrel Racing',
        meta: 'Speed & precision',
        image: SITE_IMAGES.lessons.barrelRacing,
        body: 'Ready to pick up the pace? Barrel racing instruction builds the timing, balance, and partnership it takes to run a clean cloverleaf pattern—safely and with confidence, one stride at a time.',
        points: [
            'Pattern work and approach timing',
            'Balance and control at speed',
            'For riders with a solid foundation',
        ],
    },
    {
        title: 'Pole Bending',
        meta: 'Agility & control',
        image: SITE_IMAGES.lessons.poleBending,
        body: 'Sharpen your horsemanship weaving the poles. Pole bending develops rhythm, precision, and trust between horse and rider—an exciting next step for riders ready to refine their control.',
        points: [
            'Weaving patterns and rein control',
            'Rhythm and responsiveness',
            'Builds a sharper, more connected ride',
        ],
    },
]

/* ── Intro ── */

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

/* ── Feature rows ── */

const Row = styled.div<{ $reverse?: boolean }>`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: center;

    & + & {
        margin-top: ${({ theme }) => theme.spacing['3xl']};
    }

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: 1fr 1fr;
        gap: 64px;

        > figure {
            order: ${({ $reverse }) => ($reverse ? 2 : 1)};
        }
        > div {
            order: ${({ $reverse }) => ($reverse ? 1 : 2)};
        }
    }
`

const Figure = styled.figure`
    margin: 0;
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
    box-shadow: 0 20px 44px rgba(40, 28, 18, 0.14);
`

const Photo = styled.img`
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
`

const RowBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`

const RowMeta = styled.span`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentGold};
`

const RowTitle = styled.h2`
    font-size: clamp(1.7rem, 1.2rem + 2vw, 2.4rem);
    line-height: 1.15;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const RowText = styled.p`
    font-size: 1.02rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

const Points = styled.ul`
    list-style: none;
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`

const Point = styled.li`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.98rem;
    color: ${({ theme }) => theme.colors.text.primary};

    svg {
        flex-shrink: 0;
        margin-top: 3px;
        width: 18px;
        height: 18px;
        color: ${({ theme }) => theme.colors.secondary};
    }
`

const Actions = styled.div`
    margin-top: ${({ theme }) => theme.spacing.sm};
`

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
            <path
                d="M8 12.5l2.5 2.5L16 9.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

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
    max-width: 600px;
`

export default function LessonsPage() {
    return (
        <>
            <SEO
                title="Lessons & Programs"
                description="Private horseback riding lessons, a work-for-lessons program, and barrel racing & pole bending instruction for all ages and levels."
                canonicalPath="/lessons"
            />

            <PageHero
                eyebrow="Lessons & Programs"
                title="Ride, Learn & Grow"
                lead="From a first hello with a horse to running the barrels—lessons built on safety, horsemanship, and genuine confidence."
                image={SITE_IMAGES.lessons.privateLessons}
            />

            <Section>
                <Container>
                    <Intro>
                        <Eyebrow>For Every Rider</Eyebrow>
                        <IntroText>
                            I teach all ages and experience levels, and every
                            lesson focuses on much more than riding—horse safety,
                            handling, grooming, saddling, and the confidence that
                            comes from real horsemanship.
                        </IntroText>
                        <Divider center />
                    </Intro>
                </Container>
            </Section>

            <Section $alt $tight>
                <Container>
                    {LESSONS.map((lesson, i) => (
                        <Row key={lesson.title} $reverse={i % 2 === 1}>
                            <Figure>
                                <Photo
                                    src={lesson.image}
                                    alt={lesson.title}
                                    loading="lazy"
                                />
                            </Figure>
                            <RowBody>
                                <RowMeta>{lesson.meta}</RowMeta>
                                <RowTitle>{lesson.title}</RowTitle>
                                <RowText>{lesson.body}</RowText>
                                <Points>
                                    {lesson.points.map((p) => (
                                        <Point key={p}>
                                            <CheckIcon />
                                            {p}
                                        </Point>
                                    ))}
                                </Points>
                                <Actions>
                                    <Button
                                        to="/book-lesson"
                                        onClick={() =>
                                            trackEvent('lesson_cta_click', {
                                                lesson: lesson.title,
                                            })
                                        }
                                    >
                                        Book This Lesson
                                    </Button>
                                </Actions>
                            </RowBody>
                        </Row>
                    ))}
                </Container>
            </Section>

            <Section>
                <Container>
                    <Closing>
                        <Eyebrow>Spots Are Limited</Eyebrow>
                        <ClosingTitle>
                            Not sure which lesson is right? Let’s figure it out
                            together.
                        </ClosingTitle>
                        <Button
                            to="/contact"
                            onClick={() =>
                                trackEvent('lesson_cta_click', {
                                    lesson: 'closing_get_in_touch',
                                })
                            }
                        >
                            Get In Touch
                        </Button>
                    </Closing>
                </Container>
            </Section>
        </>
    )
}
