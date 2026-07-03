import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'

import { bp, Container, Section, SectionHeader } from '../primitives'

type Lesson = {
    title: string
    meta: string
    description: string
    image: string
    to: string
}

const LESSONS: Lesson[] = [
    {
        title: 'Private Lessons',
        meta: '$50 / hr · $35 / 30 min',
        description:
            'One-on-one instruction tailored to you—from a first hello with a horse to refining a confident, capable seat.',
        image: SITE_IMAGES.lessons.privateLessons,
        to: '/lessons',
    },
    {
        title: 'Work For Lessons',
        meta: 'Limited spots',
        description:
            'Kids help around the barn in exchange for free riding time—learning responsibility while earning their saddle hours.',
        image: SITE_IMAGES.lessons.workForLessons,
        to: '/lessons',
    },
    {
        title: 'Barrel Racing',
        meta: 'Speed & precision',
        description:
            'Build the timing, balance, and partnership it takes to run a clean, fast cloverleaf pattern with confidence.',
        image: SITE_IMAGES.lessons.barrelRacing,
        to: '/lessons',
    },
    {
        title: 'Pole Bending',
        meta: 'Agility & control',
        description:
            'Sharpen your horsemanship weaving the poles—developing rhythm, control, and trust at every stride.',
        image: SITE_IMAGES.lessons.poleBending,
        to: '/lessons',
    },
]

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: repeat(4, 1fr);
        gap: ${({ theme }) => theme.spacing.lg};
    }
`

const Card = styled(Link)`
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
    color: inherit;
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.25s ease;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 22px 40px rgba(40, 28, 18, 0.14);
        border-color: ${({ theme }) => theme.colors.border.strong};
    }
`

const ImageWrap = styled.div`
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;

    ${Card}:hover & {
        transform: scale(1.07);
    }
`

const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.lg};
    flex: 1;
`

const Meta = styled.span`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentGold};
`

const CardTitle = styled.h3`
    font-size: 1.4rem;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const Desc = styled.p`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

const More = styled.span`
    margin-top: auto;
    padding-top: ${({ theme }) => theme.spacing.sm};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: gap 0.2s ease;

    ${Card}:hover & {
        gap: 12px;
    }
`

export default function LessonOptions() {
    return (
        <Section id="lessons" $alt>
            <Container>
                <SectionHeader
                    center
                    eyebrow="Lesson Options"
                    title="Find the Right Fit"
                    lead="Every rider starts somewhere. Choose the path that suits you—each lesson is built on safety, horsemanship, and genuine confidence."
                />
                <Grid>
                    {LESSONS.map((lesson) => (
                        <Card key={lesson.title} to={lesson.to}>
                            <ImageWrap>
                                <Image
                                    src={lesson.image}
                                    alt={lesson.title}
                                    loading="lazy"
                                />
                            </ImageWrap>
                            <Body>
                                <Meta>{lesson.meta}</Meta>
                                <CardTitle>{lesson.title}</CardTitle>
                                <Desc>{lesson.description}</Desc>
                                <More>Learn more →</More>
                            </Body>
                        </Card>
                    ))}
                </Grid>
            </Container>
        </Section>
    )
}
