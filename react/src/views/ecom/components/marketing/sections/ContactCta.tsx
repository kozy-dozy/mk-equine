import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'

import { bp, Button, Divider, Eyebrow, OutlineButton } from '../primitives'

const Band = styled.section`
    position: relative;
    isolation: isolate;
    color: ${({ theme }) => theme.colors.text.inverse};
    background-image: url(${SITE_IMAGES.contactCta});
    background-size: cover;
    background-position: center;
    background-attachment: scroll;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: linear-gradient(
            180deg,
            rgba(40, 28, 18, 0.72) 0%,
            rgba(40, 28, 18, 0.6) 100%
        );
    }
`

const Inner = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 80px ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.lg};

    @media (min-width: ${bp.tablet}) {
        padding: 120px ${({ theme }) => theme.spacing.xl};
    }
`

const Title = styled.h2`
    font-size: clamp(2rem, 1.3rem + 3vw, 3.25rem);
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin: 0;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.25);
`

const Text = styled.p`
    font-size: 1.1rem;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    margin: 0;
    max-width: 540px;
`

const Actions = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.sm};
`

export default function ContactCta() {
    return (
        <Band>
            <Inner>
                <Eyebrow>Spots Are Limited</Eyebrow>
                <Title>Ready To Get In The Saddle?</Title>
                <Divider center />
                <Text>
                    Whether it’s a first lesson or a fresh challenge, I’d love to
                    meet you and see if my program is the right fit. Reach out and
                    let’s find a time.
                </Text>
                <Actions>
                    <Button to="/contact">Book a Lesson</Button>
                    <OutlineButton to="/about" $onDark>
                        Meet Your Instructor
                    </OutlineButton>
                </Actions>
            </Inner>
        </Band>
    )
}
