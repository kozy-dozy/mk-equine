import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'

import { bp, Container, Section, SectionHeader } from '../primitives'

type Testimonial = {
    quote: string
    name: string
    role: string
    avatar: string
}

const TESTIMONIALS: Testimonial[] = [
    {
        quote: "My daughter was nervous around horses at first. A few lessons in, she's grooming, saddling, and riding with the biggest smile. The patience here is something special.",
        name: 'Sarah M.',
        role: 'Parent of a young rider',
        avatar: SITE_IMAGES.testimonials.avatarA,
    },
    {
        quote: 'I started never having touched a horse. Now I’m running barrels with confidence. Every lesson builds on the last, and safety always comes first.',
        name: 'Jordan T.',
        role: 'Adult beginner',
        avatar: SITE_IMAGES.testimonials.avatarB,
    },
    {
        quote: 'The work-for-lessons program taught my son responsibility and gave him a love of horses I never expected. Worth every early morning at the barn.',
        name: 'Dani R.',
        role: 'Parent of a teen rider',
        avatar: SITE_IMAGES.testimonials.avatarC,
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
        grid-template-columns: repeat(3, 1fr);
    }
`

const Card = styled.blockquote`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    margin: 0;
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: 0 10px 30px rgba(40, 28, 18, 0.05);
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(40, 28, 18, 0.1);
    }
`

const Mark = styled.span`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 3.5rem;
    line-height: 0.6;
    height: 28px;
    color: ${({ theme }) => theme.colors.accentGold};
    opacity: 0.55;
`

const Quote = styled.p`
    font-size: 1.02rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    flex: 1;
`

const Author = styled.footer`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`

const Avatar = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
`

const Who = styled.div`
    display: flex;
    flex-direction: column;
    line-height: 1.3;

    strong {
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        font-size: 0.95rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.dark};
    }

    span {
        font-size: 0.82rem;
        color: ${({ theme }) => theme.colors.text.muted};
    }
`

export default function Testimonials() {
    return (
        <Section $alt>
            <Container>
                <SectionHeader
                    center
                    eyebrow="Kind Words"
                    title="Loved By Riders & Families"
                    lead="From first-timers to barrel racers, here’s what students and parents have to say."
                />
                <Grid>
                    {TESTIMONIALS.map((t) => (
                        <Card key={t.name}>
                            <Mark aria-hidden="true">&ldquo;</Mark>
                            <Quote>{t.quote}</Quote>
                            <Author>
                                <Avatar src={t.avatar} alt="" loading="lazy" />
                                <Who>
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </Who>
                            </Author>
                        </Card>
                    ))}
                </Grid>
            </Container>
        </Section>
    )
}
