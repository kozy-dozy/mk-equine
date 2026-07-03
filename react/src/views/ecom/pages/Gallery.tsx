import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'
import SEO from '@/views/ecom/components/SEO'
import {
    bp,
    Button,
    Container,
    Eyebrow,
    PageHero,
    Section,
} from '@/views/ecom/components/marketing/primitives'

const CAPTIONS = [
    'Morning in the arena',
    'Building a bond',
    'First canter',
    'Out on the trail',
    'Tacking up',
    'Confidence in motion',
    'Groundwork basics',
    'Quiet moments',
    'Learning to lead',
    'Golden hour ride',
    'Grooming day',
    'Trusting the reins',
]

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(3, 1fr);
        gap: ${({ theme }) => theme.spacing.lg};
    }

    @media (min-width: ${bp.large}) {
        grid-template-columns: repeat(4, 1fr);
    }
`

const Tile = styled.figure`
    position: relative;
    margin: 0;
    aspect-ratio: 1 / 1;
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
    cursor: pointer;
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
    padding: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.inverse};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.9rem;
    font-weight: 600;
    background: linear-gradient(
        to top,
        rgba(40, 28, 18, 0.62) 0%,
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
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing['3xl']};
    text-align: center;
`

const FootText = styled.p`
    font-size: 1.05rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
    max-width: 520px;
`

export default function GalleryPage() {
    return (
        <>
            <SEO
                title="Photo Gallery"
                description="A look at lessons, riders, and barn life—moments of confidence and connection from the saddle."
                canonicalPath="/gallery"
            />

            <PageHero
                eyebrow="Photo Gallery"
                title="Moments From The Barn"
                lead="A look at the riders, the horses, and the quiet wins that happen here every day."
                image={SITE_IMAGES.gallery[2]}
            />

            <Section>
                <Container>
                    <Grid>
                        {SITE_IMAGES.galleryFull.map((src, i) => (
                            <Tile key={`${src}-${i}`}>
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
                        <Eyebrow>Want To Be In The Next One?</Eyebrow>
                        <FootText>
                            Come spend some time in the saddle—reach out to book
                            your first lesson.
                        </FootText>
                        <Button to="/contact">Book a Lesson</Button>
                    </Foot>
                </Container>
            </Section>
        </>
    )
}
