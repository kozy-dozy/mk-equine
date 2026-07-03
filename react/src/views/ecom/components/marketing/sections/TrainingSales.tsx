import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'

import { bp, Container, Section, SectionHeader } from '../primitives'

type Feature = {
    tag: string
    title: string
    blurb: string
    image: string
    to: string
}

const FEATURES: Feature[] = [
    {
        tag: 'Horse Training',
        title: 'Foundation-First Training',
        blurb: 'From starting young horses to tune-ups, groundwork, and speed events—calm, consistent training that builds a willing partner.',
        image: SITE_IMAGES.training.hero,
        to: '/horses#training',
    },
    {
        tag: 'Horses For Sale',
        title: 'Find Your Next Partner',
        blurb: 'A rotating selection of horses I’ve personally worked with—started right and matched thoughtfully to the right rider.',
        image: SITE_IMAGES.horsesForSale[0],
        to: '/horses#for-sale',
    },
]

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(2, 1fr);
    }
`

const Card = styled(Link)`
    position: relative;
    display: flex;
    align-items: flex-end;
    min-height: 360px;
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text.inverse};
    isolation: isolate;

    @media (min-width: ${bp.desktop}) {
        min-height: 440px;
    }
`

const Bg = styled.img`
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.55s ease;

    ${Card}:hover & {
        transform: scale(1.06);
    }
`

const Overlay = styled.span`
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
        to top,
        rgba(40, 28, 18, 0.85) 0%,
        rgba(40, 28, 18, 0.45) 45%,
        rgba(40, 28, 18, 0.15) 100%
    );
`

const Body = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`

const Tag = styled.span`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentGold};
`

const Title = styled.h3`
    font-size: 1.7rem;
    line-height: 1.15;
    margin: 0;
`

const Blurb = styled.p`
    font-size: 0.98rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    margin: 0;
    max-width: 42ch;
`

const More = styled.span`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.9rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.inverse};
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: gap 0.2s ease;

    ${Card}:hover & {
        gap: 12px;
    }
`

export default function TrainingSales() {
    return (
        <Section>
            <Container>
                <SectionHeader
                    center
                    eyebrow="Beyond Lessons"
                    title="Training & Horses For Sale"
                    lead="More than lessons—I also train horses and help match riders with their next great partner."
                />
                <Grid>
                    {FEATURES.map((f) => (
                        <Card key={f.tag} to={f.to}>
                            <Bg src={f.image} alt={f.title} loading="lazy" />
                            <Overlay />
                            <Body>
                                <Tag>{f.tag}</Tag>
                                <Title>{f.title}</Title>
                                <Blurb>{f.blurb}</Blurb>
                                <More>Learn more →</More>
                            </Body>
                        </Card>
                    ))}
                </Grid>
            </Container>
        </Section>
    )
}
