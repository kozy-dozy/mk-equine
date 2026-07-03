import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'

import { bp, Container, OutlineButton, Section, SectionHeader } from '../primitives'

const CAPTIONS = [
    'Morning in the arena',
    'Building a bond',
    'First canter',
    'Out on the trail',
    'Tacking up',
    'Confidence in motion',
]

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(3, 1fr);
        gap: ${({ theme }) => theme.spacing.lg};
    }
`

const Tile = styled.figure`
    position: relative;
    margin: 0;
    aspect-ratio: 4 / 5;
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
    cursor: pointer;

    /* a couple of feature tiles span wider on desktop for an editorial feel */
    @media (min-width: ${bp.desktop}) {
        &:nth-child(1),
        &:nth-child(6) {
            grid-column: span 2;
            aspect-ratio: auto;
        }
    }
`

const Img = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.55s ease;

    ${Tile}:hover & {
        transform: scale(1.08);
    }
`

const Caption = styled.figcaption`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    padding: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text.inverse};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    background: linear-gradient(
        to top,
        rgba(40, 28, 18, 0.6) 0%,
        rgba(40, 28, 18, 0) 55%
    );
    opacity: 0;
    transition: opacity 0.3s ease;

    ${Tile}:hover & {
        opacity: 1;
    }
`

const Foot = styled.div`
    display: flex;
    justify-content: center;
    margin-top: ${({ theme }) => theme.spacing['2xl']};
`

export default function GalleryPreview() {
    return (
        <Section id="gallery">
            <Container>
                <SectionHeader
                    center
                    eyebrow="Photo Gallery"
                    title="Moments From The Barn"
                    lead="A look at the riders, the horses, and the quiet wins that happen here every day."
                />
                <Grid>
                    {SITE_IMAGES.gallery.map((src, i) => (
                        <Tile key={src}>
                            <Img
                                src={src}
                                alt={CAPTIONS[i] ?? 'Gallery photo'}
                                loading="lazy"
                            />
                            <Caption>{CAPTIONS[i] ?? ''}</Caption>
                        </Tile>
                    ))}
                </Grid>
                <Foot>
                    <OutlineButton to="/gallery">View Full Gallery</OutlineButton>
                </Foot>
            </Container>
        </Section>
    )
}
